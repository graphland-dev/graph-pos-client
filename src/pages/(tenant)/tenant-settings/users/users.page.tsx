import { UsersWithPagination } from '@/_app/graphql-models/graphql';
import { useQuery } from '@apollo/client';
import {
	Avatar,
	Image,
	Paper,
	Skeleton,
	Space,
	Text,
	Title,
} from '@mantine/core';
import { Organization__Employees__Query } from './utils/query.gql';

const UsersPage = () => {
	const { loading } = useQuery<{
		identity__users: UsersWithPagination;
	}>(Organization__Employees__Query);

	return (
		<div>
			<Title order={2} fw={700}>
				Organization Employees
			</Title>

			<Space h={'lg'} />

			{!loading &&
				[0, 0, 3]?.map((_, idx: number) => (
					<Paper
						key={idx}
						className='flex items-center gap-4 rounded-md'
						p={10}
						my={10}
					>
						<Avatar radius={7}>
							<Image
								src={`https://api.dicebear.com/7.x/initials/svg?seed=Rafiz`}
							/>
						</Avatar>
						<div>
							<Text fw={500}>Mehedi H. Rafiz</Text>
							<Text size={'xs'}>rafiz.mehedi@gmail.com</Text>
						</div>
					</Paper>
				))}

			{loading && (
				<>
					{new Array(12).fill(12).map(() => (
						<Skeleton h={80} radius={5} my={10} />
					))}
				</>
			)}
		</div>
	);
};

export default UsersPage;
