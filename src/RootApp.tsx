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
                accent: [
                  'hsl(var(--accent-50))', // 0
                  'hsl(var(--accent-100))', // 1
                  'hsl(var(--accent-200))', // 2
                  'hsl(var(--accent-300))', // 3
                  'hsl(var(--accent-400))', // 4
                  'hsl(var(--accent-500))', // 5
                  'hsl(var(--accent-600))', // 6
                  'hsl(var(--accent-700))', // 7
                  'hsl(var(--accent-800))', // 8
                  'hsl(var(--accent-900))', // 9
                ],
                muted: [
                  'hsl(var(--muted-50))', // 0
                  'hsl(var(--muted-100))', // 1
                  'hsl(var(--muted-200))', // 2
                  'hsl(var(--muted-300))', // 3
                  'hsl(var(--muted-400))', // 4
                  'hsl(var(--muted-500))', // 5
                  'hsl(var(--muted-600))', // 6
                  'hsl(var(--muted-700))', // 7
                  'hsl(var(--muted-800))', // 8
                  'hsl(var(--muted-900))', // 9
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
