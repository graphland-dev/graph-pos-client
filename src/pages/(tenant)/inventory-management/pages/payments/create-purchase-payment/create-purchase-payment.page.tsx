import { commonNotifierCallback } from '@/commons/components/Notification/commonNotifierCallback.ts';
import { ACCOUNTS_LIST_DROPDOWN } from '@/commons/components/common-gql';
import currencyNumberFormat from '@/commons/utils/commaNumber';
import { getAccountBalance } from '@/commons/utils/getBalance';
import {
  AccountsWithPagination,
  MatchOperator,
  ProductPurchase,
  ProductPurchasesWithPagination,
  Supplier,
  SuppliersWithPagination,
} from '@/commons/graphql-models/graphql';
import { PEOPLE_SUPPLIERS_QUERY } from '@/pages/(tenant)/people/pages/suppliers/utils/suppliers.query';
import { useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActionIcon,
  Badge,
  Button,
  Flex,
  Input,
  NumberInput,
  Paper,
  Select,
  Space,
  Table,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import SuppliersCardList from '../../purchases/create-purchase/components/SuppliersCardList';
import PurchaseCardList from './components/PurchaseCardList';
import {
  Accounting__Create_Purchase_Payment,
  Inventory__Product_Purchases,
} from './utils/query';
import {
  IPurchasePaymentFormState,
  Purchase_Payment_Schema_Validation,
} from './utils/validation';

const CreatePurchasePayment = () => {
  const navigate = useNavigate();
  const params = useParams<{ tenant: string }>();
  const [searchParams] = useSearchParams();
  const supplierId = searchParams.get('supplierId');
  const purchaseId = searchParams.get('purchaseId');

  const [supplierPage, onChangeSupplierPage] = useState(1);
  const [purchasePage, onChangePurchasePage] = useState(1);

  const {
    register,
    setValue,
    formState: { errors },
    control,
    watch,
    handleSubmit,
  } = useForm<IPurchasePaymentFormState>({
    defaultValues: {
      date: new Date(),
      // purchaseOrderDate: new Date(),
      // note: "",
      // products: [],
      // costs: [],
      // supplierId: "",
      // taxRate: 0,
    },
    resolver: yupResolver(Purchase_Payment_Schema_Validation),
    mode: 'onChange',
  });

  const {
    append: appendItems,
    fields: itemsFields,
    remove: removeItem,
  } = useFieldArray({
    name: 'items',
    control,
  });

  const netPaymentAmount = () => {
    return watch('items').reduce((total, i) => total + i.amount || 0, 0);
  };

  const {
    data,
    loading: isFetchingSuppliers,
    // refetch: refetchSuppliers,
  } = useQuery<{
    people__suppliers: SuppliersWithPagination;
  }>(PEOPLE_SUPPLIERS_QUERY, {
    variables: {
      where: {
        page: supplierPage,
        limit: 6,
      },
    },
  });

  const {
    data: purchases,
    loading: isFetchingPurchases,
    // refetch: refetchSuppliers,
  } = useQuery<{
    inventory__productPurchases: ProductPurchasesWithPagination;
  }>(Inventory__Product_Purchases, {
    variables: {
      where: {
        filters: [
          {
            key: 'supplier',
            operator: MatchOperator.Eq,
            value: watch('supplierId'),
          },
        ],
      },
    },
    skip: !watch('supplierId'),
  });

  const [createPayment, { loading: creatingPayment }] = useMutation(
    Accounting__Create_Purchase_Payment,
    commonNotifierCallback({
      successTitle: 'Payment created successfully!',
      onSuccess: () => {
        navigate(
          `/${params.tenant}/inventory-management/payments/purchase-payments`,
        );
      },
    }),
  );

  useEffect(() => {
    if (supplierId) setValue('supplierId', supplierId!);

    if (purchaseId) {
      setValue(
        `items`,
        purchases?.inventory__productPurchases?.nodes?.filter(
          (purchase: ProductPurchase) => purchase?._id === purchaseId,
        ) || [],
      );
    }
  }, [supplierId, purchaseId, purchases]);

  const onSubmit = (v: any) => {
    createPayment({
      variables: {
        body: {
          supplierId: v?.supplierId,
          accountId: v?.accountId,
          items: v?.items?.map((item: any) => ({
            purchaseId: item?._id,
            purchaseUID: item?.purchaseUID,
            amount: item?.amount,
          })),
          checkNo: v?.checkNo,
          receptNo: v?.receptNo,
          note: v?.note,
          date: v?.date,
        },
      },
    });
  };

  const { data: accountData } = useQuery<{
    accounting__accounts: AccountsWithPagination;
  }>(ACCOUNTS_LIST_DROPDOWN, {
    variables: {
      where: { limit: -1 },
    },
  });

  const accountListForDrop = accountData?.accounting__accounts?.nodes?.map(
    (item) => ({
      value: item?._id,
      label: `${item?.name} [${item?.referenceNumber}]`,
    }),
  );

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex justify={'space-between'} align={'center'}>
          <div>
            <Title order={4}>
              Select supplier <span className="text-red-500">*</span>
            </Title>
            <Text color="red">{errors?.supplierId?.message}</Text>
          </div>
        </Flex>
        <Space h={'md'} />
        <SuppliersCardList
          isFetchingSuppliers={isFetchingSuppliers}
          setValue={setValue}
          suppliers={data?.people__suppliers?.nodes as Supplier[]}
          watch={watch}
          hasNextPage={data?.people__suppliers?.meta?.hasNextPage as boolean}
          supplierPage={supplierPage}
          onChangeSupplierPage={onChangeSupplierPage}
        />

        <Space h={'md'} />
        <Flex justify={'space-between'} align={'center'}>
          <div>
            <Title order={4}>
              Select purchases to pay <span className="text-red-500">*</span>
            </Title>
            <Text color="red">{errors?.supplierId?.message}</Text>
          </div>
        </Flex>

        <Space h={'md'} />

        <PurchaseCardList
          hasNextPage={
            purchases?.inventory__productPurchases?.meta?.hasNextPage as boolean
          }
          isFetchingPurchases={isFetchingPurchases}
          onChangePurchasePage={onChangePurchasePage}
          purchasePage={purchasePage}
          purchases={
            purchases?.inventory__productPurchases?.nodes as ProductPurchase[]
          }
          setValue={setValue}
          onAddItem={appendItems}
        />

        <Space h={40} />

        <Title order={4}>Items</Title>
        <Space h={'md'} />

        {itemsFields?.length ? (
          <Table withBorder withColumnBorders>
            <thead className="bg-card-header">
              <tr className="!p-2 rounded-md">
                <th>Purchase UID</th>
                <th>Due Amount</th>
                <th>Pay Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {itemsFields?.map((item: ProductPurchase, idx: number) => (
                <tr key={idx}>
                  <td className="font-medium">{item?.purchaseUID}</td>
                  <td className="font-medium">
                    {currencyNumberFormat(
                      (item?.netTotal || 0) - (item?.paidAmount || 0),
                    )}
                  </td>
                  <td className="font-medium">
                    <NumberInput
                      w={100}
                      onChange={(v) =>
                        setValue(`items.${idx}.amount`, parseInt(v as string))
                      }
                      min={1}
                      value={watch(`items.${idx}.amount`)}
                    />
                  </td>
                  <td className="font-medium">
                    <ActionIcon
                      variant="filled"
                      color="red"
                      size={'sm'}
                      onClick={() => {
                        removeItem(idx);
                      }}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} className="!text-right">
                  Net Payment
                </td>
                <td colSpan={2}>{netPaymentAmount()}</td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <Paper className="p-3 font-medium text-left text-red-500 rounded-md">
            <Text>No items added!</Text>
          </Paper>
        )}

        <Space h={30} />

        <Select
          searchable
          withAsterisk
          onChange={(fromAccountId) =>
            setValue('accountId', fromAccountId || '', { shouldValidate: true })
          }
          label="Select account"
          placeholder="Select Account"
          data={accountListForDrop || []}
          value={watch('accountId')}
        />
        <p className="text-red-500">
          <ErrorMessage errors={errors} name="accountId" />
        </p>

        <Space h={'sm'} />

        {watch('accountId') && (
          <Badge p={'md'}>
            Available Balance:{' '}
            {getAccountBalance(
              accountData?.accounting__accounts?.nodes || [],
              watch('accountId'),
            )}
          </Badge>
        )}

        <Space h={'sm'} />

        <Input.Wrapper
          label="Check no"
          error={<ErrorMessage errors={errors} name="checkNo" />}
        >
          <Input placeholder="Write check no" {...register('checkNo')} />
        </Input.Wrapper>

        <Space h={'sm'} />

        <Input.Wrapper
          label="Recept no"
          error={<ErrorMessage errors={errors} name="receptNo" />}
        >
          <Input placeholder="Write recept no" {...register('receptNo')} />
        </Input.Wrapper>

        <Space h={'sm'} />

        <Input.Wrapper
          label="Payment Date"
          error={<ErrorMessage errors={errors} name="date" />}
        >
          <DateInput
            value={watch('date')}
            onChange={(date) => setValue('date', date!)}
          />
        </Input.Wrapper>

        <Space h={'sm'} />

        <Input.Wrapper
          label="Note"
          error={<ErrorMessage errors={errors} name="note" />}
        >
          <Textarea placeholder="Write note" {...register('note')} />
        </Input.Wrapper>

        <Space h={30} />

        <Button type="submit" fullWidth loading={creatingPayment}>
          Save
        </Button>
      </form>
    </div>
  );
};

export default CreatePurchasePayment;
