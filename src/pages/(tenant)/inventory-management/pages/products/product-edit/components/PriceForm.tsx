import { Notify } from '@/_app/common/Notification/Notify';
import { MatchOperator, Product } from '@/_app/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, SegmentedControl, Space } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import {
  INVENTORY_PRODUCT_PRICE_QUERY,
  INVENTORY_PRODUCT_UPDATE,
} from '../utils/productEdit.query';

const PriceForm = () => {
  const [segment, setSegment] = useState<'AMOUNT' | 'PERCENTAGE'>('PERCENTAGE');

  const { productId } = useParams();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      price: 0,
      discountAmount: 0,
      discountPercentage: 0,
    },

    resolver: yupResolver(PRICE_FORM_SCHEMA),
  });

  const { data: priceInfo, refetch } = useQuery<{
    inventory__product: Product;
  }>(INVENTORY_PRODUCT_PRICE_QUERY, {
    variables: {
      where: {
        key: '_id',
        operator: MatchOperator.Eq,
        value: productId,
      },
    },
  });

  const [saveForm, { loading: savingInfo }] = useMutation(
    INVENTORY_PRODUCT_UPDATE,
    Notify({
      successTitle: 'Price information saved!',
      onSuccess() {
        refetch();
      },
    }),
  );

  useEffect(() => {
    setValue('price', priceInfo?.inventory__product?.price as number);
    setValue(
      'discountAmount',
      priceInfo?.inventory__product?.discountAmount as number,
    );
    setValue(
      'discountPercentage',
      priceInfo?.inventory__product?.discountPercentage as number,
    );

    setSegment(
      (priceInfo?.inventory__product?.discountMode as any) ?? 'PERCENTAGE',
    );
  }, [priceInfo]);

  const onSubmit = (value: IPriceFormState) => {
    saveForm({
      variables: {
        where: {
          key: '_id',
          operator: MatchOperator.Eq,
          value: productId,
        },
        body: { ...value, discountMode: segment },
      },
    });
  };

  return (
    <div>
      <form className="lg:w-8/12" onSubmit={handleSubmit(onSubmit)}>
        <Input.Wrapper
          label="Price"
          error={<ErrorMessage errors={errors} name="price" />}
        >
          <Input
            placeholder="Write product price"
            type="number"
            {...register('price')}
          />
        </Input.Wrapper>

        <Space h={'md'} />

        <SegmentedControl
          value={segment}
          onChange={(e) => setSegment(e as 'AMOUNT' | 'PERCENTAGE')}
          data={[
            { label: 'Percentage', value: 'PERCENTAGE' },
            { label: 'Amount', value: 'AMOUNT' },
          ]}
        />
        {segment === 'AMOUNT' && (
          <>
            <Input.Wrapper
              label="Discount amount"
              error={<ErrorMessage errors={errors} name="discountAmount" />}
            >
              <Input
                placeholder="Write discount amount"
                type="number"
                {...register('discountAmount')}
              />
            </Input.Wrapper>
            <Space h={'sm'} />
          </>
        )}
        {segment === 'PERCENTAGE' && (
          <>
            <Input.Wrapper
              label="Discount percentage"
              error={<ErrorMessage errors={errors} name="discountPercentage" />}
            >
              <Input
                type="number"
                placeholder="Write discount percentage"
                {...register('discountPercentage')}
              />
            </Input.Wrapper>
            <Space h={'sm'} />
          </>
        )}
        {/* )} */}
        <Space h={'sm'} />

        <Button type="submit" loading={savingInfo}>
          Save
        </Button>
      </form>
    </div>
  );
};

export default PriceForm;

const PRICE_FORM_SCHEMA = Yup.object().shape({
  price: Yup.number().required().label('Price'),
  discountAmount: Yup.number().optional().nullable().label('Amount'),
  discountPercentage: Yup.number().optional().nullable().label('Percentage'),
});

export interface IPriceFormState
  extends Yup.Asserts<typeof PRICE_FORM_SCHEMA> {}
