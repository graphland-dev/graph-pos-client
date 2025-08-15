import { Client } from "@/commons/graphql-models/graphql";
import { showNotification } from "@mantine/notifications";
import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { PEOPLE_CREATE_CLIENT } from "@/pages/(tenant)/people/pages/client/utils/client.query";

const createClientSchema = yup.object({
  name: yup.string().required("Client name is required"),
  email: yup.string().email("Invalid email format").optional(),
  contactNumber: yup.string().optional(),
  address: yup.string().optional(),
});

interface CreateClientFormProps {
  onSuccess: (client: Client) => void;
  onCancel: () => void;
}

const CreateClientForm = ({ onSuccess, onCancel }: CreateClientFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createClientSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      address: "",
    },
  });

  const [createClient, { loading }] = useMutation(PEOPLE_CREATE_CLIENT, {
    onCompleted: (data) => {
      showNotification({
        title: "Success",
        message: "Client created successfully",
        color: "green",
      });
      onSuccess(data.people__createClient);
    },
    onError: (error) => {
      showNotification({
        title: "Error",
        message: error.message,
        color: "red",
      });
    },
  });

  const onSubmit = (data: any) => {
    createClient({
      variables: {
        body: {
          name: data.name,
          email: data.email || null,
          contactNumber: data.contactNumber || null,
          address: data.address || null,
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing="md">
        <TextInput
          label="Client Name"
          placeholder="Enter client name"
          {...register("name")}
          error={errors.name?.message}
          required
        />

        <TextInput
          label="Email"
          placeholder="Enter email address"
          {...register("email")}
          error={errors.email?.message}
        />

        <TextInput
          label="Contact Number"
          placeholder="Enter contact number"
          {...register("contactNumber")}
          error={errors.contactNumber?.message}
        />

        <Textarea
          label="Address"
          placeholder="Enter client address"
          {...register("address")}
          error={errors.address?.message}
          rows={3}
        />

        <Group position="right" mt="md">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Client
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CreateClientForm;