import { Space, Tabs } from '@mantine/core';
import AssignmentForm from './components/AssignmentForm';
import BasicInfoForm from './components/BasicInfoForm';
import PriceForm from './components/PriceForm';

export default function ProductEditPage() {
	return (
		<Tabs defaultValue='BasicInfo'>
			<Tabs.List>
				<Tabs.Tab value='BasicInfo'>Basic information</Tabs.Tab>
				<Tabs.Tab value='Assignment'>Assignment</Tabs.Tab>
				<Tabs.Tab value='Price'>Price</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value='BasicInfo'>
				<Space h={20} />
				<BasicInfoForm />
			</Tabs.Panel>

			<Tabs.Panel value='Assignment'>
				<Space h={20} />
				<AssignmentForm />
			</Tabs.Panel>

			<Tabs.Panel value='Price'>
				<Space h={20} />
				<PriceForm />
			</Tabs.Panel>
		</Tabs>
	);
}
