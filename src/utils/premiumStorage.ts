import { MMKV } from 'react-native-mmkv';
import { PremiumCoins } from '../types/iap';

const storage = new MMKV({
  id: 'premium-storage',
  encryptionKey: 'premium-coins-key-2024',
});

const STORAGE_KEYS = {
  COINS: 'premium_coins',
} as const;

export class PremiumStorage {
  static saveCoins(coins: PremiumCoins): void {
    try {
      storage.set(STORAGE_KEYS.COINS, JSON.stringify(coins));
    } catch (error) {
      console.log('Failed to save coins:', error);
    }
  }

  static getCoins(): PremiumCoins | null {
    try {
      const coinsData = storage.getString(STORAGE_KEYS.COINS);
      if (coinsData) {
        return JSON.parse(coinsData);
      }
      return null;
    } catch (error) {
      console.log('Failed to get coins:', error);
      return null;
    }
  }

  static clearCoins(): void {
    try {
      storage.delete(STORAGE_KEYS.COINS);
    } catch (error) {
      console.log('Failed to clear coins:', error);
    }
  }

  static clearAll(): void {
    try {
      storage.clearAll();
    } catch (error) {
      console.log('Failed to clear all premium data:', error);
    }
  }
}
