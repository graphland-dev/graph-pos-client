import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { Provider as JotaiProvider } from 'jotai';

import RootWrapper from '@/commons/components/wrappers/RootWrapper.tsx';
import { jotaiStore } from '@/commons/configs/jotai.config.ts';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { rootRouter } from './root.router';

const RootApp = () => {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'graphland.dev.pos.color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const [colorTheme] = useLocalStorage({
    key: 'graphland.dev.pos.color-theme',
    defaultValue: 'green',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  useEffect(() => {
    document.querySelector('html')?.setAttribute('data-theme', colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    if (colorScheme === 'dark') {
      document.querySelector('html')?.setAttribute('data-color-scheme', 'dark');
    } else {
      document
        .querySelector('html')
        ?.setAttribute('data-color-scheme', 'light');
    }
  }, [colorScheme]);

  return (
    <JotaiProvider store={jotaiStore}>
      <RootWrapper>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withNormalizeCSS
            withGlobalStyles
            theme={{
              colorScheme,
              components: {
                Paper: {
                  defaultProps: {
                    withBorder: true,
                    className: 'app-card',
                    p: 'md',
                  },
                },
                Card: {
                  defaultProps: {
                    withBorder: true,
                    className: 'app-card',
                    p: 'md',
                  },
                },
                Drawer: {
                  defaultProps: {
                    classNames: {
                      content: 'app-drawer-content',
                    },
                  },
                },
              },
              colors: {
                primary: [
                  'hsl(var(--primary-50))', // 0
                  'hsl(var(--primary-100))', // 1
                  'hsl(var(--primary-200))', // 2
                  'hsl(var(--primary-300))', // 3
                  'hsl(var(--primary-400))', // 4
                  'hsl(var(--primary-500))', // 5
                  'hsl(var(--primary-600))', // 6
                  'hsl(var(--primary-700))', // 7
                  'hsl(var(--primary-800))', // 8
                  'hsl(var(--primary-900))', // 9
                ],
                secondary: [
                  'hsl(var(--secondary-50))', // 0
                  'hsl(var(--secondary-100))', // 1
                  'hsl(var(--secondary-200))', // 2
                  'hsl(var(--secondary-300))', // 3
                  'hsl(var(--secondary-400))', // 4
                  'hsl(var(--secondary-500))', // 5
                  'hsl(var(--secondary-600))', // 6
                  'hsl(var(--secondary-700))', // 7
                  'hsl(var(--secondary-800))', // 8
                  'hsl(var(--secondary-900))', // 9
                ],
              },
              primaryColor: 'primary',
              primaryShade: 5,
            }}
          >
            <ModalsProvider>
              <Notifications position="top-right" />
              <RouterProvider router={rootRouter} />
            </ModalsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </RootWrapper>
    </JotaiProvider>
  );
};

export default RootApp;
