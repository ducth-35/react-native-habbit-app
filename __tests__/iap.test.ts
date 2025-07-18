import { PRODUCT_IDS, COINS_CONFIG } from '../src/types/iap';

describe('IAP Configuration', () => {
  test('should have all required product IDs defined', () => {
    expect(PRODUCT_IDS.COIN_049).toBe('coin_049');
    expect(PRODUCT_IDS.COIN_099).toBe('coin_099');
    expect(PRODUCT_IDS.COIN_199).toBe('coin_199');
    expect(PRODUCT_IDS.COIN_499).toBe('coin_499');
  });

  test('should have coins configuration for all products', () => {
    const productIds = Object.values(PRODUCT_IDS);
    
    productIds.forEach(productId => {
      expect(COINS_CONFIG[productId]).toBeDefined();
      expect(COINS_CONFIG[productId].coins).toBeGreaterThan(0);
      expect(COINS_CONFIG[productId].priceUSD).toBeGreaterThan(0);
      expect(COINS_CONFIG[productId].displayPrice).toBeTruthy();
    });
  });

  test('should have correct coin amounts for each product', () => {
    expect(COINS_CONFIG[PRODUCT_IDS.COIN_049].coins).toBe(2);
    expect(COINS_CONFIG[PRODUCT_IDS.COIN_099].coins).toBe(5);
    expect(COINS_CONFIG[PRODUCT_IDS.COIN_199].coins).toBe(12);
    expect(COINS_CONFIG[PRODUCT_IDS.COIN_499].coins).toBe(30);
  });

  test('should have correct prices for each product', () => {
    expect(COINS_CONFIG[PRODUCT_IDS.COIN_049].priceUSD).toBe(0.49);
    expect(COINS_CONFIG[PRODUCT_IDS.COIN_099].priceUSD).toBe(0.99);
    expect(COINS_CONFIG[PRODUCT_IDS.COIN_199].priceUSD).toBe(1.99);
    expect(COINS_CONFIG[PRODUCT_IDS.COIN_499].priceUSD).toBe(4.99);
  });

  test('should have display prices for each product', () => {
    expect(COINS_CONFIG[PRODUCT_IDS.COIN_049].displayPrice).toBe('$0.49');
    expect(COINS_CONFIG[PRODUCT_IDS.COIN_099].displayPrice).toBe('$0.99');
    expect(COINS_CONFIG[PRODUCT_IDS.COIN_199].displayPrice).toBe('$1.99');
    expect(COINS_CONFIG[PRODUCT_IDS.COIN_499].displayPrice).toBe('$4.99');
  });
});
