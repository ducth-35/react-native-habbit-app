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
  isIAPConnected
} from '../services/iapService';
import { PremiumStorage } from '../utils/premiumStorage';

interface PremiumState {
  coins: PremiumCoins;
  purchaseState: PurchaseState;
  products: Product[];
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
    
    // Utility
    clearError: () => void;
    resetPurchaseState: () => void;
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

  actions: {
    initializeIAP: async (): Promise<boolean> => {
      set(state => ({
        purchaseState: { ...state.purchaseState, isLoading: true, error: null }
      }));

      try {
        const isInitialized = await initializeIAP();

        set(state => ({
          purchaseState: {
            ...state.purchaseState,
            isInitialized,
            isLoading: false
          }
        }));

        if (isInitialized) {
          // Load products after successful initialization
          await get().actions.loadProducts();
        }

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
        // Purchase the product
        const purchase = await purchaseProduct(productId);

        // Get coins amount for this product
        const coinsConfig = COINS_CONFIG[productId as keyof typeof COINS_CONFIG];
        if (!coinsConfig) {
          throw new Error('Invalid product ID');
        }

        // Add coins to user's balance
        get().actions.addCoins(coinsConfig.coins);

        // Consume the purchase so it can be bought again
        await consumePurchase(purchase);

        set(state => ({
          purchaseState: { ...state.purchaseState, isLoading: false }
        }));

        console.log('Purchase completed successfully');
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Purchase failed';
        set(state => ({
          purchaseState: {
            ...state.purchaseState,
            isLoading: false,
            error: errorMessage
          }
        }));
        console.log('Purchase failed:', error);
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
  },
}));
