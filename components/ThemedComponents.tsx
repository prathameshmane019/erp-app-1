// components/ThemedComponents.tsx
import React from 'react';
import { 
    Text, 
    View, 
    TouchableOpacity, 
    StyleSheet, 
    TextProps, 
    ViewProps, 
    TouchableOpacityProps,
    Modal,
    ScrollView,
    TextInput,
    Switch,
    Platform,
  } from 'react-native';

  import { COLORS, TYPOGRAPHY, SIZES, BORDERRADIUS, SHADOW } from '@/constants';
// Themed Text Component
interface ThemedTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body1' | 'body2' | 'subtitle1' | 'subtitle2' | 'caption';
  color?: keyof typeof COLORS.text;
  weight?: keyof typeof TYPOGRAPHY.fontWeight;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'body1',
  color = 'primary',
  weight = 'regular',
  style,
  ...props
}) => {
  return (
    <Text
      style={[
        {
          fontFamily: TYPOGRAPHY.fontFamily.regular,
          fontSize: TYPOGRAPHY.fontSize[variant],
          fontWeight: TYPOGRAPHY.fontWeight[weight],
          color: COLORS.text[color],
        },
        style,
      ]}
      {...props}
    />
  );
};

// Themed Button Component
interface ThemedButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  style,
  ...props
}) => {
  const buttonStyles = StyleSheet.create({
    button: {
      paddingVertical: size === 'small' ? SIZES.small : 
                       size === 'large' ? SIZES.large : SIZES.medium,
      paddingHorizontal: size === 'small' ? SIZES.medium : 
                         size === 'large' ? SIZES.xlarge : SIZES.large,
      borderRadius: BORDERRADIUS.medium,
      alignItems: 'center',
      justifyContent: 'center',
      ...getButtonStyle(variant),
    },
    text: {
      color: getTextColor(variant),
      fontFamily: TYPOGRAPHY.fontFamily.medium,
      fontSize: TYPOGRAPHY.fontSize.button,
    },
  });

  function getButtonStyle(variant: string) {
    switch(variant) {
      case 'primary':
        return {
          backgroundColor: COLORS.primary.main,
          ...SHADOW.light,
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.secondary.main,
          ...SHADOW.light,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: COLORS.primary.main,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {};
    }
  }

  function getTextColor(variant: string) {
    switch(variant) {
      case 'primary':
      case 'secondary':
        return COLORS.neutral.white;
      case 'outlined':
        return COLORS.primary.main;
      case 'text':
        return COLORS.text.primary;
      default:
        return COLORS.text.primary;
    }
  }

  return (
    <TouchableOpacity style={[buttonStyles.button, style]} {...props}>
      <ThemedText 
        style={buttonStyles.text}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};


// Themed Card Component
interface ThemedCardProps extends ViewProps {
  elevation?: 'light' | 'medium' | 'heavy';
}

export const ThemedCard: React.FC<ThemedCardProps> = ({
  elevation = 'light',
  style,
  ...props
}) => {
  return (
    <View
      style={[
        {
          backgroundColor: COLORS.neutral.white,
          borderRadius: BORDERRADIUS.medium,
          padding: SIZES.medium,
          ...SHADOW[elevation],
        },
        style,
      ]}
      {...props}
    />
  );
};

// Themed Divider Component
interface ThemedDividerProps extends ViewProps {
  color?: string;
  thickness?: number;
  margin?: number;
}

export const ThemedDivider: React.FC<ThemedDividerProps> = ({
  color = COLORS.neutral.gray[200],
  thickness = 1,
  margin = SIZES.medium,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        {
          height: thickness,
          backgroundColor: color,
          marginVertical: margin,
        },
        style,
      ]}
      {...props}
    />
  );
};


