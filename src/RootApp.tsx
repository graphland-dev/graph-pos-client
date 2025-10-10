import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";

import { MantineProvider } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Provider as JotaiProvider } from "jotai";

import RootWrapper from "@/commons/components/wrappers/RootWrapper.tsx";
import { jotaiStore } from "@/commons/configs/jotai.config.ts";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { rootRouter } from "./root.router";

const RootApp = () => {
  const [colorTheme] = useLocalStorage({
    key: "app.pos.graphland.dev.color-theme",
    defaultValue: "green",
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", colorTheme);
  }, [colorTheme]);

  return (
    <JotaiProvider store={jotaiStore}>
      <MantineProvider
        theme={{
          components: {
            Paper: {
              defaultProps: {
                withBorder: true,
                className: "app-card",
              },
            },
            Card: {
              defaultProps: {
                withBorder: true,
                className: "app-card",
              },
            },
            Drawer: {
              defaultProps: {
                classNames: {
                  content: "app-drawer",
                  body: "pt-2!",
                },
              },
            },
          },
          colors: {
            primary: [
              "var(--primary-50)", // 0
              "var(--primary-100)", // 1
              "var(--primary-200)", // 2
              "var(--primary-300)", // 3
              "var(--primary-400)", // 4
              "var(--primary-500)", // 5
              "var(--primary-600)", // 6
              "var(--primary-700)", // 7
              "var(--primary-800)", // 8
              "var(--primary-900)", // 9
            ],
          },
          primaryColor: "primary",
        }}
      >
        <RootWrapper>
          <ModalsProvider>
            <Notifications position="top-right" />
            <RouterProvider router={rootRouter} />
          </ModalsProvider>
        </RootWrapper>
      </MantineProvider>
    </JotaiProvider>
  );
};

export default RootApp;
