import {
  ColorScheme,
  ColorSchemeProvider,
  LoadingOverlay,
  MantineProvider,
} from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { SpotlightProvider } from "@mantine/spotlight";

import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { RouterProvider } from "react-router-dom";
import { spotlightItems } from "./_app/configs/spotlight-items";
import { rootRouter } from "./root.router";
import { gql, useQuery } from "@apollo/client";
import { User } from "./_app/graphql-models/graphql";
import { useAtom } from "jotai";
import { userAtom } from "./_app/states/user.atom";
import { useEffect } from "react";

const ME_QUERY = gql`
  query Identity__me {
    identity__me {
      _id
      email
      name
      memberships {
        tenant
        roles
      }
    }
  }
`;

const RootApp = () => {
  const [, setGlobalUser] = useAtom(userAtom);
  const { loading } = useQuery<{ identity__me: User }>(ME_QUERY, {
    onCompleted(data) {
      setGlobalUser(data?.identity__me);
    },
  });

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
                    : theme.colors.gray[0],
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
              <LoadingOverlay visible={loading} opacity={1} overlayBlur={100} />
              <RouterProvider router={rootRouter} />
            </ModalsProvider>
          </SpotlightProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
};

export default RootApp;
