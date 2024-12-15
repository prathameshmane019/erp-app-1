import { Switch } from "react-native";
import { Text, View } from "./Themed";
import { ThemedText } from "./ThemedComponents";
import { useTheme } from "@react-navigation/native";

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
  
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text>Dark Mode</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme}
        />
      </View>
    );
  };
  