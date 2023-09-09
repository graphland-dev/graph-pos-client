import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { SpotlightProvider } from "@mantine/spotlight";

import { RouterProvider } from "react-router-dom";
import { spotlightItems } from "./_app/configs/spotlight-items";
import { rootRouter } from "./root.router";

const RootApp = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
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
                  : theme.colors.gray[0],
            },
          }),
        }}
      >
        <SpotlightProvider
          shortcut={["mod + P", "mod + K"]}
          actions={spotlightItems}
        >
          <RouterProvider router={rootRouter} />
        </SpotlightProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default RootApp;
