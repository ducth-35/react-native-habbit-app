import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../../components/ThemeProvider';
import {TextApp} from '../../components';
import {usePremiumStore} from '../../store/usePremiumStore';
import {COINS_CONFIG, PRODUCT_IDS} from '../../types/iap';
import {goBack, navigate} from '../../navigators/navigation-services';
import {APP_SCREEN} from '../../navigators/screen-type';

export const PremiumStoreScreen: React.FC = () => {
  const {theme} = useTheme();
  const {coins, purchaseState, products, actions} = usePremiumStore();
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
        [{text: 'OK'}],
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
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Buy',
          onPress: async () => {
            const result = await actions.purchaseCoins(productId);
            if (result.success) {
              const coinsReceived = result.coinsAdded || coinsConfig.coins;
              Alert.alert(
                'Success!',
                `You received ${coinsReceived} Premium Coins!`,
                [{text: 'OK'}],
              );
            } else if (purchaseState.error) {
              Alert.alert('Error', purchaseState.error, [
                {text: 'OK', onPress: () => actions.clearError()},
              ]);
            }
          },
        },
      ],
    );
  };

  const handleDebugLogs = () => {
    const logs = actions.getDebugLogs();
    Alert.alert(
      'Debug Logs',
      'Logs copied to console. Check React Native debugger.',
      [
        {text: 'OK'},
        {
          text: 'Copy to Clipboard',
          onPress: () => {
            // In a real app, you'd use Clipboard API
            console.log('=== IAP DEBUG LOGS ===');
            console.log(logs);
          }
        }
      ]
    );
  };

  const handleRestorePurchases = async () => {
    if (purchaseState.isLoading) return;

    await actions.restorePurchases();
    Alert.alert(
      'Restore Complete',
      'Previous purchases have been checked and restored.',
      [{text: 'OK'}],
    );
  };

  const handleForceReloadProducts = async () => {
    if (purchaseState.isLoading) return;

    try {
      await actions.forceReloadProducts();
      Alert.alert(
        'Products Reloaded',
        `Successfully reloaded ${products.length} products from store.`,
        [{text: 'OK'}],
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to reload products. Check debug logs for details.',
        [{text: 'OK'}],
      );
    }
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
    debugButton: {
      padding: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.border,
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
      shadowOffset: {width: 0, height: 2},
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
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionTitle: {
      color: theme.colors.text,
      marginBottom: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    viewFeaturesButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewFeaturesText: {
      color: theme.colors.primary,
      marginRight: 4,
    },
    featuresPreview: {
      marginBottom: 24,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    featureText: {
      color: theme.colors.textSecondary,
      marginLeft: 8,
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
    privacyButton: {
      backgroundColor: 'transparent',
      alignItems: 'center',
      marginTop: 8,
    },
    privacyButtonText: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
  });

  if (isInitializing || !purchaseState.isInitialized) {
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
            {isInitializing ? 'Connecting to store...' : 'Loading products...'}
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

        {/* Debug button - only show in development */}
        {__DEV__ && (
          <TouchableOpacity
            style={styles.debugButton}
            onPress={handleDebugLogs}
          >
            <Icon name="bug-report" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        )}
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
          <TextApp style={styles.coinsLabel}>Premium Coins</TextApp>
        </View>

        {/* What You Can Do Section */}
        <View style={styles.purchaseSection}>
          <View style={styles.sectionHeader}>
            <TextApp style={styles.sectionTitle}>Advanced Statistics</TextApp>
            <TouchableOpacity
              style={styles.viewFeaturesButton}
              onPress={() => navigate(APP_SCREEN.PREMIUM_FEATURES)}
            >
              <TextApp style={styles.viewFeaturesText}>View Details</TextApp>
              <Icon name="arrow-forward" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.featuresPreview}>
            <View style={styles.featureItem}>
              <Icon name="analytics" size={20} color={theme.colors.primary} />
              <TextApp style={styles.featureText}>Detailed progress charts</TextApp>
            </View>
            <View style={styles.featureItem}>
              <Icon name="trending-up" size={20} color={theme.colors.primary} />
              <TextApp style={styles.featureText}>Weekly & monthly analytics</TextApp>
            </View>
            <View style={styles.featureItem}>
              <Icon name="insights" size={20} color={theme.colors.primary} />
              <TextApp style={styles.featureText}>Habit insights & trends</TextApp>
            </View>
            <View style={styles.featureItem}>
              <Icon name="stars" size={20} color={theme.colors.primary} />
              <TextApp style={styles.featureText}>Only 2 coins per view</TextApp>
            </View>
          </View>
        </View>

        {/* Purchase Section */}
        <View style={styles.purchaseSection}>
          <TextApp style={styles.sectionTitle}>Buy Premium Coins</TextApp>

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
                      • Unlock Advanced Statistics{'\n'}
                      • Detailed progress charts{'\n'}
                      • Weekly & monthly analytics{'\n'}
                      • Habit insights & trends
                    </TextApp>
                  </View>
                  <TextApp preset="txt16Bold" style={styles.productPrice}>
                    {coinsConfig.displayPrice}
                  </TextApp>
                </View>

                <TouchableOpacity
                  style={styles.purchaseButton}
                  onPress={() => handlePurchaseCoins(productId)}
                  disabled={
                    purchaseState.isLoading || !purchaseState.isInitialized
                  }>
                
                    <TextApp preset="txt16Bold" style={styles.purchaseButtonText}>
                      Buy Now
                    </TextApp>
               
                </TouchableOpacity>
              </View>
            );
          })}

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestorePurchases}
            disabled={purchaseState.isLoading || !purchaseState.isInitialized}>
            <TextApp style={styles.restoreButtonText}>
              Restore Purchases
            </TextApp>
          </TouchableOpacity>

          {/* Debug button to reload products - only show in development */}
          {__DEV__ && (
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleForceReloadProducts}
              disabled={purchaseState.isLoading || !purchaseState.isInitialized}>
              <TextApp style={styles.restoreButtonText}>
                Reload Products ({products.length})
              </TextApp>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.privacyButton}
            onPress={() => navigate(APP_SCREEN.PRIVACY_POLICY)}>
            <TextApp style={styles.privacyButtonText}>
              Privacy Policy
            </TextApp>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
