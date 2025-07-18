import {
  initConnection,
  endConnection,
  getProducts,
  requestPurchase,
  finishTransaction,
  getAvailablePurchases,
  purchaseUpdatedListener,
  purchaseErrorListener,
  acknowledgePurchaseAndroid,
  Product as RNIAPProduct,
  Purchase as RNIAPPurchase,
  ProductPurchase,
  PurchaseError,
  PurchaseStateAndroid,
} from 'react-native-iap';
import {PRODUCT_IDS, Product, Purchase} from '../types/iap';
import {iapLogger} from '../utils/iapLogger';
import {Alert} from 'react-native';

interface IAPServiceState {
  isInitialized: boolean;
  purchaseUpdateSubscription?: any;
  purchaseErrorSubscription?: any;
}

let serviceState: IAPServiceState = {
  isInitialized: false,
  purchaseUpdateSubscription: null,
  purchaseErrorSubscription: null,
};

// Purchase callback type
type PurchaseCallback = (purchase: Purchase) => Promise<void>;
type PurchaseErrorCallback = (error: PurchaseError) => void;

let purchaseCallback: PurchaseCallback | null = null;
let purchaseErrorCallback: PurchaseErrorCallback | null = null;

export const initializeIAP = async (): Promise<boolean> => {
  iapLogger.info('INIT', 'Starting IAP initialization');

  try {
    const result = await initConnection();
    serviceState.isInitialized = result;

    if (result) {
      // Set up purchase listeners
      setupPurchaseListeners();
      iapLogger.info('INIT', 'IAP initialized successfully with listeners');
    } else {
      iapLogger.warn('INIT', 'IAP initialization returned false');
    }

    return result;
  } catch (error) {
    iapLogger.error('INIT', 'Failed to initialize IAP connection', error);
    return false;
  }
};

export const disconnectIAP = async (): Promise<void> => {
  try {
    // Remove purchase listeners
    if (serviceState.purchaseUpdateSubscription) {
      serviceState.purchaseUpdateSubscription.remove();
      serviceState.purchaseUpdateSubscription = null;
    }
    if (serviceState.purchaseErrorSubscription) {
      serviceState.purchaseErrorSubscription.remove();
      serviceState.purchaseErrorSubscription = null;
    }

    await endConnection();
    serviceState.isInitialized = false;
    console.log('IAP Connection ended');
  } catch (error) {
    console.log('Failed to end IAP connection:', error);
  }
};

export const getIAPProducts = async (): Promise<Product[]> => {
  if (!serviceState.isInitialized) {
    throw new Error('IAP not initialized');
  }

  try {
    const productIds = Object.values(PRODUCT_IDS);
    iapLogger.info('PRODUCTS', `Fetching products from store: ${productIds.join(', ')}`);

    const products = await getProducts({skus: productIds});

    iapLogger.info('PRODUCTS', `Successfully fetched ${products.length} products from store`, {
      productIds: products.map(p => p.productId),
      requestedIds: productIds
    });

    if (products.length === 0) {
      throw new Error('No products returned from store. Check your product IDs in the store console.');
    }

    // Check if all requested products were returned
    const returnedIds = products.map(p => p.productId);
    const missingIds = productIds.filter(id => !returnedIds.includes(id));
    if (missingIds.length > 0) {
      iapLogger.warn('PRODUCTS', `Some products not found in store: ${missingIds.join(', ')}`);
    }

    return products.map((product: RNIAPProduct) => ({
      productId: product.productId,
      price: product.price,
      currency: product.currency,
      title: product.title,
      description: product.description,
      localizedPrice: product.localizedPrice,
    }));
  } catch (error) {
    iapLogger.error('PRODUCTS', 'Failed to get products from store', error);
    throw error;
  }
};

