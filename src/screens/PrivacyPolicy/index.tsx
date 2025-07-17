import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../components/ThemeProvider';
import { TextApp } from '../../components';
import { goBack } from '../../navigators/navigation-services';

export const PrivacyPolicyScreen: React.FC = () => {
  const { theme } = useTheme();

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
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      color: theme.colors.text,
      marginBottom: 12,
    },
    sectionText: {
      color: theme.colors.textSecondary,
      lineHeight: 24,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
          <TextApp preset="txt18Bold" style={styles.headerTitle}>
            Privacy Policy
          </TextApp>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <TextApp preset="txt16Bold" style={styles.sectionTitle}>
            Information We Collect
          </TextApp>
          <TextApp style={styles.sectionText}>
            Minhabit stores your habit data locally on your device. We do not collect or transmit personal information to external servers.
          </TextApp>
        </View>

        <View style={styles.section}>
          <TextApp preset="txt16Bold" style={styles.sectionTitle}>
            In-App Purchases
          </TextApp>
          <TextApp style={styles.sectionText}>
            Premium coins are processed through Google Play Store. We do not store payment information. Purchase data is handled according to Google's privacy policies.
          </TextApp>
        </View>

        <View style={styles.section}>
          <TextApp preset="txt16Bold" style={styles.sectionTitle}>
            Data Storage
          </TextApp>
          <TextApp style={styles.sectionText}>
            All habit tracking data and premium features are stored locally on your device using secure storage methods.
          </TextApp>
        </View>

        <View style={styles.section}>
          <TextApp preset="txt16Bold" style={styles.sectionTitle}>
            Premium Features
          </TextApp>
          <TextApp style={styles.sectionText}>
            Premium coins unlock advanced statistics These features are activated locally on your device.
          </TextApp>
        </View>

        <View style={styles.section}>
          <TextApp preset="txt16Bold" style={styles.sectionTitle}>
            Contact Us
          </TextApp>
          <TextApp style={styles.sectionText}>
            If you have questions about this privacy policy, please contact us through the app store.
          </TextApp>
        </View>

        <View style={styles.section}>
          <TextApp preset="txt12Regular" style={styles.sectionText}>
            Last updated: {new Date().toLocaleDateString()}
          </TextApp>
        </View>
      </ScrollView>
    </View>
  );
};
