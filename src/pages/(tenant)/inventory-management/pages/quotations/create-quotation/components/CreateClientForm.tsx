import { Client } from "@/commons/graphql-models/graphql";
import { showNotification } from "@mantine/notifications";
import { useMutation, useLazyQuery } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { PEOPLE_CREATE_CLIENT } from "@/pages/(tenant)/people/pages/client/utils/client.query";
import { gql } from "@apollo/client";

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

  const [fetchClient] = useLazyQuery<{ people__client: Client }>(
    PEOPLE_CLIENT_QUERY,
    {
      onCompleted: (data) => {
        if (data.people__client._id) {
          onSuccess(data.people__client);
        }
      },
      onError: (error) => {
        showNotification({
          title: "Error",
          message: `Failed to fetch created client: ${error.message}`,
          color: "red",
        });
      },
    }
  );

  const [createClient, { loading }] = useMutation(PEOPLE_CREATE_CLIENT, {
    onCompleted: (data) => {
      showNotification({
        title: "Success",
        message: "Client created successfully",
        color: "green",
      });

      // Fetch the complete client data using the returned ID
      fetchClient({
        variables: {
          where: {
            key: "_id",
            operator: "eq",
            value: data.people__createClient._id,
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

  const onSubmit = (data: any) => {
    createClient({
      variables: {
        body: {
          name: data.name,
          contactNumber: data.contactNumber,
          email: data.email || null,
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
          required
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

const createClientSchema = yup.object({
  name: yup.string().required("Client name is required"),
  contactNumber: yup.string().required("Contact number is required"),
  email: yup.string().email("Invalid email format").optional(),
  address: yup.string().optional(),
});

const PEOPLE_CLIENT_QUERY = gql`
  query GetClient($where: CommonFindDocumentDto!) {
    people__client(where: $where) {
      _id
      name
      contactNumber
      email
      address
      createdAt
      updatedAt
    }
  }
`;
