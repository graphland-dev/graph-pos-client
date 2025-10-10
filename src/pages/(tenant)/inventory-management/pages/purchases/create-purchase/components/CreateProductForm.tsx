import { commonNotifierCallback } from "@/commons/components/Notification/commonNotifierCallback.ts";
import { Vat, BrandsWithPagination } from "@/commons/graphql-models/graphql";
import { useMutation, useQuery, gql } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Select, Space, NumberInput } from "@mantine/core";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { PURCHASE__PRODUCT_CREATE } from "../utils/products.query";
import { CategoryTreeNode } from "@/pages/(tenant)/inventory-management/shared/types";
import { CategoryPicker } from "@/pages/(tenant)/inventory-management/shared/components";
interface ICreateProductFormProps {
  onRefetchProducts: () => void;
  onClose: () => void;
  vatProfiles: Vat[];
}

const CreateProductForm: React.FC<ICreateProductFormProps> = ({
  onRefetchProducts,
  onClose,
  vatProfiles,
}) => {
  // Fetch categories for dropdown
  const { data: categoriesData, loading: categoriesLoading } = useQuery<{
    inventory__rootCategoriesWithChildren: CategoryTreeNode[];
  }>(CREATE_PRODUCT_CATEGORIES_QUERY);

  // Fetch brands for dropdown
  const { data: brandsData, loading: brandsLoading } = useQuery<{
    setup__brands: BrandsWithPagination;
  }>(CREATE_PRODUCT_BRANDS_QUERY);

  const [createProduct, { loading: creatingProduct }] = useMutation(
    PURCHASE__PRODUCT_CREATE,
    commonNotifierCallback({
      successTitle: "Purchase product created successfully!",
      onSuccess() {
        onRefetchProducts();
        onClose();
      },
    })
  );

  // Process brand options for Select component
  const brandOptions = useMemo(() => {
    if (!brandsData?.setup__brands?.nodes) return [];
    return brandsData.setup__brands.nodes.map((brand) => ({
      value: brand._id,
      label: brand.name,
    }));
  }, [brandsData]);

  // Process VAT profile options for Select component
  const vatOptions = useMemo(() => {
    if (!vatProfiles) return [];
    return vatProfiles.map((vat) => ({
      label: vat?.name,
      value: vat?._id,
    }));
  }, [vatProfiles]);

  const {
    handleSubmit: handleCreateProductForm,
    register: registerCreateProductForm,
    formState: { errors: createProductErrors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
      vatId: "",
      price: 0,
      purchasePrice: 0,
      categoryId: "",
      brandId: "",
    },
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required().label("Name"),
        code: Yup.string().optional().label("Code"),
        price: Yup.number().required().min(0).label("Selling Price"),
        purchasePrice: Yup.number().required().min(0).label("Purchase Price"),
        vatId: Yup.string().optional().label("Vat profile"),
        categoryId: Yup.string().optional().label("Category"),
        brandId: Yup.string().optional().label("Brand"),
      })
    ),
  });

  const createProductFormSubmit = (values: any) => {
    createProduct({
      variables: {
        body: values,
      },
    });
  };

  return (
    <form onSubmit={handleCreateProductForm(createProductFormSubmit)}>
      <Input.Wrapper
        label={
          <span>
            Product name <span style={{ color: "red" }}>*</span>
          </span>
        }
        error={<ErrorMessage errors={createProductErrors} name="name" />}
      >
        <Input
          placeholder="Write product name"
          {...registerCreateProductForm("name")}
        />
      </Input.Wrapper>
      <Space h={"sm"} />
      <Input.Wrapper
        label="Product code (optional)"
        error={<ErrorMessage errors={createProductErrors} name="code" />}
      >
        <Input
          placeholder="Write product code (optional)"
          {...registerCreateProductForm("code")}
        />
      </Input.Wrapper>
      <Space h={"sm"} />

      <Input.Wrapper
        label="Category"
        error={<ErrorMessage errors={createProductErrors} name="categoryId" />}
      >
        <CategoryPicker
          placeholder="Select category (optional)"
          value={watch("categoryId")}
          categories={
            categoriesData?.inventory__rootCategoriesWithChildren || []
          }
          disabled={categoriesLoading}
          onChange={(v: string | null) => setValue("categoryId", v as string)}
          allowClear={true}
          showPath={false}
          showLevel={false}
        />
      </Input.Wrapper>
      <Space h={"sm"} />

      <Input.Wrapper
        label="Brand"
        error={<ErrorMessage errors={createProductErrors} name="brandId" />}
      >
        <Select
          placeholder="Select brand (optional)"
          value={watch("brandId")}
          data={brandOptions}
          disabled={brandsLoading}
          onChange={(v) => setValue("brandId", v as string)}
          clearable
          searchable
        />
      </Input.Wrapper>
      <Space h={"sm"} />

      <Input.Wrapper
        label={
          <span>
            Purchase price <span style={{ color: "red" }}>*</span>
          </span>
        }
        error={
          <ErrorMessage errors={createProductErrors} name="purchasePrice" />
        }
      >
        <NumberInput
          placeholder="Enter purchase price"
          value={watch("purchasePrice")}
          onChange={(value) => setValue("purchasePrice", Number(value) || 0)}
          min={0}
          step={0.01}
        />
      </Input.Wrapper>
      <Space h={"sm"} />

      <Input.Wrapper
        label={
          <span>
            Selling price <span style={{ color: "red" }}>*</span>
          </span>
        }
        error={<ErrorMessage errors={createProductErrors} name="price" />}
      >
        <NumberInput
          placeholder="Enter selling price"
          value={watch("price")}
          onChange={(value) => setValue("price", Number(value) || 0)}
          min={0}
          step={0.01}
        />
      </Input.Wrapper>
      <Space h={"sm"} />
      <Input.Wrapper
        label="Vat profile (optional)"
        error={<ErrorMessage errors={createProductErrors} name="vatId" />}
      >
        <Select
          data={vatOptions}
          placeholder="Select vat profile (optional)"
          value={watch("vatId")}
          onChange={(v) => setValue("vatId", v || "")}
          clearable
        />
      </Input.Wrapper>
      <Space h={"sm"} />
      <Button type="submit" loading={creatingProduct}>
        Save
      </Button>
    </form>
  );
};

export default CreateProductForm;

// GraphQL queries for categories and brands
const CREATE_PRODUCT_CATEGORIES_QUERY = gql`
  query CreateProductCategoriesQuery {
    inventory__rootCategoriesWithChildren {
      _id
      name
      level
      path
      children {
        _id
        name
        level
        path
        children {
          _id
          name
          level
          path
          children {
            _id
            name
            level
            path
          }
        }
      }
    }
  }
`;

const CREATE_PRODUCT_BRANDS_QUERY = gql`
  query CreateProductBrandsQuery {
    setup__brands {
      nodes {
        _id
        name
      }
    }
  }
`;
