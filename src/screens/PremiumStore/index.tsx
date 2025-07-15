import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../components/ThemeProvider';
import { TextApp } from '../../components';
import { usePremiumStore } from '../../store/usePremiumStore';
import { COINS_CONFIG, PRODUCT_IDS } from '../../types/iap';
import { goBack } from '../../navigators/navigation-services';

export const PremiumStoreScreen: React.FC = () => {
  const { theme } = useTheme();
  const { coins, purchaseState, products, actions } = usePremiumStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initializeStore();
    
    // Load coins data
    actions.loadCoinsData();

    return () => {
      // Cleanup on unmount
      actions.disconnectIAP();
    };
  }, []);

  const initializeStore = async () => {
    setIsInitializing(true);
    const success = await actions.initializeIAP();
    if (!success) {
      Alert.alert(
        'Error',
        'Unable to connect to store. Please try again later.',
        [{ text: 'OK' }]
      );
    }
    setIsInitializing(false);
  };

  const handlePurchaseCoins = async (productId: string) => {
    if (purchaseState.isLoading) return;

    const coinsConfig = COINS_CONFIG[productId as keyof typeof COINS_CONFIG];
    if (!coinsConfig) return;

    Alert.alert(
      'Confirm Purchase',
      `Do you want to buy ${coinsConfig.coins} Premium Coins for ${coinsConfig.displayPrice}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: async () => {
            const success = await actions.purchaseCoins(productId);
            if (success) {
              Alert.alert(
                'Success!',
                `You received ${coinsConfig.coins} Premium Coins!`,
                [{ text: 'OK' }]
              );
            } else if (purchaseState.error) {
              Alert.alert(
                'Error',
                purchaseState.error,
                [{ text: 'OK', onPress: () => actions.clearError() }]
              );
            }
          },
        },
      ]
    );
  };

  const handleRestorePurchases = async () => {
    if (purchaseState.isLoading) return;

    await actions.restorePurchases();
    Alert.alert(
      'Restore Complete',
      'Previous purchases have been checked and restored.',
      [{ text: 'OK' }]
    );
  };



  const formatCoins = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
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
    content: {
      flex: 1,
      padding: 20,
    },
    coinsSection: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    coinsIcon: {
      marginBottom: 12,
    },
    coinsAmount: {
      color: theme.colors.primary,
      marginBottom: 8,
    },
    coinsLabel: {
      color: theme.colors.textSecondary,
    },
    purchaseSection: {
      backgroundColor: theme.colors.card,
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionTitle: {
      color: theme.colors.text,
      marginBottom: 16,
    },
    productCard: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    productHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    productInfo: {
      marginLeft: 12,
      flex: 1,
    },
    productTitle: {
      color: theme.colors.text,
      marginBottom: 4,
    },
    productDescription: {
      color: theme.colors.textSecondary,
    },
    productPrice: {
      color: theme.colors.primary,
      textAlign: 'right',
    },
    purchaseButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      paddingHorizontal: 24,
      alignItems: 'center',
      marginTop: 12,
    },
    purchaseButtonDisabled: {
      backgroundColor: theme.colors.textSecondary,
    },
    purchaseButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      color: theme.colors.text,
      marginTop: 16,
    },
    restoreButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
      marginTop: 16,
    },
    restoreButtonText: {
      color: theme.colors.primary,
      fontWeight: '500',
    },
  });

  if (isInitializing) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Icon name="arrow-back" size={24} color={theme.colors.text} />
            <TextApp preset="txt18Bold" style={styles.headerTitle}>
              Premium Store
            </TextApp>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <TextApp preset="txt16Regular" style={styles.loadingText}>
            Connecting to store...
          </TextApp>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
          <TextApp preset="txt18Bold" style={styles.headerTitle}>
            Premium Store
          </TextApp>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Coins */}
        <View style={styles.coinsSection}>
          <View style={styles.coinsIcon}>
            <Icon name="stars" size={48} color={theme.colors.primary} />
          </View>
          <TextApp preset="txt32Bold" style={styles.coinsAmount}>
            {formatCoins(coins.amount)}
          </TextApp>
          <TextApp style={styles.coinsLabel}>
            Premium Coins
          </TextApp>
        </View>

        {/* Purchase Section */}
        <View style={styles.purchaseSection}>
          <TextApp style={styles.sectionTitle}>
            Buy Premium Coins
          </TextApp>

          {Object.entries(PRODUCT_IDS).map(([, productId]) => {
            const coinsConfig = COINS_CONFIG[productId];
            return (
              <View key={productId} style={styles.productCard}>
                <View style={styles.productHeader}>
                  <Icon name="stars" size={32} color={theme.colors.primary} />
                  <View style={styles.productInfo}>
                    <TextApp preset="txt16Bold" style={styles.productTitle}>
                      {coinsConfig.coins} Premium Coins
                    </TextApp>
                    <TextApp style={styles.productDescription}>
                      Unlock premium features and special themes
                    </TextApp>
                  </View>
                  <TextApp preset="txt16Bold" style={styles.productPrice}>
                    {coinsConfig.displayPrice}
                  </TextApp>
                </View>

                <TouchableOpacity
                  style={[
                    styles.purchaseButton,
                    (purchaseState.isLoading || !purchaseState.isInitialized) &&
                    styles.purchaseButtonDisabled,
                  ]}
                  onPress={() => handlePurchaseCoins(productId)}
                  disabled={purchaseState.isLoading || !purchaseState.isInitialized}
                >
                  {purchaseState.isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <TextApp preset="txt16Bold" style={styles.purchaseButtonText}>
                      Buy Now
                    </TextApp>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestorePurchases}
            disabled={purchaseState.isLoading || !purchaseState.isInitialized}
          >
            <TextApp style={styles.restoreButtonText}>
              Restore Purchases
            </TextApp>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
