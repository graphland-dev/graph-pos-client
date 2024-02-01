import {
	Button,
	Checkbox,
	Flex,
	Group,
	Paper,
	Space,
	Title,
} from '@mantine/core';

const RolesPage = () => {
	return (
		<div className='lg:w-8/12'>
			<Paper p={20} radius={10}>
				<Flex justify={'space-between'} align={'center'}>
					<Title order={2}>Admin</Title>

					<Group position='right'>
						<Button variant='subtle' color='teal'>
							Clone
						</Button>
						<Button variant='light' color='red'>
							Delete
						</Button>
					</Group>
				</Flex>

				<Space h={'xl'} />

				<form>
					<div>
						<Title order={3}>Accounting Module</Title>
						<Space h={'xs'} />

						<div>
							<Title order={5}>Account</Title>
							<Space h={'sm'} />

							<Flex gap={20}>
								<Checkbox radius={0} color='teal' label='*' value='*' />
								<Checkbox
									radius={0}
									color='teal'
									label='create'
									value='create'
								/>
								<Checkbox radius={0} color='teal' label='read' value='read' />
								<Checkbox
									radius={0}
									color='teal'
									label='update'
									value='update'
								/>
								<Checkbox
									radius={0}
									color='teal'
									label='delete'
									value='delete'
								/>
							</Flex>
						</div>

						<Space h={20} />

						<div>
							<Title order={5}>Expense</Title>
							<Space h={'sm'} />

							<Flex gap={20}>
								<Checkbox radius={0} color='teal' label='*' value='*' />
								<Checkbox
									radius={0}
									color='teal'
									label='create'
									value='create'
								/>
								<Checkbox radius={0} color='teal' label='read' value='read' />
								<Checkbox
									radius={0}
									color='teal'
									label='update'
									value='update'
								/>
								<Checkbox
									radius={0}
									color='teal'
									label='delete'
									value='delete'
								/>
							</Flex>
						</div>
					</div>

					<Space h={40} />

					<div>
						<Title order={3}>Organization Module</Title>
						<Space h={'xs'} />

						<div>
							<Title order={5}>User</Title>
							<Space h={'sm'} />

							<Flex gap={20}>
								<Checkbox radius={0} color='teal' label='*' value='*' />
								<Checkbox
									radius={0}
									color='teal'
									label='create'
									value='create'
								/>
								<Checkbox radius={0} color='teal' label='read' value='read' />
								<Checkbox
									radius={0}
									color='teal'
									label='update'
									value='update'
								/>
								<Checkbox
									radius={0}
									color='teal'
									label='delete'
									value='delete'
								/>
							</Flex>
						</div>

						<Space h={20} />

						<div>
							<Title order={5}>Role/Permission</Title>
							<Space h={'sm'} />

							<Flex gap={20}>
								<Checkbox radius={0} color='teal' label='*' value='*' />
								<Checkbox
									radius={0}
									color='teal'
									label='create'
									value='create'
								/>
								<Checkbox radius={0} color='teal' label='read' value='read' />
								<Checkbox
									radius={0}
									color='teal'
									label='update'
									value='update'
								/>
								<Checkbox
									radius={0}
									color='teal'
									label='delete'
									value='delete'
								/>
							</Flex>
						</div>
					</div>

					<Space h={40} />

					<div>
						<Title order={3}>People Module</Title>
						<Space h={'xs'} />

						<div>
							<Title order={5}>Employee</Title>
							<Space h={'sm'} />

							<Flex gap={20}>
								<Checkbox radius={0} color='teal' label='*' value='*' />
								<Checkbox
									radius={0}
									color='teal'
									label='create'
									value='create'
								/>
								<Checkbox radius={0} color='teal' label='read' value='read' />
								<Checkbox
									radius={0}
									color='teal'
									label='update'
									value='update'
								/>
								<Checkbox
									radius={0}
									color='teal'
									label='delete'
									value='delete'
								/>
							</Flex>
						</div>
					</div>
				</form>
			</Paper>
		</div>
	);
};

export default RolesPage;
