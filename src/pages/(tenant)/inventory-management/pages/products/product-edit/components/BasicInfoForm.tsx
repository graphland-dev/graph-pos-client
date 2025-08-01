import { commonNotifierCallback } from "@/commons/components/Notification/commonNotifierCallback.ts";
import { MatchOperator, Product } from "@/commons/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Switch, Textarea } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import {
  INVENTORY_PRODUCT_BASIC_INFO_QUERY,
  INVENTORY_PRODUCT_UPDATE,
} from "../utils/productEdit.query";

const BasicInfoForm = () => {
  const { productId } = useParams<{ productId: string }>();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      code: "",
      partId: "",
      modelName: "",
      note: "",
      isSellableWithoutStock: false,
    },

    resolver: yupResolver(BASIC_FORM_SCHEMA),
  });

  const { data: basicInfo, refetch } = useQuery<{
    inventory__product: Product;
  }>(INVENTORY_PRODUCT_BASIC_INFO_QUERY, {
    variables: {
      where: {
        key: "_id",
        operator: MatchOperator.Eq,
        value: productId,
      },
    },
  });

  const [saveForm, { loading: savingInfo }] = useMutation(
    INVENTORY_PRODUCT_UPDATE,
    commonNotifierCallback({
      successTitle: "Basic information saved!",
      onSuccess() {
        refetch();
      },
    })
  );

  useEffect(() => {
    setValue("name", basicInfo?.inventory__product?.name ?? "");
    setValue("code", basicInfo?.inventory__product?.code ?? "");
    setValue("partId", basicInfo?.inventory__product?.partId ?? "");
    setValue("modelName", basicInfo?.inventory__product?.modelName ?? "");
    setValue("note", basicInfo?.inventory__product?.note ?? "");
    setValue(
      "isSellableWithoutStock",
      basicInfo?.inventory__product?.isSellableWithoutStock ?? false
    );
  }, [basicInfo]);

  const onSubmit = (value: IBasicInfoFormState) => {
    saveForm({
      variables: {
        where: {
          key: "_id",
          operator: MatchOperator.Eq,
          value: productId,
        },
        body: value,
      },
    });
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 lg:w-8/12"
      >
        <Input.Wrapper
          label="Name"
          error={<ErrorMessage errors={errors} name="name" />}
        >
          <Input placeholder="Write product name" {...register("name")} />
        </Input.Wrapper>

        <Input.Wrapper
          label="Code"
          error={<ErrorMessage errors={errors} name="code" />}
        >
          <Input placeholder="Write product code" {...register("code")} />
        </Input.Wrapper>

        <Input.Wrapper
          label="Model"
          error={<ErrorMessage errors={errors} name="modelName" />}
        >
          <Input placeholder="Write product model" {...register("modelName")} />
        </Input.Wrapper>

        <Input.Wrapper
          label="Part ID"
          error={<ErrorMessage errors={errors} name="partId" />}
        >
          <Input placeholder="Write product part id" {...register("partId")} />
        </Input.Wrapper>

        <Input.Wrapper
          label="Note"
          error={<ErrorMessage errors={errors} name="note" />}
        >
          <Textarea placeholder="Write product note" {...register("note")} />
        </Input.Wrapper>

        <Input.Wrapper label="Is without stock sellable?">
          <Switch size="md" {...register("isSellableWithoutStock")} />
        </Input.Wrapper>

        <Button type="submit" loading={savingInfo} className="w-min">
          Save
        </Button>
      </form>
    </div>
  );
};

export default BasicInfoForm;

const BASIC_FORM_SCHEMA = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  code: Yup.string().optional().nullable().label("Code"),
  partId: Yup.string().optional().nullable().label("Code"),
  modelName: Yup.string().optional().nullable().label("Model name"),
  note: Yup.string().optional().nullable().label("Note"),
  isSellableWithoutStock: Yup.boolean()
    .optional()
    .nullable()
    .label("Is without stock sellable?"),
});

export interface IBasicInfoFormState
  extends Yup.Asserts<typeof BASIC_FORM_SCHEMA> {}
