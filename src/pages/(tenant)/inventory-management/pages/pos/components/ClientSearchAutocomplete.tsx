import { Notify } from "@/_app/common/Notification/Notify";
import {
  Client,
  ClientsWithPagination,
  MatchOperator,
} from "@/_app/graphql-models/graphql";
import { PEOPLE_CREATE_CLIENT } from "@/pages/(tenant)/people/pages/client/utils/client.query";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ActionIcon,
  Button,
  Drawer,
  Flex,
  Input,
  Paper,
  Space,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { Pos_Client_Query } from "../utils/query.pos";

interface ClientFormType {
  name: string;
  email?: string | undefined | null;
  contactNumber: string;
}

import AutoComplete from "@/_app/common/components/AutoComplete";
import React, { useState } from "react";

const ClientSearchAutocomplete: React.FC<{
  prefilledClientId: string;
  onSelectClientId: (_id: string) => void;
}> = ({ onSelectClientId, prefilledClientId }) => {
  const [q, setQ] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);

  const [opened, handler] = useDisclosure();

  const { loading, refetch } = useQuery<{
    people__clients: ClientsWithPagination;
  }>(Pos_Client_Query, {
    variables: {
      where: {
        filters: [
          {
            or: [
              {
                key: "name",
                operator: MatchOperator.Contains,
                value: q?.trim(),
              },
              {
                key: "contactNumber",
                operator: MatchOperator.Contains,
                value: q?.trim(),
              },
            ],
          },
        ],
      },
    },
    fetchPolicy: "network-only",
    skip: !q,
    onCompleted(data) {
      setClients(data.people__clients.nodes || []);
    },
  });

  const [searchClientTrigger, { loading: lazySearch }] = useLazyQuery<{
    people__clients: ClientsWithPagination;
  }>(Pos_Client_Query, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      setClients(data.people__clients.nodes || []);
    },
  });

  // client form instance
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ClientFormType>({
    resolver: yupResolver(
      Yup.object().shape({
        name: Yup.string().required().label("Name"),
        contactNumber: Yup.string().required().label("Contact Number"),
        email: Yup.string().optional().nullable().email().label("Email"),
      })
    ),
  });

  // fill form
  useEffect(() => {
    onSelectClientId(prefilledClientId);

    searchClientTrigger({
      variables: {
        where: {
          filters: [
            {
              key: "_id",
              operator: MatchOperator.Eq,
              value: prefilledClientId?.trim(),
            },
          ],
        },
      },
    });
  }, [prefilledClientId]);

  // client create mutation
  const [createClient, { loading: creatingClient }] = useMutation(
    PEOPLE_CREATE_CLIENT,
    Notify({
      sucTitle: "Client created",
      onSuccess: (res) => {
        reset({
          name: "",
          email: "",
          contactNumber: "",
        });
        onSelectClientId(res?.people__createClient?._id);
        refetch();
        handler.close();
      },
    })
  );

  // client form submit
  const onSubmitClientForm = (values: ClientFormType) => {
    createClient({
      variables: { body: values },
    });
  };

  return (
    <div>
      <Input.Wrapper size="md">
        <Flex align={"center"} className="!w-full">
          <AutoComplete
            loading={lazySearch || loading}
            data={clients}
            onChange={setQ}
            placeholder="Search client"
            enableNoResultDropdown
            NoResultComponent={
              <div className="flex gap-2 py-2 cursor-pointer item-center">
                <IconPlus />
                <Text>Create One</Text>
              </div>
            }
            onSelect={(item: any) => {
              if (typeof item === "object") {
                console.log(item?._id);
                onSelectClientId(item?._id);
              } else {
                setValue("contactNumber", item);
                handler.open();
              }
            }}
            labelKey={"name"}
          />
          <ActionIcon
            size={42}
            variant="subtle"
            color="blue"
            radius={0}
            onClick={handler.open}
          >
            <IconPlus />
          </ActionIcon>
        </Flex>

        <Space h={"sm"} />

        {prefilledClientId && (
          <Paper p={8} withBorder w={295}>
            <Text>{findClientById(prefilledClientId, clients)?.name}</Text>
            <Text size={"xs"}>
              {findClientById(prefilledClientId, clients)?.email}
            </Text>
          </Paper>
        )}
      </Input.Wrapper>

      {/* client create drawer */}
      <Drawer onClose={handler.close} opened={opened} title="Create client">
        <form onSubmit={handleSubmit(onSubmitClientForm)}>
          <Input.Wrapper
            label="Name"
            error={<ErrorMessage name="name" errors={errors} />}
          >
            <Input placeholder="Name" {...register("name")} />
          </Input.Wrapper>

          <Space h={"sm"} />

          <Input.Wrapper
            label="Contact Number"
            error={<ErrorMessage name="contactNumber" errors={errors} />}
          >
            <Input
              placeholder="Contact number"
              {...register("contactNumber")}
              defaultValue={watch("contactNumber")}
            />
          </Input.Wrapper>

          <Space h={"sm"} />

          <Input.Wrapper
            label="Email"
            error={<ErrorMessage name="email" errors={errors} />}
          >
            <Input placeholder="Email" {...register("email")} />
          </Input.Wrapper>

          <Space h={"sm"} />

          <Button type="submit" loading={creatingClient}>
            Create
          </Button>
        </form>
      </Drawer>
    </div>
  );
};

export default ClientSearchAutocomplete;

// find client by ID
const findClientById = (_id: string, data: Client[]) => {
  const client = data?.find((c) => c?._id === _id);
  return client;
};
