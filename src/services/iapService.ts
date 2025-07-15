import {
  initConnection,
  endConnection,
  getProducts,
  requestPurchase,
  finishTransaction,
  getAvailablePurchases,
  Product as RNIAPProduct,
  Purchase as RNIAPPurchase,
  ProductPurchase,
} from 'react-native-iap';
import { PRODUCT_IDS, Product, Purchase } from '../types/iap';

interface IAPServiceState {
  isInitialized: boolean;
}

let serviceState: IAPServiceState = {
  isInitialized: false,
};

export const initializeIAP = async (): Promise<boolean> => {
  try {
    const result = await initConnection();
    serviceState.isInitialized = result;
    console.log('IAP Connection initialized:', result);
    return result;
  } catch (error) {
    console.error('Failed to initialize IAP connection:', error);
    return false;
  }
};

export const disconnectIAP = async (): Promise<void> => {
  try {
    await endConnection();
    serviceState.isInitialized = false;
    console.log('IAP Connection ended');
  } catch (error) {
    console.error('Failed to end IAP connection:', error);
  }
};

export const getIAPProducts = async (): Promise<Product[]> => {
  if (!serviceState.isInitialized) {
    throw new Error('IAP not initialized');
  }

  try {
    const productIds = Object.values(PRODUCT_IDS);
    const products = await getProducts({ skus: productIds });

    return products.map((product: RNIAPProduct) => ({
      productId: product.productId,
      price: product.price,
      currency: product.currency,
      title: product.title,
      description: product.description,
      localizedPrice: product.localizedPrice,
    }));
  } catch (error) {
    console.error('Failed to get products:', error);
    throw error;
  }
};

export const purchaseProduct = async (productId: string): Promise<Purchase> => {
  if (!serviceState.isInitialized) {
    throw new Error('IAP not initialized');
  }

  try {
    const purchase = await requestPurchase({ sku: productId });
    console.log('Purchase successful:', purchase);

    // Handle the purchase result which can be void, ProductPurchase, or ProductPurchase[]
    if (!purchase || Array.isArray(purchase)) {
      throw new Error('Invalid purchase result');
    }

    const purchaseData = purchase as ProductPurchase;

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
      originalTransactionDateIOS: purchaseData.originalTransactionDateIOS?.toString(),
      originalTransactionIdentifierIOS: purchaseData.originalTransactionIdentifierIOS,
    };

    return result;
  } catch (error) {
    console.error('Purchase failed:', error);
    throw error;
  }
};

export const consumePurchase = async (purchase: Purchase): Promise<void> => {
  try {
    // Use finishTransaction for both platforms with isConsumable flag
    await finishTransaction({
      purchase: purchase as any,
      isConsumable: true,
    });

    console.log('Purchase consumed successfully');
  } catch (error) {
    console.error('Failed to consume purchase:', error);
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
      originalTransactionDateIOS: purchase.originalTransactionDateIOS?.toString(),
      originalTransactionIdentifierIOS: purchase.originalTransactionIdentifierIOS,
    }));
  } catch (error) {
    console.error('Failed to restore purchases:', error);
    throw error;
  }
};

export const isIAPConnected = (): boolean => {
  return serviceState.isInitialized;
};
