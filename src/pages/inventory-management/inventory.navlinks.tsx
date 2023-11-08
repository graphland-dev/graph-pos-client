import { AppNavLink } from '@/_app/models/AppNavLink.type';
import {
	IconBrandProducthunt,
	IconCoin,
	IconReplace,
	IconShoppingCart,
} from '@tabler/icons-react';

export const inventoryNavlinks: AppNavLink[] = [
	{
		label: 'Products',
		icon: <IconBrandProducthunt />,
		href: 'products',
		children: [
			{
				label: 'Products List',
				href: 'products-list',
			},
			{
				label: 'Products Category',
				href: 'products-category',
			},
			{
				label: 'Barcode',
				href: 'barcode',
			},
		],
	},
	{
		label: 'POS',
		icon: <IconReplace />,
		href: 'pos/create-sale',
	},
	{
		label: 'Purchases',
		icon: <IconShoppingCart />,
		href: 'purchases',
		children: [
			{
				label: 'Purchases List',
				href: '',
			},
			// {
			//   label: "Purchases List",
			//   href: "purchases-list",
			// },
			{
				label: 'Return',
				href: 'return',
			},
		],
	},
	{
		label: 'Payments',
		icon: <IconCoin />,
		href: 'payments',
		children: [
			{
				label: 'Supplier Pay',
				href: 'supplier-payments',
			},
		],
	},
];
