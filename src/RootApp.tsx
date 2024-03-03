import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { SpotlightProvider } from "@mantine/spotlight";

import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { spotlightItems } from "./_app/configs/spotlight-items";
import { rootRouter } from "./root.router";

const RootApp = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "graph-erp-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

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
            globalStyles: (theme) => ({
              body: {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.gray[9]
                    : "#F1F5FA",
              },
            }),
          }}
        >
          <SpotlightProvider
            shortcut={["mod + P", "mod + K"]}
            actions={spotlightItems}
          >
            <ModalsProvider>
              <Notifications position="top-right" />
              <RouterProvider router={rootRouter} />
            </ModalsProvider>
          </SpotlightProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};

export default RootApp;