export const purchaseProduct = async (
  productId: string,
  retryCount = 0,
): Promise<Purchase> => {
  const maxRetries = 2;

  if (!serviceState.isInitialized) {
    throw new Error('IAP not initialized');
  }

  // Validate product ID
  const validProductIds = Object.values(PRODUCT_IDS);
  if (!validProductIds.includes(productId as any)) {
    throw new Error(
      `Invalid product ID: ${productId}. Valid IDs: ${validProductIds.join(
        ', ',
      )}`,
    );
  }

  iapLogger.info(
    'PURCHASE',
    `Attempting to purchase product (attempt ${retryCount + 1}/${
      maxRetries + 1
    }): ${productId}`,
  );

  try {
    const purchase = await requestPurchase({skus: [productId]});

    // Handle the purchase result which can be void, ProductPurchase, or ProductPurchase[]
    if (!purchase || Array.isArray(purchase)) {
      throw new Error('Invalid purchase result');
    }

    const purchaseData = purchase as ProductPurchase;
    iapLogger.purchaseSuccess(
      productId,
      purchaseData.transactionId || 'unknown',
    );

    // Validate purchase data
    if (!purchaseData.productId) {
      throw new Error('Purchase missing product ID');
    }

    // Convert to our Purchase type
    const result: Purchase = {
      productId: purchaseData.productId,
      transactionId: purchaseData.transactionId || '',
      transactionDate: purchaseData.transactionDate || Date.now(),
      transactionReceipt: purchaseData.transactionReceipt || '',
      purchaseToken: purchaseData.purchaseToken,
      dataAndroid: purchaseData.dataAndroid,
      signatureAndroid: purchaseData.signatureAndroid,
      isAcknowledgedAndroid: purchaseData.isAcknowledgedAndroid,
      purchaseStateAndroid: purchaseData.purchaseStateAndroid,
      developerPayloadAndroid: purchaseData.developerPayloadAndroid,
      originalTransactionDateIOS:
        purchaseData.originalTransactionDateIOS?.toString(),
      originalTransactionIdentifierIOS:
        purchaseData.originalTransactionIdentifierIOS,
    };

    // Final validation
    if (!result.productId || result.productId !== productId) {
      throw new Error('Purchase product ID mismatch');
    }

    return result;
  } catch (error) {
    iapLogger.purchaseFailed(productId, error);

    // Retry logic for certain errors
    if (retryCount < maxRetries) {
      const errorMessage = error instanceof Error ? error.message : '';

      // Don't retry for "already own" errors
      if (!errorMessage.includes('You already own this item')) {
        // Retry for network or temporary errors
        if (
          errorMessage.includes('network') ||
          errorMessage.includes('timeout') ||
          errorMessage.includes('connection') ||
          errorMessage.includes('Invalid purchase result')
        ) {
          iapLogger.info(
            'PURCHASE',
            `Retrying purchase in ${(retryCount + 1) * 1000}ms...`,
          );

          await new Promise(resolve =>
            setTimeout(resolve, (retryCount + 1) * 1000),
          );
          return purchaseProduct(productId, retryCount + 1);
        }
      }
    }

    throw error;
  }
};

// Acknowledge purchase for Android (required to prevent auto-refund)
export const acknowledgePurchase = async (
  purchase: Purchase,
): Promise<void> => {
  try {
    // Only acknowledge on Android if not already acknowledged
    if (purchase.purchaseToken && purchase.isAcknowledgedAndroid === false) {
      iapLogger.acknowledgeStarted(purchase.productId, purchase.transactionId);

      await acknowledgePurchaseAndroid({
        token: purchase.purchaseToken,
        developerPayload: purchase.developerPayloadAndroid,
      });

      iapLogger.acknowledgeSuccess(purchase.productId, purchase.transactionId);
    } else {
      iapLogger.info(
        'ACKNOWLEDGE',
        `Purchase already acknowledged or not Android`,
        {
          productId: purchase.productId,
          transactionId: purchase.transactionId,
          isAcknowledgedAndroid: purchase.isAcknowledgedAndroid,
          hasPurchaseToken: !!purchase.purchaseToken,
        },
      );
    }
  } catch (error) {
    iapLogger.acknowledgeFailed(
      purchase.productId,
      purchase.transactionId,
      error,
    );
    throw error;
  }
};

export const consumePurchase = async (
  purchase: Purchase,
  retryCount = 0,
): Promise<void> => {
  const maxRetries = 3;

  try {
    // Validate purchase before consuming
    if (!purchase.productId || !purchase.transactionId) {
      throw new Error('Invalid purchase data: missing required fields');
    }

    iapLogger.consumeStarted(purchase.productId, purchase.transactionId);

    // Step 1: Acknowledge the purchase first (Android requirement)
    await acknowledgePurchase(purchase);

    // Step 2: Consume/finish the transaction
    // Use finishTransaction for both platforms with isConsumable flag
    // Cast to any to avoid type conflicts between our Purchase type and react-native-iap types
    await finishTransaction({
      purchase: purchase as any,
      isConsumable: true,
    });

    iapLogger.consumeSuccess(purchase.productId, purchase.transactionId);
  } catch (error) {
    iapLogger.consumeFailed(purchase.productId, purchase.transactionId, error);

    // Retry logic for certain errors
    if (retryCount < maxRetries) {
      const errorMessage = error instanceof Error ? error.message : '';

      // Retry for network or temporary errors
      if (
        errorMessage.includes('network') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('connection')
      ) {
        iapLogger.info(
          'CONSUME',
          `Retrying consume purchase in ${(retryCount + 1) * 1000}ms...`,
        );

        await new Promise(resolve =>
          setTimeout(resolve, (retryCount + 1) * 1000),
        );
        return consumePurchase(purchase, retryCount + 1);
      }
    }

    throw error;
  }
};

