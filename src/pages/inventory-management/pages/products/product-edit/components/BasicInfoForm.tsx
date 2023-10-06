import { Button, Input, Space, Textarea } from '@mantine/core';

const BasicInfoForm = () => {
	return (
		<div>
			<form className='lg:w-8/12'>
				<Input.Wrapper label='Name'>
					<Input placeholder='Write product name' />
				</Input.Wrapper>
				<Space h={'sm'} />
				<Input.Wrapper label='Code'>
					<Input placeholder='Write product code' />
				</Input.Wrapper>
				<Space h={'sm'} />
				<Input.Wrapper label='Model'>
					<Input placeholder='Write product model' />
				</Input.Wrapper>
				<Space h={'sm'} />
				<Input.Wrapper label='Note'>
					<Textarea placeholder='Write product note' />
				</Input.Wrapper>
				<Space h={'sm'} />

				<Button type='submit'>Save</Button>
			</form>
		</div>
	);
};

export default BasicInfoForm;
