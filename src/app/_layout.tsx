import { useEffect, useState } from "react";
import { Slot, SplashScreen } from "expo-router";

import { useFonts } from "@expo-google-fonts/space-grotesk";
import { customFontsToLoad } from "@/theme";
import { initI18n } from "@/i18n";
import { loadDateFnsLocale } from "@/utils/formatDate";
import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme";

import { ThemeProvider as StyledThemeProvider } from "styled-components";

import theme from "@/styled/styeldTheme";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

if (__DEV__) {
  // Load Reactotron configuration in development. We don't want to
  // include this in our production bundle, so we are using `if (__DEV__)`
  // to only execute this in development.
  require("src/devtools/ReactotronConfig.ts");
}

export { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";

export default function Root() {
  const [fontsLoaded, fontError] = useFonts(customFontsToLoad);
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const { themeScheme, setThemeContextOverride, ThemeProvider } =
    useThemeProvider();

  useEffect(() => {
    initI18n()
      .then(() => setIsI18nInitialized(true))
      .then(() => loadDateFnsLocale());
  }, []);

  const loaded = fontsLoaded && isI18nInitialized;

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const darkTheme = {
    color: "white",
    bgColor: "rgb(50,50,50)",
    containerColor: "rgb(30,30,30)",
    textAlign: "flex-end",
  };

  const lightTheme = {
    color: "black",
    containerColor: "rgb(220,220,220)",
    textAlign: "flex-start",
    bgColor: "white",
  };

  // const {
  //   theme: { isDark },
  //   themed,
  // } = useAppTheme();
  // let colorScheme = useColorScheme();

  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      <StyledThemeProvider theme={true ? darkTheme : lightTheme}>
        <Slot />
      </StyledThemeProvider>
    </ThemeProvider>
  );
}
