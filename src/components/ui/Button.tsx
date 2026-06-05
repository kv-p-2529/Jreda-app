import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

// Single source of truth for buttons. If you find yourself styling a
// TouchableOpacity directly anywhere, ask whether this should grow a new
// `variant` or `size` instead — consistency across the app comes from this
// component being the only way to render a button.

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  activeOpacity?: number;
  className?: string; // Support for custom NativeWind wrapper style overrides
  textClassName?: string; // Support for custom NativeWind text style overrides
  style?: StyleProp<ViewStyle>;
}

export default function Button({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  activeOpacity = 0.8,
  className = '',
  textClassName = '',
  style,
}: ButtonProps) {
  // Loading buttons are still disabled — both states share the dimmed look
  // and the press handler is gated by `disabled` on the TouchableOpacity.
  const isButtonDisabled = disabled || loading;

  const baseBtnClasses = 'rounded-full justify-center items-center flex-row';

  // Variant background/border classes
  const variantBtnClasses = {
    primary: 'bg-[#0082FD]',
    secondary: 'bg-slate-200',
    outline: 'border-2 border-[#0082FD] bg-transparent',
    ghost: 'bg-transparent',
    danger: 'bg-red-500',
  }[variant];

  // Size height/padding classes
  const sizeBtnClasses = {
    sm: 'h-10 px-4',
    md: 'h-13 px-6',
    lg: 'h-15 px-8',
  }[size];

  // Disabled and loading opacity classes
  const stateClasses = isButtonDisabled ? 'opacity-60' : '';

  // Combined button classes
  const combinedBtnClasses = `${baseBtnClasses} ${variantBtnClasses} ${sizeBtnClasses} ${stateClasses} ${className}`;

  // Base text classes
  const baseTextClasses = 'font-bold text-center';

  // Variant text color classes
  const variantTextClasses = {
    primary: 'text-white',
    secondary: 'text-slate-800',
    outline: 'text-[#055096]',
    ghost: 'text-[#055096]',
    danger: 'text-white',
  }[variant];

  // Size text size classes
  const sizeTextClasses = {
    sm: 'text-xs',
    md: 'text-base',
    lg: 'text-lg',
  }[size];

  // Combined text classes
  const combinedTextClasses = `${baseTextClasses} ${variantTextClasses} ${sizeTextClasses} ${textClassName}`;

  // Determine indicator color based on variant
  const getLoaderColor = () => {
    if (variant === 'outline' || variant === 'ghost') {
      return '#055096';
    }
    if (variant === 'secondary') {
      return '#1E293B';
    }
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={isButtonDisabled}
      className={combinedBtnClasses}
      style={style}
    >
      <View
        className="flex-row items-center justify-center"
        style={{ flexShrink: 0 }}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={getLoaderColor()}
            className="my-0.5"
          />
        ) : (
          <>
            {leftIcon && <View className="mr-2">{leftIcon}</View>}
            {title ? (
              <Text numberOfLines={1} className={combinedTextClasses}>
                {title}
              </Text>
            ) : (
              children
            )}
            {rightIcon && <View className="ml-2">{rightIcon}</View>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}
