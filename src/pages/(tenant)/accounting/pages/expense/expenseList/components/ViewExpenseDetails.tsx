import Attachments from '@/commons/components/Attactment/Attachments.tsx';
import currencyNumberFormat from '@/commons/utils/commaNumber';
import dateFormat from '@/commons/utils/dateFormat';
import { Expense } from '@/commons/graphql-models/graphql';
import { FOLDER__NAME } from '@/commons/models/FolderName';
import { Divider, Paper, Text, Title } from '@mantine/core';

interface IExpenseDetailsProps {
  expenseDetails: Expense | null;
  refetch: () => void;
}

const ViewExpenseDetails: React.FC<IExpenseDetailsProps> = ({
  expenseDetails,
}) => {
  return (
    <div>
      <div className="flex flex-col gap-4 pb-5">
        <Paper
          p={10}
          radius={3}
          withBorder
          className="flex flex-col w-full gap-1"
        >
          <Title order={4}>Purpose</Title>
          <Divider />
          <Text className="flex justify-between mt-2">
            <span className="font-semibold text-neutral-primary">
              Purpose:{' '}
            </span>
            {expenseDetails?.purpose}
          </Text>
        </Paper>
        <Paper
          p={10}
          radius={3}
          withBorder
          className="flex flex-col w-full gap-1"
        >
          <Title order={4}>Account</Title>
          <Divider />
          <Text className="flex justify-between mt-2">
            <span className="font-semibold text-neutral-primary">
              Account:{' '}
            </span>
            {`${expenseDetails?.account?.name} [${expenseDetails?.account?.referenceNumber}]`}
          </Text>
        </Paper>
        <Paper
          p={10}
          radius={3}
          withBorder
          className="flex flex-col w-full gap-1"
        >
          <Title order={4}>Amount</Title>
          <Divider />
          <Text className="flex justify-between mt-2">
            <span className="font-semibold text-neutral-primary">Amount: </span>
            {currencyNumberFormat(expenseDetails?.amount || 0)} BDT
          </Text>
        </Paper>
        <Paper
          p={10}
          radius={3}
          withBorder
          className="flex flex-col w-full gap-1"
        >
          <Title order={4}>Date</Title>
          <Divider />
          <Text className="flex justify-between mt-2">
            <span className="font-semibold text-neutral-primary">Date: </span>
            {dateFormat(expenseDetails?.date)}
          </Text>
        </Paper>
        <Paper
          p={10}
          radius={3}
          withBorder
          className="flex flex-col w-full gap-1"
        >
          <Title order={4}>Category</Title>
          <Divider />
          <Text className="flex justify-between mt-2">
            <span className="font-semibold text-neutral-primary">
              Category:{' '}
            </span>
            {(expenseDetails?.category as { name: string } | undefined)?.name ||
              ''}
          </Text>
        </Paper>
        <Paper
          p={10}
          radius={3}
          withBorder
          className="flex flex-col w-full gap-1"
        >
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              Check No:{' '}
            </span>
            {expenseDetails?.checkNo}
          </Text>
          <Text className="flex justify-between">
            <span className="font-semibold text-neutral-primary">
              Voucher No:{' '}
            </span>
            {expenseDetails?.voucherNo}
          </Text>
        </Paper>
        <Attachments
          attachments={expenseDetails?.attachments ?? []}
          onUploadDone={() => {}}
          enableUploader={false}
          enableDelete={false}
          folder={FOLDER__NAME.EXPENSE_ATTACHMENTS}
        />
      </div>
    </div>
  );
};

export default ViewExpenseDetails;
