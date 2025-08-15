import { Product } from "@/commons/graphql-models/graphql";
import { INVENTORY_PRODUCT_CREATE } from "@/pages/(tenant)/inventory-management/pages/products/products-list/utils/product.query";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Group,
  NumberInput,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const INVENTORY_PRODUCT_QUERY = gql`
  query GetProduct($where: CommonFindDocumentDto!) {
    inventory__product(where: $where) {
      _id
      name
      code
      stockInQuantity
      stockOutQuantity
      isSellableWithoutStock
      price
      purchasePrice
    }
  }
`;

const createProductSchema = yup.object({
  name: yup.string().required("Product name is required"),
  code: yup.string().required("Product code is required"),
  note: yup.string().required("Product description is required"),
  purchasePrice: yup
    .number()
    .min(0, "Price must be positive")
    .required("Purchase price is required"),
  price: yup
    .number()
    .min(0, "Price must be positive")
    .required("Sell price is required")
    .test(
      "greater-than-purchase",
      "Selling price must be greater than purchase price",
      function (value) {
        const { purchasePrice } = this.parent;
        if (purchasePrice && value) {
          return value > purchasePrice;
        }
        return true;
      }
    ),
});

interface CreateProductFormProps {
  onSuccess: (product: Product) => void;
  onCancel: () => void;
}

const CreateProductForm = ({ onSuccess, onCancel }: CreateProductFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(createProductSchema),
    defaultValues: {
      name: "",
      code: "",
      note: "",
      purchasePrice: 0,
      price: 0,
    },
  });

  const [fetchProduct] = useLazyQuery(INVENTORY_PRODUCT_QUERY, {
    onCompleted: (data) => {
      if (data.inventory__product) {
        onSuccess(data.inventory__product);
      }
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: `Failed to fetch created product: ${error.message}`,
        color: "red",
      });
    },
  });

  const [createProduct, { loading }] = useMutation(INVENTORY_PRODUCT_CREATE, {
    onCompleted: (data) => {
      showNotification({
        title: "Success",
        message: "Product created successfully",
        color: "green",
      });

      // Fetch the complete product data using the returned ID
      fetchProduct({
        variables: {
          where: {
            key: "_id",
            operator: "eq",
            value: data.inventory__createProduct._id,
          },
        },
      });
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const formData = watch();

  const onSubmit = (data: any) => {
    createProduct({
      variables: {
        body: {
          name: data.name,
          code: data.code,
          note: data.note,
          purchasePrice: data.purchasePrice,
          price: data.price,
          isSellableWithoutStock: true,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="md">
        <TextInput
          label="Product Name"
          placeholder="Enter product name"
          {...register("name")}
          error={errors.name?.message}
          required
        />

        <TextInput
          label="Product Code"
          placeholder="Enter product code"
          {...register("code")}
          error={errors.code?.message}
          required
        />

        <Textarea
          label="Description"
          placeholder="Enter product description"
          {...register("note")}
          error={errors.note?.message}
          rows={3}
          required
        />

        <NumberInput
          label="Purchase Price"
          placeholder="Enter purchase price"
          value={formData.purchasePrice}
          onChange={(value) => setValue("purchasePrice", value || 0)}
          error={errors.purchasePrice?.message}
          min={0}
          precision={2}
          required
        />

        <NumberInput
          label="Selling Price"
          placeholder="Enter selling price"
          value={formData.price}
          onChange={(value) => setValue("price", value || 0)}
          error={errors.price?.message}
          min={0}
          precision={2}
          required
        />

        <Group position="right" mt="md">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Product
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CreateProductForm;
