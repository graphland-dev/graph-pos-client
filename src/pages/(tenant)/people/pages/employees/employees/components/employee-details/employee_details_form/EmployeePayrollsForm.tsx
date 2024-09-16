import { Notify } from '@/_app/common/Notification/Notify';
import { getAccountBalance, getAccountDetails } from '@/_app/utils/getBalance';
import { Account, Employee, Month_Name } from '@/_app/graphql-models/graphql';
import { CREATE_PAYROLL_MUTATION } from '@/pages/(tenant)/accounting/pages/cashbook/payroll/utils/payroll.query';
import { getSelectInputData } from '@/pages/(tenant)/inventory-management/pages/products/product-edit/components/AssignmentForm';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Flex,
  Input,
  Paper,
  Select,
  Space,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import classNames from 'classnames';
import { useFieldArray, useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface IPayrollsDetailsProps {
  employeeDetails: Employee | null;
  currentSalary: number | undefined;
  onFormSubmitted: () => void;
  accounts: Account[];
}

interface IPayrollForm {
  accountId: string;
  opportunities?: IOpportunities[] | null | undefined;
  salaryDate: Date;
  salaryMonth: string;
}
interface IOpportunities {
  amount: number;
  name: string;
}

const EmployeePayrollsForm: React.FC<IPayrollsDetailsProps> = ({
  employeeDetails,
  accounts,
  onFormSubmitted,
}) => {
  const { colorScheme } = useMantineColorScheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm({
    defaultValues: {
      accountId: '',
      opportunities: [
        {
          name: 'Internet Bill',
          amount: 0,
        },
        {
          name: 'Bonus',
          amount: 0,
        },
        {
          name: 'Festival Bonus',
          amount: 0,
        },
      ],
      salaryDate: new Date(),
      salaryMonth: Month_Name.January,
    },
    resolver: yupResolver(formValidationSchema),
  });

  const { append, remove, fields } = useFieldArray({
    name: 'opportunities',
    control,
  });

  const [createPayroll, { loading: creating }] = useMutation(
    CREATE_PAYROLL_MUTATION,
    Notify({
      successTitle: 'Create payroll done!',
      onSuccess() {
        onFormSubmitted();
      },
    }),
  );

  const onSubmit = (values: IPayrollForm) => {
    createPayroll({
      variables: {
        body: {
          accountId: values.accountId,
          employeeId: employeeDetails?._id,
          opportunities: values.opportunities,
          salaryDate: values.salaryDate,
          salaryMonth: values.salaryMonth,
        },
      },
    });
  };

  //-------------------------------------------------------------
  // ------------ Utilities
  //-------------------------------------------------------------

  const getTotalOpportunityAmount = () => {
    return watch('opportunities')?.reduce(
      (total, current) => total + current?.amount,
      0,
    );
  };

  const totalSalary = () => {
    const salary = employeeDetails?.salary || 0;
    const opportunity = getTotalOpportunityAmount() || 0;
    return salary + opportunity;
  };

  const getRemainingAmount = () => {
    const salary = employeeDetails?.salary || 0;
    const opportunity = getTotalOpportunityAmount() || 0;
    const accountBalance =
      getAccountBalance(accounts || [], watch('accountId')) || 0;
    return accountBalance - (salary + opportunity);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input.Wrapper
          withAsterisk
          label="Select account"
          error={<ErrorMessage errors={errors} name="accountId" />}
        >
          <Select
            searchable
            withAsterisk
            placeholder="Pick account"
            // disabled={!employees?.length}
            onChange={(e) => setValue('accountId', e!)}
            data={getSelectInputData(accounts as Account[])}
          />
        </Input.Wrapper>

        <Space h={'sm'} />

        {watch('accountId') && (
          <Badge p={'md'}>
            Available Balance:{' '}
            {getAccountBalance(accounts || [], watch('accountId'))}
          </Badge>
        )}

        <Space h={'sm'} />

        <Input.Wrapper
          label="Date"
          withAsterisk
          error={<ErrorMessage errors={errors} name="date" />}
        >
          <DateInput
            placeholder="Pick a date"
            defaultValue={watch('salaryDate')}
            onChange={(d) => setValue('salaryDate', d!)}
          />
        </Input.Wrapper>

        <Space h={'sm'} />

        <Input.Wrapper
          label="Salary month"
          withAsterisk
          error={<ErrorMessage errors={errors} name="salaryMonth" />}
        >
          <Select
            placeholder="Pick a month"
            data={MonthData}
            onChange={(m) => setValue('salaryMonth', m!)}
            defaultValue={watch('salaryMonth')}
          />
        </Input.Wrapper>

        <Space h={'lg'} />

        {fields?.map((_, idx) => (
          <div
            key={idx}
            className={classNames('relative p-2 my-2 rounded-sm', {
              'bg-gray-100': colorScheme != 'dark',
              'bg-gray-800': colorScheme == 'dark',
            })}
          >
            <ActionIcon
              color="red"
              size={'sm'}
              radius={100}
              variant="filled"
              className="absolute -top-2 -right-1"
              onClick={() => remove(idx)}
            >
              <IconMinus size={16} />
            </ActionIcon>
            <Input.Wrapper
              label="Opportunity name"
              withAsterisk
              error={
                <ErrorMessage
                  errors={errors}
                  name={`opportunities.${idx}.name`}
                />
              }
            >
              <Input
                size="xs"
                placeholder="Write opportunity name"
                {...register(`opportunities.${idx}.name`)}
              />
            </Input.Wrapper>

            <Space h={'xs'} />
            <Input.Wrapper
              label="Opportunity amount"
              withAsterisk
              error={
                <ErrorMessage
                  errors={errors}
                  name={`opportunities.${idx}.amount`}
                />
              }
            >
              <Input
                size="xs"
                type="number"
                placeholder="Write opportunity amount"
                {...register(`opportunities.${idx}.amount`, {
                  valueAsNumber: true,
                })}
              />
            </Input.Wrapper>
          </div>
        ))}

        <Button
          variant="subtle"
          size="xs"
          leftIcon={<IconPlus size={16} />}
          onClick={() =>
            append({
              name: '',
              amount: 0,
            })
          }
        >
          Add new
        </Button>
        <Space h={'sm'} />

        <Paper withBorder p={'sm'} mb={'xl'}>
          <Flex justify={'space-between'}>
            <Box>
              <Text fw={'bold'}>Base Salary</Text>
              <Text fw={'bold'}>Opportunity</Text>
            </Box>
            <Box>
              <Text>{employeeDetails?.salary || 0} BDT</Text>
              <Text>{getTotalOpportunityAmount()}</Text>
            </Box>
          </Flex>
          <hr />
          <Flex justify={'space-between'}>
            <Text fw={'bold'}>Sub total</Text>
            <Text>{totalSalary()} BDT</Text>
          </Flex>
          <Flex justify={'space-between'}>
            <Text fw={'bold'}>
              Money on Account [
              {getAccountDetails(accounts, watch('accountId'))?.referenceNumber}
              ]
            </Text>
            <Text>{getAccountBalance(accounts, watch('accountId'))} BDT</Text>
          </Flex>
          <hr />
          <Flex justify={'space-between'}>
            <Text fw={'bold'}>Remaining Balance</Text>
            <Text>{getRemainingAmount()} BDT</Text>
          </Flex>
        </Paper>

        <Button
          disabled={!watch('accountId')}
          type="submit"
          loading={creating}
          fullWidth
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default EmployeePayrollsForm;

const formValidationSchema = Yup.object().shape({
  accountId: Yup.string().required().label('Account'),
  opportunities: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required().label('Name'),
        amount: Yup.number().required().label('Amount'),
      }),
    )
    .nullable(),
  salaryDate: Yup.date().required().label('Salary date'),
  salaryMonth: Yup.string().required().label('Salary month'),
});

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
