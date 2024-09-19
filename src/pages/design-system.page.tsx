import {
  Button,
  Divider,
  Drawer,
  Paper,
  Space,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import CommonHeader from '@/commons/components/layouts/componants/CommonHeader.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/commons/shadcn/components/ui/card.tsx';
import { useDisclosure } from '@mantine/hooks';
import { Link } from 'react-router-dom';
import { IconDashboard } from '@tabler/icons-react';

const DesignSystem = () => {
  const { toggleColorScheme } = useMantineColorScheme();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <CommonHeader />

      <div className="p-20">
        <Button my={'lg'} onClick={() => toggleColorScheme()}>
          Toggle Theme
        </Button>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-lg">Muted Typography</CardTitle>
          </CardHeader>
          <CardContent className="">
            <Text fw={'bold'}>Heading 1</Text>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </CardContent>
        </Card>

        <Paper title={'Design System'}>
          <Title fw={'normal'} order={4}>
            Default Card
          </Title>
          <Divider mb={10} />
          <Text>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit, rem
            similique, eveniet labore veritatis sunt porro nulla placeat nemo
            blanditiis nobis omnis voluptates nesciunt eaque eos dicta corporis
            facilis repellendus!
          </Text>
        </Paper>

        <Space h={20} />

        <Card>
          <CardHeader>
            <CardTitle>Shadcn Card</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque
              delectus dignissimos doloribus impedit nobis officiis. Adipisci
              corporis earum eius facere fugit nemo quidem tempora. Assumenda
              delectus molestias praesentium sunt voluptates.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>

        <Space h={20} />

        <Paper>
          <div className="flex flex-wrap gap-3 p-10">
            <Button color="primary.0">Button Primary 0</Button>
            <Button color="primary.1">Button Primary 1</Button>
            <Button color="primary.2">Button Primary 2</Button>
            <Button color="primary.3">Button Primary 3</Button>
            <Button color="primary.4">Button Primary 4</Button>
            <Button color="primary.5">Button Primary 5</Button>
            <Button color="primary.6">Button Primary 6</Button>
            <Button color="primary.7">Button Primary 7</Button>
            <Button color="primary.8">Button Primary 8</Button>
            <Button color="primary.9">Button Primary 9</Button>
            <Button color="primary">Button Primary Default</Button>
            <Button color="primary" component={Link} to={'/'}>
              Button Primary Default
            </Button>
            <Button
              variant="subtle"
              component={Link}
              to={'/'}
              leftIcon={<IconDashboard size={16} />}
            >
              Dashboard
            </Button>
          </div>
          <div className="flex gap-3 p-10">
            <Button color="primary">Button Primary</Button>
            <Button color="secondary">Button Secondary</Button>
            <Button color="secondary" variant={'white'}>
              Button White
            </Button>
          </div>
        </Paper>
      </div>

      <Space h={20} />

      <Paper>
        <Drawer
          classNames={{
            content: 'app-drawer-content',
          }}
          opened={opened}
          onClose={close}
          title="Authentication"
        >
          {/* Drawer content */}
        </Drawer>

        <Button onClick={open}>Open Drawer</Button>
      </Paper>
    </>
  );
};

export default DesignSystem;
