import { Text, Title } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';

interface IModuleMenu {
  moduleName: string;
  items: {
    name: string;
    iconPath: string;
    linkPath: string;
  }[];
}

const ModuleMenu: React.FC<IModuleMenu> = ({ moduleName, items }) => {
  return (
    <div>
      <Title order={3}>{moduleName}</Title>

      <div className="flex flex-wrap gap-10 mt-4 text-center">
        {items.map((item) => (
          <Link
            to={item.linkPath}
            className="flex flex-col gap-1 transition duration-200 hover:-translate-y-1 w-[80px] text-center items-center"
          >
            <img
              src={item.iconPath}
              className="bg-theme-surface h-[70px] w-[70px] p-3 rounded-md bg-secondary shadow flex-none"
            />
            <Text>{item.name}</Text>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ModuleMenu;
