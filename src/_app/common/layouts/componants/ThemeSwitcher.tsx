import {
  Drawer,
  Flex,
  Menu,
  Tooltip,
  UnstyledButton,
  clsx,
  useMantineColorScheme,
} from "@mantine/core";
import { useColorScheme, useDisclosure, useLocalStorage } from "@mantine/hooks";
import {
  IconDeviceLaptop,
  IconMoon,
  IconPaint,
  IconSunHigh,
} from "@tabler/icons-react";

const ThemeSwitcherMenu = () => {
  const preferredColorScheme = useColorScheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [themeSettingDrawerOpened, themeSettingDrawerHandler] =
    useDisclosure(false);

  const [colorTheme, setColorTheme] = useLocalStorage({
    key: "graph-360--theme",
    defaultValue: "green",
    getInitialValueInEffect: true,
  });

  return (
    <>
      <Drawer
        opened={themeSettingDrawerOpened}
        onClose={themeSettingDrawerHandler.close}
        title="Choose Theme"
      >
        <div className="flex flex-col gap-4">
          {themes.map((theme) => (
            <ThemeSwatch
              onClick={(theme) => setColorTheme(theme)}
              active={colorTheme === theme.name}
              {...theme}
            />
          ))}
        </div>
      </Drawer>
      <Flex gap={"md"}>
        <Menu shadow="md" width={200}>
          {/* <Menu.Target>
        {colorScheme === "dark" ? (
          <IconMoon size={22} className="cursor-pointer" />
          ) : (
            <IconSunHigh size={22} className="cursor-pointer" />
            )}
          </Menu.Target> */}

          <Menu.Target>
            {colorScheme === "dark" ? (
              <IconMoon
                size={22}
                className="cursor-pointer theme-switcher-icon"
              />
            ) : (
              <IconSunHigh
                size={22}
                className="cursor-pointer theme-switcher-icon"
              />
            )}
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              onClick={() => toggleColorScheme("light")}
              icon={<IconSunHigh size={14} />}
            >
              Light
            </Menu.Item>
            <Menu.Item
              onClick={() => toggleColorScheme("dark")}
              icon={<IconMoon size={14} />}
            >
              Dark
            </Menu.Item>
            <Menu.Item
              onClick={() => toggleColorScheme(preferredColorScheme)}
              icon={<IconDeviceLaptop size={14} />}
            >
              System
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <UnstyledButton onClick={themeSettingDrawerHandler.toggle}>
          <Tooltip label="Theme Setting">
            <IconPaint
              size={22}
              className="cursor-pointer theme-switcher-icon"
            />
          </Tooltip>
        </UnstyledButton>
      </Flex>
    </>
  );
};

export default ThemeSwitcherMenu;

// primary
// primary-variant
// body
// light
// surface
const themes = [
  {
    name: "aubergine",
    colors: [
      "#704264",
      "color-mix(in srgb, #704264, #000 10%)",
      "#ecf8f6",
      "#f1fada",
      "#fff",
    ],
  },
  {
    name: "green",
    colors: [
      "#008170",
      "color-mix(in srgb, #008170, #000 10%)",
      "#ecf8f6",
      "#f1fada",
      "#fff",
    ],
  },
];

const ThemeSwatch = (props: {
  name: string;
  colors: string[];
  active?: boolean;
  onClick: (theme: string) => void;
}) => {
  return (
    <div
      onClick={() => props.onClick(props.name)}
      className={clsx("p-2 cursor-pointer bg-neutral-100", {
        "bg-neutral-200": props.active,
      })}
    >
      <p>{props.name}</p>
      <div
        className={clsx(
          "flex justify-between h-16 overflow-hidden border border-solid rounded-md border-neutral-primary"
        )}
      >
        {props.colors.map((color) => (
          <div
            className="flex-1 h-full"
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
    </div>
  );
};
