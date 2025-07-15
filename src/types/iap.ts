export interface PremiumCoins {
  amount: number;
  lastUpdated: string;
}

export interface PurchaseState {
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface Product {
  productId: string;
  price: string;
  currency: string;
  title: string;
  description: string;
  localizedPrice: string;
}

export interface Purchase {
  productId: string;
  transactionId: string;
  transactionDate: number;
  transactionReceipt: string;
  purchaseToken?: string;
  dataAndroid?: string;
  signatureAndroid?: string;
  isAcknowledgedAndroid?: boolean;
  purchaseStateAndroid?: number;
  developerPayloadAndroid?: string;
  originalTransactionDateIOS?: string;
  originalTransactionIdentifierIOS?: string;
}

// Product IDs - these should match your Google Play Console configuration
export const PRODUCT_IDS = {
  PREMIUM_COINS_2: 'premium_coins_2',   // $0.99 = 2 coins
  PREMIUM_COINS_4: 'premium_coins_4',   // $1.99 = 4 coins
  PREMIUM_COINS_6: 'premium_coins_6',   // $4.99 = 6 coins
  PREMIUM_COINS_8: 'premium_coins_8',   // $9.99 = 8 coins
} as const;

export type ProductId = typeof PRODUCT_IDS[keyof typeof PRODUCT_IDS];

// Coins configuration for each product
export const COINS_CONFIG = {
  [PRODUCT_IDS.PREMIUM_COINS_2]: {
    coins: 2,
    priceUSD: 0.99,
    displayPrice: '$0.99',
  },
  [PRODUCT_IDS.PREMIUM_COINS_4]: {
    coins: 4,
    priceUSD: 1.99,
    displayPrice: '$1.99',
  },
  [PRODUCT_IDS.PREMIUM_COINS_6]: {
    coins: 6,
    priceUSD: 4.99,
    displayPrice: '$4.99',
  },
  [PRODUCT_IDS.PREMIUM_COINS_8]: {
    coins: 8,
    priceUSD: 9.99,
    displayPrice: '$9.99',
  },
} as const;
