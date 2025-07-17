export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
}

// Premium features configuration
export const PREMIUM_FEATURES: Record<string, PremiumFeature> = {
  ADVANCED_STATS: {
    id: 'advanced_stats',
    name: 'Advanced Statistics',
    description: 'Unlock detailed progress charts, weekly/monthly analytics, and habit insights',
    cost: 2,
    icon: 'analytics',
  },
};

export interface PremiumState {
  unlockedFeatures: string[];
  isAdvancedStatsActive: boolean;
}
