import { createContext, ReactNode, useState } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import { LIGHT_COLORS,DARK_COLORS } from "@/constants";
// Theme context
interface ThemeContextType {
    theme: ColorSchemeName;
    toggleTheme: () => void;
    colors: typeof LIGHT_COLORS;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => {},
    colors: LIGHT_COLORS,
});

// Theme Provider Component
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const colorScheme = useColorScheme();
    const [theme, setTheme] = useState<ColorSchemeName>(colorScheme);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const colors = theme === 'light' ? LIGHT_COLORS : DARK_COLORS;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};