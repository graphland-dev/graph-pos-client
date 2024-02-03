// { collectionName: 'accounting__Account', actions: ['*'] },
//         { collectionName: 'accounting__Expense', actions: ['*'] },
//         { collectionName: 'accounting__ExpenseCategory', actions: ['*'] },
//         { collectionName: 'accounting__Payroll', actions: ['*'] },
//         { collectionName: 'accounting__Transaction', actions: ['*'] },
//         { collectionName: 'accounting__Transfer', actions: ['*'] },

import { Checkbox, Flex } from "@mantine/core";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const appCollectionPermissions = [
  {
    name: "Accounting",
    collections: [
      "accounting__Account",
      "accounting__Expense",
      "accounting__ExpenseCategory",
      "accounting__Payroll",
      "accounting__Transaction",
      "accounting__Transfer",
    ],
  },
  {
    name: "People",
    collections: [
      "people__Client",
      "people__Employee",
      "people__EmployeeDepartment",
      "people__EmployeeIncrement",
      "people__Supplier",
    ],
  },
];

interface IFormPayload {
  roles: {
    name: string;
    permissions: {
      collection: string;
      actions: string[];
    }[];
  }[];
}

const TestPage = () => {
  const { control, setValue, watch } = useForm<IFormPayload>({
    defaultValues: {
      roles: [],
    },
  });

  const { fields } = useFieldArray({
    name: "roles",
    control,
  });

  useEffect(() => {
    setValue("roles", [
      {
        name: "admin",
        permissions: [
          {
            collection: "accounting__Account",
            actions: ["*", "update"],
          },
          {
            collection: "accounting__Expense",
            actions: ["*"],
          },
          {
            collection: "accounting__ExpenseCategory",
            actions: ["*"],
          },
          {
            collection: "accounting__Payroll",
            actions: ["*", "delete"],
          },
          {
            collection: "accounting__Transaction",
            actions: ["*", "create"],
          },
          {
            collection: "accounting__Transfer",
            actions: ["*"],
          },
        ],
      },
      {
        name: "user",
        permissions: [
          {
            collection: "accounting__Account",
            actions: ["*"],
          },
          {
            collection: "accounting__Expense",
            actions: ["*"],
          },
          {
            collection: "accounting__ExpenseCategory",
            actions: ["*"],
          },
          {
            collection: "accounting__Payroll",
            actions: ["*"],
          },
          {
            collection: "accounting__Transaction",
            actions: ["*"],
          },
          {
            collection: "accounting__Transfer",
            actions: ["*"],
          },
        ],
      },
    ]);
  }, []);

  const handlePermissionChange = (
    roleIndex: number,
    collection: string,
    checked: boolean,
    actionName: string
  ) => {
    const rolePermissions = watch(`roles.${roleIndex}.permissions`);
    const collectionIndex = rolePermissions.findIndex(
      (permission) => permission.collection === collection
    );
    if (checked) {
      setValue(
        `roles.${roleIndex}.permissions`,
        rolePermissions.map((permission, index) => {
          if (index === collectionIndex) {
            return {
              ...permission,
              actions: [...permission.actions, actionName],
            };
          }
          return permission;
        })
      );
    } else {
      setValue(
        `roles.${roleIndex}.permissions`,
        rolePermissions.map((permission, index) => {
          if (index === collectionIndex) {
            return {
              ...permission,
              actions: [],
            };
          }
          return permission;
        })
      );
    }
  };

  return (
    <div>
      {fields.map((role, roleIndex) => (
        <div className="m-5 mt-5 border border-slate-400">
          <p className="bg-green-500 ">{role.name}</p>
          <div>
            {appCollectionPermissions.map((collection) => (
              <div className="mt-5 ">
                <p>{collection.name}</p>
                {collection.collections.map((collectionName) => (
                  <div>
                    {collectionName}
                    <Flex>
                      <Checkbox
                        label="*"
                        value={"*"}
                        onChange={(e) => {
                          handlePermissionChange(
                            roleIndex,
                            collectionName,
                            e.target.checked,
                            "*"
                          );
                        }}
                      />
                      <Checkbox
                        label="Read"
                        value={"read"}
                        checked={watch(`roles.${roleIndex}.permissions`)
                          .find(
                            (permission) =>
                              permission.collection === collectionName
                          )
                          ?.actions.includes("read")}
                        onChange={(e) => {
                          handlePermissionChange(
                            roleIndex,
                            collectionName,
                            e.target.checked,
                            "read"
                          );
                        }}
                      />
                      <Checkbox
                        label="Create"
                        value={"create"}
                        checked={watch(`roles.${roleIndex}.permissions`)
                          .find(
                            (permission) =>
                              permission.collection === collectionName
                          )
                          ?.actions.includes("create")}
                        onChange={(e) => {
                          handlePermissionChange(
                            roleIndex,
                            collectionName,
                            e.target.checked,
                            "create"
                          );
                        }}
                      />
                      <Checkbox
                        label="Update"
                        value={"update"}
                        checked={watch(`roles.${roleIndex}.permissions`)
                          .find(
                            (permission) =>
                              permission.collection === collectionName
                          )
                          ?.actions.includes("update")}
                        onChange={(e) => {
                          handlePermissionChange(
                            roleIndex,
                            collectionName,
                            e.target.checked,
                            "update"
                          );
                        }}
                      />
                      <Checkbox
                        label="Delete"
                        value={"delete"}
                        checked={watch(`roles.${roleIndex}.permissions`)
                          .find(
                            (permission) =>
                              permission.collection === collectionName
                          )
                          ?.actions.includes("delete")}
                        onChange={(e) => {
                          handlePermissionChange(
                            roleIndex,
                            collectionName,
                            e.target.checked,
                            "delete"
                          );
                        }}
                      />
                    </Flex>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestPage;
