//theme.tsx
export const theme = {
    colors: {
      primary: '#6200EE',
      secondary: '#03DAC6',
      background: '#F5F5F5',
      surface: '#FFFFFF',
      text: '#121212',
      error: '#B00020',
      onSurface: '#121212',
      onBackground: '#121212',
      onPrimary: '#FFFFFF',
      onSecondary: '#000000',
      disabled: '#9E9E9E',
      placeholder: '#757575',
      backdrop: 'rgba(0, 0, 0, 0.5)',
      notification: '#FF80AB',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    roundness: 8,
    typography: {
      title: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      subtitle: {
        fontSize: 18,
        fontWeight: '600',
      },
      body: {
        fontSize: 16,
      },
      button: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
  };
  
  export type AppTheme = typeof theme;
  
  