import { MMKV } from 'react-native-mmkv';
import { PremiumCoins } from '../types/iap';

const storage = new MMKV({
  id: 'premium-storage',
  encryptionKey: 'premium-coins-key-2024',
});

const STORAGE_KEYS = {
  COINS: 'premium_coins',
  UNLOCKED_FEATURES: 'unlocked_features',
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

  static saveUnlockedFeatures(data: { unlockedFeatures: string[]; isAdvancedStatsActive: boolean }): void {
    try {
      storage.set(STORAGE_KEYS.UNLOCKED_FEATURES, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save unlocked features:', error);
    }
  }

  static getUnlockedFeatures(): { unlockedFeatures: string[]; isAdvancedStatsActive: boolean } | null {
    try {
      const data = storage.getString(STORAGE_KEYS.UNLOCKED_FEATURES);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Failed to get unlocked features:', error);
      return null;
    }
  }

  static clearUnlockedFeatures(): void {
    try {
      storage.delete(STORAGE_KEYS.UNLOCKED_FEATURES);
    } catch (error) {
      console.error('Failed to clear unlocked features:', error);
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
