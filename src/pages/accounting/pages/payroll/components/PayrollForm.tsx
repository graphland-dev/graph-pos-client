import { Notify } from '@/_app/common/Notification/Notify';
import { Account, Employee, Month_Name } from '@/_app/graphql-models/graphql';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Select, Space } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { CREATE_PAYROLL_MUTATION } from '../utils/payroll.query';

interface IIncrementFormProps {
	employees: Employee[];
	accounts: Account[];
	onFormSubmitted: () => void;
}
const PayrollForm: React.FC<IIncrementFormProps> = ({
	employees,
	onFormSubmitted,
	accounts,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm({
		defaultValues: {
			accountId: '',
			employeeId: '',
			opportunities: [],
			salaryDate: new Date(),
			salaryMonth: Month_Name.January,
		},
		resolver: yupResolver(formValidationSchema),
	});

	const [createPayroll, { loading: creating }] = useMutation(
		CREATE_PAYROLL_MUTATION,
		Notify({
			sucTitle: 'Create payroll done!',
			onSuccess() {
				onFormSubmitted();
			},
		})
	);

	const onSubmit = (values: IPAYROLLFORM) => {
		createPayroll({
			variables: {
				body: {
					accountId: values.accountId,
					employeeId: values.employeeId,
					opportunities: values.opportunities,
					salaryDate: values.salaryDate,
					salaryMonth: values.salaryMonth,
				},
			},
		});
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input.Wrapper
					withAsterisk
					label='Select account'
					error={<ErrorMessage errors={errors} name='accountId' />}
				>
					<Select
						searchable
						withAsterisk
						placeholder='Pick account'
						disabled={!employees?.length}
						onChange={(e) => setValue('accountId', e!)}
						data={getSelectInputData(accounts as Account[])}
					/>
				</Input.Wrapper>

				<Space h={'sm'} />
				<Input.Wrapper
					withAsterisk
					label='Select employee'
					error={<ErrorMessage errors={errors} name='employeeId' />}
				>
					<Select
						searchable
						withAsterisk
						placeholder='Pick employee'
						disabled={!employees?.length}
						onChange={(e) => setValue('employeeId', e!)}
						data={getSelectInputData(employees as Employee[])}
					/>
				</Input.Wrapper>

				<Space h={'sm'} />

				<Input.Wrapper
					label='Date'
					withAsterisk
					error={<ErrorMessage errors={errors} name='date' />}
				>
					<DateInput
						placeholder='Pick a date'
						defaultValue={watch('salaryDate')}
						onChange={(d) => setValue('salaryDate', d!)}
					/>
				</Input.Wrapper>

				<Space h={'sm'} />

				<Input.Wrapper
					label='Salary month'
					withAsterisk
					error={<ErrorMessage errors={errors} name='salaryMonth' />}
				>
					<Select
						placeholder='Pick a month'
						data={MonthData}
						onChange={(m) => setValue('salaryMonth', m!)}
					/>
				</Input.Wrapper>

				<Space h={'sm'} />

				<div>
					<Input.Wrapper
						label='Opportunity name'
						withAsterisk
						error={<ErrorMessage errors={errors} name='salaryMonth' />}
					>
						<Input
							placeholder='Write opportunity name'
							{...register(`opportunities`)}
						/>
					</Input.Wrapper>

					<Space h={'sm'} />
					<Input.Wrapper
						label='Opportunity amount'
						withAsterisk
						error={<ErrorMessage errors={errors} name='salaryMonth' />}
					>
						<Input
							placeholder='Write opportunity amount'
							{...register(`opportunities`)}
						/>
					</Input.Wrapper>

					<Space h={'sm'} />
				</div>
				<Button type='submit' loading={creating} fullWidth>
					Save
				</Button>
			</form>
		</div>
	);
};

export default PayrollForm;

export const formValidationSchema = Yup.object().shape({
	accountId: Yup.string().required().label('Account'),
	employeeId: Yup.string().required().label('Employee'),
	opportunities: Yup.array()
		.of(
			Yup.object().shape({
				name: Yup.string().required().label('Name'),
				amount: Yup.number().required().label('Amount'),
			})
		)
		.nullable(),
	salaryDate: Yup.date().required().label('Salary date'),
	salaryMonth: Yup.string().required().label('Salary month'),
});

interface IPAYROLLFORM {
	accountId: string;
	employeeId: string;
	opportunities?: IOpportunities[] | null | undefined;
	salaryDate: Date;
	salaryMonth: string;
}

interface IOpportunities {
	amount: number;
	name: string;
}

const getSelectInputData = (payload: Employee[] | Account[]) => {
	const data: ISelectInputData[] = [];

	payload?.map((item) =>
		data.push({
			label: item.name,
			value: item._id,
		})
	);

	return data;
};

export interface ISelectInputData {
	label: string;
	value: string;
}

export const MonthData = [
	{
		label: 'JANUARY',
		value: 'JANUARY',
	},
	{
		label: 'FEBRUARY',
		value: 'FEBRUARY',
	},
	{
		label: 'MARCH',
		value: 'MARCH',
	},
	{
		label: 'APRIL',
		value: 'APRIL',
	},
	{
		label: 'MAY',
		value: 'MAY',
	},
	{
		label: 'JUNE',
		value: 'JUNE',
	},
	{
		label: 'JULY',
		value: 'JULY',
	},
	{
		label: 'AUGUST',
		value: 'AUGUST',
	},
	{
		label: 'SEPTEMBER',
		value: 'SEPTEMBER',
	},
	{
		label: 'OCTOBER',
		value: 'OCTOBER',
	},
	{
		label: 'NOVEMBER',
		value: 'NOVEMBER',
	},
	{
		label: 'DECEMBER',
		value: 'DECEMBER',
	},
];
