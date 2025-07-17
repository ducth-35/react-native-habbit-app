import { create } from 'zustand';
import { 
  PremiumCoins, 
  PurchaseState, 
  Product, 
  Purchase, 
  PRODUCT_IDS, 
  COINS_CONFIG 
} from '../types/iap';
import {
  initializeIAP,
  disconnectIAP,
  getIAPProducts,
  purchaseProduct,
  consumePurchase,
  restorePurchases,
  setPurchaseCallbacks,
  clearPurchaseCallbacks,
  acknowledgePurchase
} from '../services/iapService';
import { PremiumStorage } from '../utils/premiumStorage';
import { iapLogger } from '../utils/iapLogger';

interface PremiumState {
  coins: PremiumCoins;
  purchaseState: PurchaseState;
  products: Product[];
  processedTransactions: Set<string>; // Track processed transaction IDs
  actions: {
    // IAP initialization
    initializeIAP: () => Promise<boolean>;
    disconnectIAP: () => Promise<void>;
    
    // Products
    loadProducts: () => Promise<void>;
    
    // Purchase
    purchaseCoins: (productId: string) => Promise<boolean>;
    restorePurchases: () => Promise<void>;
    
    // Coins management
    addCoins: (amount: number) => void;
    spendCoins: (amount: number) => boolean;
    loadCoinsData: () => void;
    saveCoinsData: () => void;
    
    // Purchase handling
    handlePurchaseUpdate: (purchase: Purchase) => Promise<void>;
    handlePurchaseError: (error: any) => void;
    processPendingPurchases: () => Promise<void>;

    // Utility
    clearError: () => void;
    resetPurchaseState: () => void;
    getDebugLogs: () => string;
  };
}

const initialCoins: PremiumCoins = {
  amount: 0,
  lastUpdated: new Date().toISOString(),
};

