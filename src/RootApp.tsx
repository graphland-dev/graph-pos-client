import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { rootRouter } from "./root.router";

const RootApp = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "graph-erp-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  const [colorTheme] = useLocalStorage({
    key: "graph-360--theme",
    defaultValue: "green",
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    if (colorScheme === "dark") {
      document.querySelector("html")?.setAttribute("data-color-scheme", "dark");
    } else {
      document
        .querySelector("html")
        ?.setAttribute("data-color-scheme", "light");
    }
  }, [colorScheme]);

  return (
    <>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withNormalizeCSS
          withGlobalStyles
          theme={{
            colorScheme,
            colors: {
              theme: [
                "color-mix(in srgb, var(--theme-primary), #fff 70%)", // 0
                "color-mix(in srgb, var(--theme-primary), #fff 60%)", // 1
                "color-mix(in srgb, var(--theme-primary), #fff 50%)", // 2
                "color-mix(in srgb, var(--theme-primary), #fff 40%)", // 3
                "color-mix(in srgb, var(--theme-primary), #fff 30%)", // 4
                "color-mix(in srgb, var(--theme-primary), #fff 20%)", // 5
                "color-mix(in srgb, var(--theme-primary), #fff 10%)", // 6
                "var(--theme-primary)", // 7 Base color
                "color-mix(in srgb, var(--theme-primary), #000 15%)", // 8
                "color-mix(in srgb, var(--theme-primary), #000 35%)", // 9
              ],
            },
            primaryColor: "theme",
          }}
        >
          <ModalsProvider>
            <Notifications position="top-right" />
            <RouterProvider router={rootRouter} />
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};

export default RootApp;
