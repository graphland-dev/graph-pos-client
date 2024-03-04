import { Notify } from "@/_app/common/Notification/Notify";
import { Role, User } from "@/_app/graphql-models/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, MultiSelect } from "@mantine/core";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { CURRENT__TENANT__ROLES } from "../../roles/utils/query.gql";
import { IDENTITY_ADD_USER_TO_CURRENT_TENANT } from "../utils/query.gql";

interface IUserFormProps {
  onFormSubmitted: () => void;
  formData?: User;
  
}
const UserCreateForm: React.FC<IUserFormProps> = ({ onFormSubmitted }) => {
  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      roles: [],
    },
    resolver: yupResolver(formValidationSchema),
  });

  const { data: roleData, loading: roleLoading } = useQuery<{
    identity__currentTenantRoles: Role[];
  }>(CURRENT__TENANT__ROLES);
  console.log(roleData, roleLoading);
  const [createUser, { loading: creating }] = useMutation(
    IDENTITY_ADD_USER_TO_CURRENT_TENANT,
    Notify({
      sucTitle: "Supplier successfully created!",
      onSuccess() {
        reset();
        onFormSubmitted();
      },
    })
  );

  const onSubmit = (values: IUserForm) => {
    createUser({
      variables: {
        input: {
          roles: values.roles,
          email: values.email,
        },
      },
    });
  };

  return (
    <div>
      {" "}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input.Wrapper
          label="Email"
          error={<ErrorMessage name="email" errors={errors} />}
        >
          <Input placeholder="Write email" {...register("email")} />
        </Input.Wrapper>

        <Input.Wrapper
          label="Select Roles"
          withAsterisk
          error={<ErrorMessage name={"departmentId"} errors={errors} />}
        >
          <MultiSelect
            searchable
            clearable
            onChange={(roles) => {
              setValue("roles", roles || "", {
                shouldValidate: true,
              });
            }}
            placeholder="Select Role"
            data={
              roleData?.identity__currentTenantRoles.map((role) => role.name) ||
              []
            }
            value={watch("roles")}
          />
        </Input.Wrapper>

        <Button type="submit" loading={creating} fullWidth>
          Save
        </Button>
      </form>
    </div>
  );
};

export default UserCreateForm;

export const formValidationSchema = Yup.object().shape({
  email: Yup.string().email().required().label("Email"),
  roles: Yup.array().of(Yup.string().required("At least one Role is required")),
});

interface IUserForm {
  email: string;
  roles?: string[];
}
