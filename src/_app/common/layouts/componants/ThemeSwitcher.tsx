import { Menu, useMantineColorScheme } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { IconDeviceLaptop, IconMoon, IconSunHigh } from "@tabler/icons-react";

const ThemeSwitcherMenu = () => {
  const preferredColorScheme = useColorScheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        {colorScheme === "dark" ? (
          <IconMoon size={22} className="cursor-pointer" />
        ) : (
          <IconSunHigh size={22} className="cursor-pointer" />
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
  );
};

export default ThemeSwitcherMenu;
