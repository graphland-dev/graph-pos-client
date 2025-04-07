import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { PropsWithChildren } from 'react';

interface Prop {
  TopSection: React.ReactNode;
  NavSection: React.ReactNode;
}

const ViewDashboardLayout: React.FC<PropsWithChildren<Prop>> = () => {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>Logo</div>
      </AppShell.Header>

      <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

      <AppShell.Main>Main</AppShell.Main>
    </AppShell>
  );

  // return (
  //   <AppShell
  //     m={0}
  //     navbarOffsetBreakpoint="sm"
  //     asideOffsetBreakpoint="sm"
  //     navbar={
  //       <Navbar p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
  //         {TopSection && <Navbar.Section p={"sm"}>{TopSection}</Navbar.Section>}
  //         {NavSection && (
  //           <Navbar.Section grow mt="md" component={ScrollArea}>
  //             {NavSection}
  //           </Navbar.Section>
  //         )}
  //       </Navbar>
  //     }
  //   >
  //     {children}
  //   </AppShell>
  // );
};

export default ViewDashboardLayout;
