import { RolePermission } from "@/_app/graphql-models/graphql";
import { Button, Checkbox, Flex, Space, Title } from "@mantine/core";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { rolesWithPermissions } from "../utils/roles-with-permissions";

interface IRolePermissionFormProps {
  rolePermissions: RolePermission[];
  isReadOnly?: boolean;
}

interface IRolePermissionFormValues {
  rolePermissions: RolePermission[];
}

const RolePermissionForm: React.FC<IRolePermissionFormProps> = ({
  rolePermissions,
  isReadOnly,
}) => {
  const { control, watch, setValue, handleSubmit } =
    useForm<IRolePermissionFormValues>({
      defaultValues: {
        rolePermissions: [],
      },
    });

  const { append } = useFieldArray({
    control,
    name: "rolePermissions",
  });

  useEffect(() => {
    setValue("rolePermissions", rolePermissions);
  }, [rolePermissions]);

  const isPermissionChecked = (collectionName: string, action: string) => {
    return watch("rolePermissions").some(
      (permission) =>
        permission?.collectionName === collectionName &&
        permission.actions.includes(action)
    );
  };

  const onChangeRolePermissionAction = (
    collectionName: string,
    action: string
  ) => {
    const index = watch("rolePermissions").findIndex(
      (permission) => permission?.collectionName === collectionName
    );

    if (index === -1) {
      append({
        collectionName: collectionName,
        actions: [action],
      });
    } else {
      const actions = watch(`rolePermissions.${index}.actions`);

      if (action === "*" && !actions.includes("*")) {
        setValue(`rolePermissions.${index}.actions`, ["*"]);
        return;
      }

      if (
        [...actions, action].includes("read") &&
        [...actions, action].includes("create") &&
        [...actions, action].includes("update") &&
        [...actions, action].includes("delete")
      ) {
        setValue(`rolePermissions.${index}.actions`, ["*"]);
        return;
      }

      if (actions.includes("*") && action !== "*") {
        const actionIndex = actions.findIndex((a) => a === "*");
        actions.splice(actionIndex, 1);
        setValue(`rolePermissions.${index}.actions`, [...actions, action]);
        return;
      }

      if (actions.includes(action)) {
        const actionIndex = actions.findIndex((a) => a === action);
        actions.splice(actionIndex, 1);
        setValue(`rolePermissions.${index}.actions`, actions);
      } else {
        setValue(`rolePermissions.${index}.actions`, [...actions, action]);
      }
    }
  };

  const onSubmit = (values: IRolePermissionFormValues) => {
    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">
      {rolesWithPermissions.map((module) => (
        <div className="p-5 border border-gray-300 border-dashed">
          <Title order={5}>{module.name}</Title>
          <Space h={"xs"} />
          {module.collections.map((collection) => (
            <div>
              {collection.split("__")[1]}
              <Flex gap={30} my={10}>
                <Checkbox
                  label="*"
                  value={"*"}
                  color="teal"
                  radius={0}
                  disabled={isReadOnly}
                  onChange={() => onChangeRolePermissionAction(collection, "*")}
                  checked={isPermissionChecked(collection, "*")}
                />
                <Checkbox
                  label="Read"
                  value={"read"}
                  color="teal"
                  radius={0}
                  disabled={isReadOnly}
                  onChange={() =>
                    onChangeRolePermissionAction(collection, "read")
                  }
                  checked={isPermissionChecked(collection, "read")}
                />
                <Checkbox
                  label="Create"
                  value={"create"}
                  color="teal"
                  radius={0}
                  disabled={isReadOnly}
                  onChange={() =>
                    onChangeRolePermissionAction(collection, "create")
                  }
                  checked={isPermissionChecked(collection, "create")}
                />
                <Checkbox
                  label="Update"
                  value={"update"}
                  color="teal"
                  disabled={isReadOnly}
                  radius={0}
                  onChange={() =>
                    onChangeRolePermissionAction(collection, "update")
                  }
                  checked={isPermissionChecked(collection, "update")}
                />
                <Checkbox
                  label="Delete"
                  value={"delete"}
                  color="teal"
                  disabled={isReadOnly}
                  radius={0}
                  onChange={() =>
                    onChangeRolePermissionAction(collection, "delete")
                  }
                  checked={isPermissionChecked(collection, "delete")}
                />
              </Flex>
            </div>
          ))}
        </div>
      ))}

      <Button type="submit">save</Button>
    </form>
  );
};

export default RolePermissionForm;
