import DashboardLayout from '@/_app/common/layouts/DashboardLayout';
import { RouteObject } from 'react-router-dom';
import { accountingNavlinks } from './accounting.navlinks';
import AssetsPage from './pages/asset-management/assets/assets.page';
import TypesPage from './pages/asset-management/types/types.page';
import AccountsPage from './pages/cashbook/accounts/accounts.page';
import AdjustmentPage from './pages/cashbook/adjustment/adjustment.page';
import InvoiceGenerator from './pages/cashbook/invoice-generator';
import StatementPage from './pages/cashbook/statements/statements.page';
import TransferPage from './pages/cashbook/transfers/transfer.page';
import ExpenseCategoryPage from './pages/expense/expenseCategory/expenseCategory.page';
import ExpenseListPage from './pages/expense/expenseList/expenseList.page';
import Authorities from './pages/load-manegment/authorities/authorities.page';
import Loans from './pages/load-manegment/loans/loans.page';
import Payments from './pages/load-manegment/payments/payments.page';
export const accountingModuleRouter: RouteObject[] = [
	{
		path: '',
		element: (
			<DashboardLayout
				navlinks={accountingNavlinks}
				title='Accounting'
				path='accounting'
			/>
		),
		children: [
			{
				path: 'cashbook',
				children: [
					{
						path: 'accounts',
						element: <AccountsPage />,
					},
					{
						path: 'adjustments',
						element: <AdjustmentPage />,
					},
					{
						path: 'invoice-generator',
						element: <InvoiceGenerator />,
					},
					{
						path: 'transfers',
						element: <TransferPage />,
					},
					{
						path: 'statements',
						element: <StatementPage />,
					},
					{
						path: 'payroll',
						element: <TypesPage />,
					},
				],
			},
			{
				path: 'expense',
				children: [
					{
						path: 'expense-list',
						element: <ExpenseListPage />,
					},
					{
						path: 'expense-category',
						element: <ExpenseCategoryPage />,
					},
				],
			},
			{
				path: 'load-management',
				children: [
					{
						path: 'authorities',
						element: <Authorities />,
					},
					{
						path: 'loans',
						element: <Loans />,
					},
					{
						path: 'payments',
						element: <Payments />,
					},
				],
			},
			{
				path: 'asset-management',
				children: [
					{
						path: 'types',
						element: <TypesPage />,
					},
					{
						path: 'assets',
						element: <AssetsPage />,
					},
				],
			},
		],
	},
];