// Themed Dropdown Component
interface ThemedDropdownProps {
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
    placeholder?: string;
  }
  
  export const ThemedDropdown: React.FC<ThemedDropdownProps> = ({
    options,
    selectedValue,
    onSelect,
    placeholder = 'Select an option',
  }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <View>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsOpen(!isOpen)}
        >
          <ThemedText color={selectedValue ? 'primary' : 'secondary'}>
            {selectedValue || placeholder}
          </ThemedText>
        </TouchableOpacity>
        <Modal visible={isOpen} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setIsOpen(false)}
          >
            <View style={styles.dropdownList}>
              <ScrollView>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => {
                      onSelect(option);
                      setIsOpen(false);
                    }}
                  >
                    <ThemedText color="primary">{option}</ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  };
  
  // Themed Alert Component
  interface ThemedAlertProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
  }
  
  export const ThemedAlert: React.FC<ThemedAlertProps> = ({
    visible,
    onClose,
    title,
    message,
    type = 'info',
  }) => {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.alertContainer, styles[`alert${type}`]]}>
            <ThemedText variant="h4" color="primary" style={styles.alertTitle}>
              {title}
            </ThemedText>
            <ThemedText color="secondary" style={styles.alertMessage}>
              {message}
            </ThemedText>
            <ThemedButton title="OK" onPress={onClose} variant="text" />
          </View>
        </View>
      </Modal>
    );
  };
  
  // Themed Confirmation Modal Component
  interface ThemedConfirmationModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  }
  
  export const ThemedConfirmationModal: React.FC<ThemedConfirmationModalProps> = ({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
  }) => {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationContainer}>
            <ThemedText variant="h4" color="primary" style={styles.confirmationTitle}>
              {title}
            </ThemedText>
            <ThemedText color="secondary" style={styles.confirmationMessage}>
              {message}
            </ThemedText>
            <View style={styles.confirmationButtons}>
              <ThemedButton title={cancelText} onPress={onClose} variant="outlined" />
              <ThemedButton title={confirmText} onPress={onConfirm} variant="primary" />
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  // Themed Checkbox Component
  interface ThemedCheckboxProps {
    checked: boolean;
    onToggle: () => void;
    label: string;
  }
  
  export const ThemedCheckbox: React.FC<ThemedCheckboxProps> = ({
    checked,
    onToggle,
    label,
  }) => {
    return (
      <TouchableOpacity style={styles.checkboxContainer} onPress={onToggle}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <View style={styles.checkboxInner} />}
        </View>
        <ThemedText color="primary" style={styles.checkboxLabel}>
          {label}
        </ThemedText>
      </TouchableOpacity>
    );
  };
  
  // Themed Radio Button Component
  interface ThemedRadioButtonProps {
    selected: boolean;
    onSelect: () => void;
    label: string;
  }
  
  export const ThemedRadioButton: React.FC<ThemedRadioButtonProps> = ({
    selected,
    onSelect,
    label,
  }) => {
    return (
      <TouchableOpacity style={styles.radioButtonContainer} onPress={onSelect}>
        <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
          {selected && <View style={styles.radioButtonInner} />}
        </View>
        <ThemedText color="primary" style={styles.radioButtonLabel}>
          {label}
        </ThemedText>
      </TouchableOpacity>
    );
  };
  
  // Themed Input Field Component
  interface ThemedInputFieldProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  }
  
  export const ThemedInputField: React.FC<ThemedInputFieldProps> = ({
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = 'default',
  }) => {
    return (
      <TextInput
        style={styles.inputField}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.text.secondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    );
  };
  
  // Themed Toggle Switch Component
  interface ThemedToggleSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    label: string;
  }
  
  export const ThemedToggleSwitch: React.FC<ThemedToggleSwitchProps> = ({
    value,
    onValueChange,
    label,
  }) => {
    return (
      <View style={styles.toggleSwitchContainer}>
        <ThemedText color="primary" style={styles.toggleSwitchLabel}>
          {label}
        </ThemedText>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: COLORS.neutral.gray[300], true: COLORS.primary.light }}
          thumbColor={value ? COLORS.primary.main : COLORS.neutral.white}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    dropdownButton: {
      backgroundColor: COLORS.background.paper,
      borderRadius: BORDERRADIUS.medium,
      padding: SIZES.medium,
      ...SHADOW.light,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdownList: {
      backgroundColor: COLORS.background.paper,
      borderRadius: BORDERRADIUS.medium,
      padding: SIZES.small,
      width: '80%',
      maxHeight: '50%',
      ...SHADOW.medium,
    },
    dropdownItem: {
      padding: SIZES.small,
    },
    alertContainer: {
      backgroundColor: COLORS.background.paper,
      borderRadius: BORDERRADIUS.medium,
      padding: SIZES.large,
      width: '80%',
      ...SHADOW.medium,
    },
    alertsuccess: {
      borderLeftWidth: 4,
      borderLeftColor: COLORS.status.success,
    },
    alerterror: {
      borderLeftWidth: 4,
      borderLeftColor: COLORS.status.error,
    },
    alertwarning: {
      borderLeftWidth: 4,
      borderLeftColor: COLORS.status.warning,
    },
    alertinfo: {
      borderLeftWidth: 4,
      borderLeftColor: COLORS.status.info,
    },
    alertTitle: {
      marginBottom: SIZES.small,
    },
    alertMessage: {
      marginBottom: SIZES.medium,
    },
    confirmationContainer: {
      backgroundColor: COLORS.background.paper,
      borderRadius: BORDERRADIUS.medium,
      padding: SIZES.large,
      width: '80%',
      ...SHADOW.medium,
    },
    confirmationTitle: {
      marginBottom: SIZES.small,
    },
    confirmationMessage: {
      marginBottom: SIZES.medium,
    },
    confirmationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SIZES.small,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: COLORS.primary.main,
      borderRadius: BORDERRADIUS.small,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkboxChecked: {
      backgroundColor: COLORS.primary.main,
    },
    checkboxInner: {
      width: 12,
      height: 12,
      backgroundColor: COLORS.neutral.white,
    },
    checkboxLabel: {
      marginLeft: SIZES.small,
    },
    radioButtonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SIZES.small,
    },
    radioButton: {
      width: 24,
      height: 24,
      borderWidth: 2,
      borderColor: COLORS.primary.main,
      borderRadius: BORDERRADIUS.round,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioButtonSelected: {
      backgroundColor: COLORS.primary.main,
    },
    radioButtonInner: {
      width: 12,
      height: 12,
      borderRadius: BORDERRADIUS.round,
      backgroundColor: COLORS.neutral.white,
    },
    radioButtonLabel: {
      marginLeft: SIZES.small,
    },
    inputField: {
      backgroundColor: COLORS.background.paper,
      borderRadius: BORDERRADIUS.medium,
      padding: SIZES.medium,
      fontSize: TYPOGRAPHY.fontSize.body1,
      color: COLORS.text.primary,
      ...SHADOW.light,
    },
    toggleSwitchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    toggleSwitchLabel: {
      marginRight: SIZES.medium,
    },
  });
  
  // Export all components
  export {
    ThemedText as Text,
    ThemedButton as Button,
    ThemedCard as Card,
    ThemedDivider as Divider,
    ThemedDropdown as Dropdown,
    ThemedAlert as Alert,
    ThemedConfirmationModal as ConfirmationModal,
    ThemedCheckbox as Checkbox,
    ThemedRadioButton as RadioButton,
    ThemedInputField as InputField,
    ThemedToggleSwitch as ToggleSwitch,
  };
  
  