import { create } from 'zustand';
import { PremiumState } from '../types/premium';
import { PremiumStorage } from '../utils/premiumStorage';

interface PremiumFeatureState extends PremiumState {
  actions: {
    unlockFeature: (featureId: string) => void;
    activateAdvancedStats: () => void;
    loadUnlockedFeatures: () => void;
    saveUnlockedFeatures: () => void;
  };
}

export const usePremiumFeatureStore = create<PremiumFeatureState>((set, get) => ({
  unlockedFeatures: [],
  isAdvancedStatsActive: false,

  actions: {
    unlockFeature: (featureId: string) => {
      console.log('Unlocking feature:', featureId);
      set(state => {
        const newUnlockedFeatures = [...state.unlockedFeatures];
        if (!newUnlockedFeatures.includes(featureId)) {
          newUnlockedFeatures.push(featureId);
        }
        console.log('New unlocked features:', newUnlockedFeatures);
        return { unlockedFeatures: newUnlockedFeatures };
      });
      get().actions.saveUnlockedFeatures();
    },

    activateAdvancedStats: () => {
      console.log('Activating advanced stats');
      set({ isAdvancedStatsActive: true });
      get().actions.saveUnlockedFeatures();
    },

    loadUnlockedFeatures: () => {
      try {
        const savedData = PremiumStorage.getUnlockedFeatures();
        if (savedData) {
          set({
            unlockedFeatures: savedData.unlockedFeatures || [],
            isAdvancedStatsActive: savedData.isAdvancedStatsActive || false,
          });
        }
      } catch (error) {
        console.error('Failed to load unlocked features:', error);
      }
    },

    saveUnlockedFeatures: () => {
      try {
        const { unlockedFeatures, isAdvancedStatsActive } = get();
        PremiumStorage.saveUnlockedFeatures({
          unlockedFeatures,
          isAdvancedStatsActive,
        });
      } catch (error) {
        console.error('Failed to save unlocked features:', error);
      }
    },
  },
}));
