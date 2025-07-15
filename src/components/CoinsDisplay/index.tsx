import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../ThemeProvider';
import { usePremiumStore } from '../../store/usePremiumStore';
import { navigate } from '../../navigators/navigation-services';
import { APP_SCREEN } from '../../navigators/screen-type';
import TextApp from '../textApp';

interface CoinsDisplayProps {
  showLabel?: boolean;
  onPress?: () => void;
}

export const CoinsDisplay: React.FC<CoinsDisplayProps> = ({ 
  showLabel = false, 
  onPress 
}) => {
  const { theme } = useTheme();
  const { coins, actions } = usePremiumStore();

  useEffect(() => {
    // Load coins data when component mounts
    actions.loadCoinsData();
  }, []);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigate(APP_SCREEN.PREMIUM_STORE);
    }
  };

  const formatCoins = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    icon: {
      marginRight: 4,
    },
    coinsText: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    label: {
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Icon 
        name="stars" 
        size={16} 
        color={theme.colors.primary} 
        style={styles.icon} 
      />
      <View>
        <TextApp preset="txt14SemiBold" style={styles.coinsText}>
          {formatCoins(coins.amount)}
        </TextApp>
        {showLabel && (
          <TextApp preset="txt12Regular" style={styles.label}>
            Coins
          </TextApp>
        )}
      </View>
    </TouchableOpacity>
  );
};
