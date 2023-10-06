import { Button, Input, SegmentedControl, Space } from '@mantine/core';
import { useState } from 'react';

const PriceForm = () => {
	const [segment, setSegment] = useState<'amount' | 'percentage'>('amount');

	return (
		<div>
			<form className='lg:w-8/12'>
				<Input.Wrapper label='Price'>
					<Input placeholder='Write product price' type='number' />
				</Input.Wrapper>

				<Space h={'md'} />

				<SegmentedControl
					value={segment}
					onChange={(e) => setSegment(e as 'amount' | 'percentage')}
					data={[
						{ label: 'Amount', value: 'amount' },
						{ label: 'Percentage', value: 'percentage' },
					]}
				/>
				{segment === 'amount' ? (
					<>
						<Input.Wrapper label='Discount amount'>
							<Input placeholder='Write discount amount' type='number' />
						</Input.Wrapper>
						<Space h={'sm'} />
					</>
				) : (
					<>
						<Input.Wrapper label='Discount percentage'>
							<Input placeholder='Write discount percentage' />
						</Input.Wrapper>
						<Space h={'sm'} />
					</>
				)}

				<Button type='submit'>Save</Button>
			</form>
		</div>
	);
};

export default PriceForm;
