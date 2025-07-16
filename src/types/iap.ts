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

// Product IDs - these match your Google Play Console configuration
export const PRODUCT_IDS = {
  COIN_049: 'coin_049',   // $0.49 = 2 coins
  COIN_099: 'coin_099',   // $0.99 = 5 coins
  COIN_199: 'coin_199',   // $1.99 = 12 coins
  COIN_499: 'coin_499',   // $4.99 = 30 coins
} as const;

export type ProductId = typeof PRODUCT_IDS[keyof typeof PRODUCT_IDS];

// Coins configuration for each product
export const COINS_CONFIG = {
  [PRODUCT_IDS.COIN_049]: {
    coins: 2,
    priceUSD: 0.49,
    displayPrice: '$0.49',
  },
  [PRODUCT_IDS.COIN_099]: {
    coins: 5,
    priceUSD: 0.99,
    displayPrice: '$0.99',
  },
  [PRODUCT_IDS.COIN_199]: {
    coins: 12,
    priceUSD: 1.99,
    displayPrice: '$1.99',
  },
  [PRODUCT_IDS.COIN_499]: {
    coins: 30,
    priceUSD: 4.99,
    displayPrice: '$4.99',
  },
} as const;
