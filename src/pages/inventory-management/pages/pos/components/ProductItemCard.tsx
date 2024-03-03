import { Badge, Box, Paper, Text } from '@mantine/core';

const ProductItemCard: React.FC<{ handleAddItem: () => void }> = ({
	handleAddItem,
}) => {
	return (
		<Paper
			radius={10}
			withBorder
			className='cursor-pointer hover:bg-slate-200 hover:duration-300'
			onClick={handleAddItem}
		>
			<div className='bg-slate-200 relative'>
				<Badge
					className='!text-white absolute top-0 left-0 rounded-br-md'
					size='md'
					radius={0}
					bg={'violet'}
				>
					12
				</Badge>
				<img
					src='https://posdemo3.uddoktait.com/images/products/1696061556.png'
					alt='item image'
					width={100}
					height={100}
					className='object-fill'
				/>
			</div>

			<Box p={5}>
				<Text fz={12} fw={500}>
					PC-1293
				</Text>
				<Text fz={16} fw={500}>
					Sports Cads
				</Text>
			</Box>
		</Paper>
	);
};

export default ProductItemCard;
