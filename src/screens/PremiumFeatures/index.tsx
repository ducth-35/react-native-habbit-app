import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../components/ThemeProvider';
import { TextApp } from '../../components';
import { usePremiumStore } from '../../store/usePremiumStore';
import { PREMIUM_FEATURES } from '../../types/premium';
import { goBack, navigate } from '../../navigators/navigation-services';
import { usePremiumFeatureStore } from '../../store/usePremiumThemeStore';
import { APP_SCREEN } from '../../navigators/screen-type';

export const PremiumFeaturesScreen: React.FC = () => {
  const { theme } = useTheme();
  const { coins, actions } = usePremiumStore();
  const { unlockedFeatures, isAdvancedStatsActive, actions: featureActions } = usePremiumFeatureStore();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Load unlocked features when component mounts
    featureActions.loadUnlockedFeatures();
  }, []);

  useEffect(() => {
    console.log('PremiumFeatures - Advanced stats active:', isAdvancedStatsActive);
    console.log('PremiumFeatures - Unlocked features:', unlockedFeatures);
  }, [isAdvancedStatsActive, unlockedFeatures]);

  const handleViewAdvancedStats = () => {
    navigate(APP_SCREEN.ADVANCED_STATISTICS);
  };

  const renderAdvancedStatsCard = () => {
    const feature = PREMIUM_FEATURES.ADVANCED_STATS;

    return (
      <View key={feature.id} style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <Icon name={feature.icon} size={32} color={theme.colors.primary} />
          <View style={styles.itemInfo}>
            <View style={styles.titleRow}>
              <TextApp preset="txt16Bold" style={styles.itemTitle}>
                {feature.name}
              </TextApp>
              <View style={styles.payPerViewBadge}>
                <TextApp style={styles.payPerViewText}>Pay per view</TextApp>
              </View>
            </View>
            <TextApp style={styles.itemDescription}>
              {feature.description}
            </TextApp>
          </View>
          <View style={styles.costContainer}>
            <Icon name="stars" size={16} color={theme.colors.primary} />
            <TextApp preset="txt12Bold" style={styles.costText}>
              {feature.cost}
            </TextApp>
            <TextApp style={styles.perViewText}>per view</TextApp>
          </View>
        </View>

        {/* Feature Benefits */}
        <View style={styles.benefitsContainer}>
          <TextApp preset="txt16Bold" style={styles.benefitsTitle}>
            What you get each time:
          </TextApp>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={16} color={theme.colors.primary} />
            <TextApp style={styles.benefitText}>Detailed progress charts</TextApp>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={16} color={theme.colors.primary} />
            <TextApp style={styles.benefitText}>Weekly & monthly analytics</TextApp>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="check-circle" size={16} color={theme.colors.primary} />
            <TextApp style={styles.benefitText}>Habit insights & trends</TextApp>
          </View>
        </View>

        <TouchableOpacity
          style={styles.viewStatsButton}
          onPress={handleViewAdvancedStats}
        >
          <TextApp preset="txt16Bold" style={styles.viewStatsButtonText}>
            View Statistics (2 coins)
          </TextApp>
          <Icon name="arrow-forward" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      color: theme.colors.text,
      marginLeft: 16,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    coinsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      backgroundColor: theme.colors.card,
      marginHorizontal: 20,
      marginVertical: 16,
      borderRadius: 12,
    },
    coinsText: {
      color: theme.colors.primary,
      marginLeft: 8,
    },
    tabContainer: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginBottom: 16,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: theme.colors.primary,
    },
    tabText: {
      color: theme.colors.text,
    },
    activeTabText: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    itemCard: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    itemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    itemInfo: {
      flex: 1,
      marginLeft: 12,
    },
    itemTitle: {
      color: theme.colors.text,
      marginBottom: 4,
    },
    itemDescription: {
      color: theme.colors.textSecondary,
    },
    costContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    costText: {
      color: theme.colors.primary,
      marginLeft: 4,
    },
    unlockButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignSelf: 'flex-start',
    },
    unlockButtonText: {
      color: '#FFFFFF',
    },
    themePreview: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    currentThemeCard: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    currentBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginLeft: 8,
    },
    currentBadgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '600',
    },
    applyButton: {
      backgroundColor: theme.colors.primary,
    },
    currentButton: {
      backgroundColor: theme.colors.textSecondary,
    },
    currentButtonText: {
      color: '#FFFFFF',
    },
    testButton: {
      backgroundColor: '#FF6B35',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    testButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 12,
    },
    activeFeatureCard: {
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    activeBadge: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginLeft: 8,
    },
    activeBadgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '600',
    },
    benefitsContainer: {
      marginTop: 12,
      marginBottom: 16,
    },
    benefitsTitle: {
      color: theme.colors.text,
      marginBottom: 8,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    benefitText: {
      color: theme.colors.textSecondary,
      marginLeft: 8,
      fontSize: 14,
    },
    activeButton: {
      backgroundColor: theme.colors.textSecondary,
    },
    activeButtonText: {
      color: '#FFFFFF',
    },
    buttonContainer: {
      gap: 12,
    },
    viewStatsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    viewStatsButtonText: {
      color: theme.colors.primary,
      marginRight: 8,
    },
    payPerViewBadge: {
      backgroundColor: '#FF9800',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      marginLeft: 8,
    },
    payPerViewText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '600',
    },
    perViewText: {
      color: theme.colors.textSecondary,
      fontSize: 10,
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
          <TextApp preset="txt18Bold" style={styles.headerTitle}>
            Advanced Statistics
          </TextApp>
        </TouchableOpacity>
      </View>

      <View style={styles.coinsHeader}>
        <Icon name="stars" size={24} color={theme.colors.primary} />
        <TextApp preset="txt18Bold" style={styles.coinsText}>
          {coins.amount} Coins
        </TextApp>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Test Button - Remove in production */}
        {/* <TouchableOpacity
          style={styles.testButton}
          onPress={() => {
            actions.addCoins(10);
            Alert.alert('Added!', '10 coins added for testing');
          }}
        >
          <TextApp style={styles.testButtonText}>💰 Add 10 Coins (Test)</TextApp>
        </TouchableOpacity> */}

        {renderAdvancedStatsCard()}
      </ScrollView>
    </View>
  );
};
