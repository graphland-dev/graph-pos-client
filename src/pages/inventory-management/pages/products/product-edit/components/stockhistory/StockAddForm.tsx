import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Space, Textarea, Title, Select } from '@mantine/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { PRODUCT_STOCK_CREATE_MUTATION } from '../../utils/productEdit.query';
import { useParams } from 'react-router-dom';
import { ProductStockType } from '@/_app/graphql-models/graphql';

interface IStockAddFormProps {
  onSubmissionDone: () => void;
  operationType: "STOCK_IN" | "STOCK_OUT";
  operationId?: string | null;
  formData?: any;
  data: any[];
}

const StockAddForm: React.FC<IStockAddFormProps> = ({ operationType, onSubmissionDone, }) => {
  const { productId } = useParams();

    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(validationSchema),
      defaultValues: {
        quantity: 0,
        note: "",
        type: "",
        source: "ADJUSTMENT",
      },
    });


    const [createMutation, { loading: creating }] = useMutation(
      PRODUCT_STOCK_CREATE_MUTATION
    );
  
  const onSubmit = (data: any) => {
    console.log(data);
     createMutation({
       variables: {
         body: {
           ...data,
           productId,
           quantity: parseInt(data.quantity),
         },
       },
       onCompleted: (res) => {
         console.log(res);
         onSubmissionDone();
       },
       onError: (err) => console.log(err),
     });
      

  };
  const objectify = Object.entries(ProductStockType).map(([label, value]) => ({
    label: label.replace(/([A-Z])/g, ' $1') // Insert space before capital letters
    .replace(/^./, function (s) {
      return s.toUpperCase(); // Capitalize the first letter
    }),
    value,
  }));
  return (
    <div>
      <Title order={4}>
        <span className="capitalize">{operationType}</span> Adjustment
      </Title>
      <Space h={"lg"} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input.Wrapper
          label="Quantity"
          withAsterisk
          error={<ErrorMessage name={"quantity"} errors={errors} />}
        >
          <Input placeholder="Quantity" {...register("quantity")} />
        </Input.Wrapper>
        <Input.Wrapper
          label="Type"
          withAsterisk
          error={<ErrorMessage name={"type"} errors={errors} />}
        >
          <Select
            searchable
            withAsterisk
            onChange={(type) => setValue("type", type || "")}
            placeholder="Type"
            data={objectify}
            value={watch("type")}
          />
        </Input.Wrapper>

        <Textarea
          label="Note"
          {...register("note")}
          placeholder="Write your note"
        />

        <Button loading={creating} type="submit">
          Save
        </Button>
      </form>
    </div>
  );
}

export default StockAddForm

const validationSchema = yup.object({
  type: yup.string().required().label("Type"),
  quantity: yup.number().required().label("Quantity"),
  note: yup.string().optional().label("Note"),
  source: yup.string().required().label("Note"),
});