const initialPurchaseState: PurchaseState = {
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const usePremiumStore = create<PremiumState>((set, get) => ({
  coins: initialCoins,
  purchaseState: initialPurchaseState,
  products: [],
  processedTransactions: new Set<string>(),

  actions: {
    initializeIAP: async (): Promise<boolean> => {
      set(state => ({
        purchaseState: { ...state.purchaseState, isLoading: true, error: null }
      }));

      try {
        const isInitialized = await initializeIAP();

        if (isInitialized) {
          // Set up purchase callbacks
          setPurchaseCallbacks(
            // Purchase success callback
            async (purchase: Purchase) => {
              console.log('Purchase callback triggered:', purchase);
              await get().actions.handlePurchaseUpdate(purchase);
            },
            // Purchase error callback
            (error: any) => {
              console.log('Purchase error callback triggered:', error);
              get().actions.handlePurchaseError(error);
            }
          );

          // Load products after successful initialization
          await get().actions.loadProducts();

          // Check for any pending purchases that need to be processed
          await get().actions.processPendingPurchases();
        }

        set(state => ({
          purchaseState: {
            ...state.purchaseState,
            isInitialized,
            isLoading: false
          }
        }));

        return isInitialized;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize IAP';
        set(state => ({
          purchaseState: {
            ...state.purchaseState,
            isLoading: false,
            error: errorMessage,
            isInitialized: false
          }
        }));
        return false;
      }
    },

    disconnectIAP: async (): Promise<void> => {
      try {
        // Clear purchase callbacks
        clearPurchaseCallbacks();

        await disconnectIAP();
        set(state => ({
          purchaseState: {
            ...state.purchaseState,
            isInitialized: false
          }
        }));
      } catch (error) {
        console.log('Failed to disconnect IAP:', error);
      }
    },

    loadProducts: async (): Promise<void> => {
      if (!get().purchaseState.isInitialized) {
        return;
      }

      set(state => ({
        purchaseState: { ...state.purchaseState, isLoading: true, error: null }
      }));

      try {
        const products = await getIAPProducts();
        set(state => ({
          products,
          purchaseState: { ...state.purchaseState, isLoading: false }
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load products';
        set(state => ({
          purchaseState: {
            ...state.purchaseState,
            isLoading: false,
            error: errorMessage
          }
        }));
      }
    },

    purchaseCoins: async (productId: string): Promise<boolean> => {
      if (!get().purchaseState.isInitialized) {
        set(state => ({
          purchaseState: {
            ...state.purchaseState,
            error: 'IAP not initialized'
          }
        }));
        return false;
      }

      set(state => ({
        purchaseState: { ...state.purchaseState, isLoading: true, error: null }
      }));

      try {
        // First, try to process any pending purchases for this product
        await get().actions.processPendingPurchases();

        // Purchase the product
        await purchaseProduct(productId);

        // The purchase will be handled by the purchase listener
        // Just set loading to false here
        set(state => ({
          purchaseState: { ...state.purchaseState, isLoading: false }
        }));

        console.log('Purchase request completed successfully');
        return true;
      } catch (error) {
        console.log('Purchase failed:', error);

        let errorMessage = error instanceof Error ? error.message : 'Purchase failed';

        // Handle specific error cases
        if (errorMessage.includes('You already own this item')) {
          console.log('Attempting to process existing purchase...');

          // Try to process pending purchases
          try {
            await get().actions.processPendingPurchases();

            set(state => ({
              purchaseState: { ...state.purchaseState, isLoading: false }
            }));

            return true; // Consider it successful if we processed pending purchases
          } catch (pendingError) {
            console.log('Failed to process pending purchases:', pendingError);
            errorMessage = 'Please try again in a moment.';
          }
        }

        set(state => ({
          purchaseState: {
            ...state.purchaseState,
            isLoading: false,
            error: errorMessage
          }
        }));

        return false;
      }
    },

    restorePurchases: async (): Promise<void> => {
      if (!get().purchaseState.isInitialized) {
        return;
      }

      set(state => ({
        purchaseState: { ...state.purchaseState, isLoading: true, error: null }
      }));

      try {
        const purchases = await restorePurchases();

        // Process restored purchases
        let totalCoinsToAdd = 0;
        for (const purchase of purchases) {
          const coinsConfig = COINS_CONFIG[purchase.productId as keyof typeof COINS_CONFIG];
          if (coinsConfig) {
            totalCoinsToAdd += coinsConfig.coins;
          }
        }

        if (totalCoinsToAdd > 0) {
          get().actions.addCoins(totalCoinsToAdd);
        }

        set(state => ({
          purchaseState: { ...state.purchaseState, isLoading: false }
        }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to restore purchases';
        set(state => ({
          purchaseState: {
            ...state.purchaseState,
            isLoading: false,
            error: errorMessage
          }
        }));
      }
    },

    addCoins: (amount: number): void => {
      set(state => ({
        coins: {
          amount: state.coins.amount + amount,
          lastUpdated: new Date().toISOString(),
        }
      }));
      get().actions.saveCoinsData();
    },

    spendCoins: (amount: number): boolean => {
      const currentCoins = get().coins.amount;
      if (currentCoins >= amount) {
        set(state => ({
          coins: {
            amount: state.coins.amount - amount,
            lastUpdated: new Date().toISOString(),
          }
        }));
        get().actions.saveCoinsData();
        return true;
      }
      return false;
    },

    loadCoinsData: (): void => {
      try {
        const savedCoins = PremiumStorage.getCoins();
        if (savedCoins) {
          set({ coins: savedCoins });
        }
      } catch (error) {
        console.log('Failed to load coins data:', error);
      }
    },

    saveCoinsData: (): void => {
      try {
        const { coins } = get();
        PremiumStorage.saveCoins(coins);
      } catch (error) {
        console.log('Failed to save coins data:', error);
      }
    },

    clearError: (): void => {
      set(state => ({
        purchaseState: { ...state.purchaseState, error: null }
      }));
    },

    resetPurchaseState: (): void => {
      set(state => ({
        purchaseState: {
          ...state.purchaseState,
          isLoading: false,
          error: null
        }
      }));
    },

    handlePurchaseUpdate: async (purchase: Purchase): Promise<void> => {
      iapLogger.info('STORE', 'Processing purchase update', {
        productId: purchase.productId,
        transactionId: purchase.transactionId,
        purchaseStateAndroid: purchase.purchaseStateAndroid,
        isAcknowledgedAndroid: purchase.isAcknowledgedAndroid
      });

      try {
        // Check purchase state for Android
        if (purchase.purchaseStateAndroid !== undefined) {
          // PurchaseStateAndroid: 0 = UNSPECIFIED, 1 = PURCHASED, 2 = PENDING
          if (purchase.purchaseStateAndroid !== 1) {
            iapLogger.warn('STORE', `Purchase not in PURCHASED state: ${purchase.purchaseStateAndroid}`, {
              productId: purchase.productId,
              transactionId: purchase.transactionId
            });
            return; // Don't process pending or unspecified purchases
          }
        }

        // Create a unique transaction identifier
        const transactionKey = `${purchase.productId}_${purchase.transactionId}_${purchase.transactionDate}`;

        // Check if this transaction has already been processed
        const currentState = get();
        if (currentState.processedTransactions.has(transactionKey)) {
          iapLogger.transactionSkipped(transactionKey, 'Already processed');
          return;
        }

        // Get coins amount for this product
        const coinsConfig = COINS_CONFIG[purchase.productId as keyof typeof COINS_CONFIG];
        if (!coinsConfig) {
          console.log('Invalid product ID in purchase:', purchase.productId);
          return;
        }

        // Mark transaction as being processed
        set(state => ({
          processedTransactions: new Set([...state.processedTransactions, transactionKey])
        }));

        // Add coins to user's balance
        get().actions.addCoins(coinsConfig.coins);
        iapLogger.coinsAdded(coinsConfig.coins, purchase.productId, purchase.transactionId);

        // Consume the purchase so it can be bought again
        await consumePurchase(purchase);
        iapLogger.transactionProcessed(transactionKey);

      } catch (error) {
        console.log('Error processing purchase update:', error);

        // Remove from processed transactions if there was an error
        const transactionKey = `${purchase.productId}_${purchase.transactionId}_${purchase.transactionDate}`;
        set(state => {
          const newProcessedTransactions = new Set(state.processedTransactions);
          newProcessedTransactions.delete(transactionKey);
          return {
            processedTransactions: newProcessedTransactions,
            purchaseState: {
              ...state.purchaseState,
              error: error instanceof Error ? error.message : 'Failed to process purchase'
            }
          };
        });
      }
    },

    handlePurchaseError: (error: any): void => {
      console.log('Handling purchase error:', error);

      let errorMessage = 'Purchase failed';

      if (error?.message) {
        errorMessage = error.message;

        // Handle specific error cases
        if (error.message.includes('You already own this item')) {
          errorMessage = 'This item is already owned. Please try again in a moment.';
          // Trigger pending purchases processing
          setTimeout(() => {
            get().actions.processPendingPurchases();
          }, 1000);
        }
      }

      set(state => ({
        purchaseState: {
          ...state.purchaseState,
          isLoading: false,
          error: errorMessage
        }
      }));
    },

    processPendingPurchases: async (): Promise<void> => {
      iapLogger.info('STORE', 'Processing pending purchases...');

      try {
        const purchases = await restorePurchases();
        iapLogger.info('STORE', `Found ${purchases.length} pending purchases`);

        let processedCount = 0;
        let acknowledgedCount = 0;

        for (const purchase of purchases) {
          try {
            // Check if purchase needs acknowledgment (Android only)
            if (purchase.purchaseToken && purchase.isAcknowledgedAndroid === false) {
              iapLogger.info('STORE', 'Found unacknowledged purchase, acknowledging...', {
                productId: purchase.productId,
                transactionId: purchase.transactionId
              });

              // Acknowledge the purchase
              await acknowledgePurchase(purchase);
              acknowledgedCount++;
            }

            // Process the purchase
            await get().actions.handlePurchaseUpdate(purchase);
            processedCount++;
          } catch (error) {
            iapLogger.error('STORE', 'Error processing individual purchase', {
              productId: purchase.productId,
              transactionId: purchase.transactionId,
              error
            });
          }
        }

        if (processedCount > 0 || acknowledgedCount > 0) {
          iapLogger.info('STORE', `Processed ${processedCount} purchases, acknowledged ${acknowledgedCount} purchases`);
        }
      } catch (error) {
        iapLogger.error('STORE', 'Error processing pending purchases', error);
      }
    },

    getDebugLogs: (): string => {
      const logs = iapLogger.getLogsAsString();
      const state = get();

      const debugInfo = [
        '=== IAP DEBUG INFORMATION ===',
        `Timestamp: ${new Date().toISOString()}`,
        `Coins: ${state.coins.amount}`,
        `Purchase State: ${JSON.stringify(state.purchaseState)}`,
        `Processed Transactions: ${state.processedTransactions.size}`,
        `Products: ${state.products.length}`,
        '',
        '=== TRANSACTION LOGS ===',
        logs,
        '',
        '=== PROCESSED TRANSACTIONS ===',
        Array.from(state.processedTransactions).join('\n'),
      ].join('\n');

      return debugInfo;
    },
  },
}));
