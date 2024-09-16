import { Notify } from '@/_app/common/Notification/Notify';
import {
  BrandsWithPagination,
  MatchOperator,
  Product,
  ProductCategorysWithPagination,
  UnitsWithPagination,
  VatsWithPagination,
} from '@/_app/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Select, Space } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import {
  BRANDS_QUERY,
  CATEGORIES_QUERY,
  INVENTORY_PRODUCT_ASSIGNMENT_QUERY,
  INVENTORY_PRODUCT_UPDATE,
  UNITS_QUERY,
  VATS_QUERY,
} from '../utils/productEdit.query';

const AssignmentForm = () => {
  const { productId } = useParams();
  const {
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      categoryId: '',
      brandId: '',
      vatId: '',
      unitId: '',
    },

    resolver: yupResolver(ASSIGNMENT_FORM_SCHEMA),
  });

  const { data: assignmentInfo, refetch } = useQuery<{
    inventory__product: Product;
  }>(INVENTORY_PRODUCT_ASSIGNMENT_QUERY, {
    variables: {
      where: {
        key: '_id',
        operator: MatchOperator.Eq,
        value: productId,
      },
    },
  });

  const { data: categories, loading: categories__loading } = useQuery<{
    inventory__productCategories: ProductCategorysWithPagination;
  }>(CATEGORIES_QUERY);

  const { data: brands, loading: brands__loading } = useQuery<{
    setup__brands: BrandsWithPagination;
  }>(BRANDS_QUERY);

  const { data: units, loading: units__loading } = useQuery<{
    setup__units: UnitsWithPagination;
  }>(UNITS_QUERY);

  const { data: vats, loading: vats__loading } = useQuery<{
    setup__vats: VatsWithPagination;
  }>(VATS_QUERY);

  const [saveForm, { loading: savingInfo }] = useMutation(
    INVENTORY_PRODUCT_UPDATE,
    Notify({
      successTitle: 'Assignment information saved!',
      onSuccess() {
        refetch();
      },
    }),
  );

  useEffect(() => {
    setValue(
      'categoryId',
      assignmentInfo?.inventory__product?.category?._id as string,
    );
    setValue(
      'brandId',
      assignmentInfo?.inventory__product?.brand?._id as string,
    );
    setValue('unitId', assignmentInfo?.inventory__product?.unit?._id as string);
    setValue('vatId', assignmentInfo?.inventory__product?.vat?._id as string);
  }, [assignmentInfo]);

  const onSubmit = (value: IAssignmentInfoFormState) => {
    saveForm({
      variables: {
        where: {
          key: '_id',
          operator: MatchOperator.Eq,
          value: productId,
        },
        body: {
          categoryId: value?.categoryId,
          brandId: value?.brandId,
          unitId: value?.unitId,
          vatId: value?.vatId,
        },
      },
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="lg:w-8/12">
        <Input.Wrapper
          label="Category"
          error={<ErrorMessage errors={errors} name="categoryId" />}
        >
          <Select
            placeholder="Pick a category"
            value={watch('categoryId')}
            data={getSelectInputData(
              categories?.inventory__productCategories?.nodes,
            )}
            disabled={categories__loading}
            onChange={(v) => setValue('categoryId', v as string)}
          />
        </Input.Wrapper>
        <Space h={'sm'} />
        <Input.Wrapper
          label="Brand"
          error={<ErrorMessage errors={errors} name="brandId" />}
        >
          <Select
            placeholder="Pick a brand"
            value={watch('brandId')}
            data={getSelectInputData(brands?.setup__brands?.nodes)}
            disabled={brands__loading}
            onChange={(v) => setValue('brandId', v as string)}
          />
        </Input.Wrapper>
        <Space h={'sm'} />
        <Input.Wrapper
          label="Unit"
          error={<ErrorMessage errors={errors} name="unitId" />}
        >
          <Select
            placeholder="Pick a unit"
            value={watch('unitId')}
            data={getSelectInputData(units?.setup__units?.nodes)}
            disabled={units__loading}
            onChange={(v) => setValue('unitId', v as string)}
          />
        </Input.Wrapper>
        <Space h={'sm'} />
        <Input.Wrapper
          label="Vat profile"
          error={<ErrorMessage errors={errors} name="vatId" />}
        >
          <Select
            placeholder="Pick a vat profile"
            value={watch('vatId')}
            data={getSelectInputData(vats?.setup__vats?.nodes)}
            disabled={vats__loading}
            onChange={(v) => setValue('vatId', v as string)}
          />
        </Input.Wrapper>
        <Space h={'sm'} />

        <Button type="submit" loading={savingInfo}>
          Save
        </Button>
      </form>
    </div>
  );
};

export default AssignmentForm;

export const getSelectInputData = (data: any) => {
  const result: any = [];

  data?.map((d: any) =>
    result.push({
      label: d.name ?? d?._id,
      value: d._id,
    }),
  );

  return result;
};

const ASSIGNMENT_FORM_SCHEMA = Yup.object().shape({
  categoryId: Yup.string().optional().label('Category'),
  brandId: Yup.string().optional().nullable().label('Brand'),
  vatId: Yup.string().optional().nullable().label('Vat profile'),
  unitId: Yup.string().optional().nullable().label('Unit'),
});

export interface IAssignmentInfoFormState
  extends Yup.Asserts<typeof ASSIGNMENT_FORM_SCHEMA> {}
