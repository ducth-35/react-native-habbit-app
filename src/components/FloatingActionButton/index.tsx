import React from 'react';
import {TouchableOpacity, StyleSheet, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTheme} from '../ThemeProvider';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  size?: number;
  bottom?: number;
  right?: number;
  backgroundColor?: string;
  iconColor?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = 'add',
  size = 56,
  bottom = 24,
  right = 24,
  backgroundColor,
  iconColor = '#FFFFFF',
}) => {
  const {theme} = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      bottom,
      right,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: backgroundColor || theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  });

  return (
    <Animated.View style={{transform: [{scale: scaleAnim}]}}>
      <TouchableOpacity
        style={styles.fab}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}>
        <Icon name={icon} size={size * 0.5} color={iconColor} />
      </TouchableOpacity>
    </Animated.View>
  );
};