export const restorePurchases = async (): Promise<Purchase[]> => {
  if (!serviceState.isInitialized) {
    throw new Error('IAP not initialized');
  }

  try {
    const purchases = await getAvailablePurchases();

    return purchases.map((purchase: RNIAPPurchase) => ({
      productId: purchase.productId,
      transactionId: purchase.transactionId || '',
      transactionDate: purchase.transactionDate || Date.now(),
      transactionReceipt: purchase.transactionReceipt || '',
      purchaseToken: purchase.purchaseToken,
      dataAndroid: purchase.dataAndroid,
      signatureAndroid: purchase.signatureAndroid,
      isAcknowledgedAndroid: purchase.isAcknowledgedAndroid,
      purchaseStateAndroid: purchase.purchaseStateAndroid,
      developerPayloadAndroid: purchase.developerPayloadAndroid,
      originalTransactionDateIOS:
        purchase.originalTransactionDateIOS?.toString(),
      originalTransactionIdentifierIOS:
        purchase.originalTransactionIdentifierIOS,
    }));
  } catch (error) {
    console.log('Failed to restore purchases:', error);
    throw error;
  }
};

export const isIAPConnected = (): boolean => {
  return serviceState.isInitialized;
};

// Setup purchase listeners
const setupPurchaseListeners = () => {
  console.log('Setting up purchase listeners...');

  // Purchase update listener
  serviceState.purchaseUpdateSubscription = purchaseUpdatedListener(
    async (purchase: ProductPurchase) => {
      iapLogger.info('LISTENER', 'Purchase update received', {
        productId: purchase.productId,
        transactionId: purchase.transactionId,
        purchaseStateAndroid: purchase.purchaseStateAndroid,
        isAcknowledgedAndroid: purchase.isAcknowledgedAndroid,
      });

      try {
        // Convert to our Purchase type
        const convertedPurchase: Purchase = {
          productId: purchase.productId,
          transactionId: purchase.transactionId || '',
          transactionDate: purchase.transactionDate || Date.now(),
          transactionReceipt: purchase.transactionReceipt || '',
          purchaseToken: purchase.purchaseToken,
          dataAndroid: purchase.dataAndroid,
          signatureAndroid: purchase.signatureAndroid,
          isAcknowledgedAndroid: purchase.isAcknowledgedAndroid,
          purchaseStateAndroid: purchase.purchaseStateAndroid,
          developerPayloadAndroid: purchase.developerPayloadAndroid,
          originalTransactionDateIOS:
            purchase.originalTransactionDateIOS?.toString(),
          originalTransactionIdentifierIOS:
            purchase.originalTransactionIdentifierIOS,
        };

        // Immediately acknowledge the purchase to prevent auto-refund
        try {
          await acknowledgePurchase(convertedPurchase);
        } catch (ackError) {
          iapLogger.error(
            'LISTENER',
            'Failed to acknowledge purchase in listener',
            ackError,
          );
          // Continue processing even if acknowledge fails
        }

        // Call the registered callback if available
        if (purchaseCallback) {
          await purchaseCallback(convertedPurchase);
        }
      } catch (error) {
        iapLogger.error('LISTENER', 'Error processing purchase update', error);
      }
    },
  );

  // Purchase error listener
  serviceState.purchaseErrorSubscription = purchaseErrorListener(
    (error: PurchaseError) => {
      console.log('Purchase error received:', error);

      // Call the registered error callback if available
      if (purchaseErrorCallback) {
        purchaseErrorCallback(error);
      }
    },
  );
};

// Register callbacks for purchase events
export const setPurchaseCallbacks = (
  onPurchase: PurchaseCallback,
  onError: PurchaseErrorCallback,
) => {
  purchaseCallback = onPurchase;
  purchaseErrorCallback = onError;
};

// Clear callbacks
export const clearPurchaseCallbacks = () => {
  purchaseCallback = null;
  purchaseErrorCallback = null;
};
