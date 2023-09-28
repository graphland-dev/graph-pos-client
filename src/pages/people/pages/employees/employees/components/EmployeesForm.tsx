import {
  EmployeeDepartment,
  MatchOperator,
} from "@/_app/graphql-models/graphql";
import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Input,
  Select,
  Space,
  Switch,
  Textarea,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  PEOPLE_EMPLOYEES_CREATE_MUTATION,
  PEOPLE_EMPLOYEES_UPDATE_MUTATION,
} from "../utils/query";

interface IEmployeesFormProps {
  onSubmissionDone: () => void;
  operationType: "create" | "update";
  operationId?: string | null;
  formData?: any;
  departments: EmployeeDepartment[];
}

const EmployeesForm: React.FC<IEmployeesFormProps> = ({
  onSubmissionDone,
  operationType,
  operationId,

  departments,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      departmentId: "",
      name: "",
      address: "",
      salary: 0.0,
      religion: "",
      gender: "",
      designation: "",
      contactNumber: 0,
      isActive: false,
      docs: "",
      bloodGroup: "",
      joiningDate: new Date().toISOString(),
      appointmentDate: new Date().toISOString(),
    },
  });

  const employeeDepartmentForDrop = departments?.map((item) => ({
    value: item?._id,
    label: `${item?.name}`,
  }));

  const [peopleEmployeeCreateMutation, { loading: employeeCreateLoading }] =
    useMutation(PEOPLE_EMPLOYEES_CREATE_MUTATION);

  const [peopleEmployeeUpdateMutation, { loading: employeeUpdateLoading }] =
    useMutation(PEOPLE_EMPLOYEES_UPDATE_MUTATION);

  const onSubmit = (data: any) => {
    if (operationType === "create") {
      peopleEmployeeCreateMutation({
        variables: {
          body: data,
        },
        onCompleted: (res) => {
          console.log(res);
          onSubmissionDone();
        },
        onError: (err) => console.log(err),
      });
    }

    if (operationType === "update") {
      peopleEmployeeUpdateMutation({
        variables: {
          where: {
            key: "_id",
            operator: MatchOperator.Eq,
            value: operationId,
          },
          body: data,
        },
        onCompleted: (res) => {
          console.log(res);
          onSubmissionDone();
        },
        onError: (err) => console.log(err),
      });
    }
  };

  return (
    <div>
      <Title order={4}>
        <span className="capitalize">{operationType}</span> a Balance Transfer
      </Title>
      <Space h={"lg"} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input.Wrapper
          label="name"
          withAsterisk
          error={<ErrorMessage name={"name"} errors={errors} />}
        >
          <Input placeholder="Name" {...register("name")} />
        </Input.Wrapper>
        <Input.Wrapper
          label="Address"
          withAsterisk
          error={<ErrorMessage name={"address"} errors={errors} />}
        >
          <Input placeholder="Address" {...register("address")} />
        </Input.Wrapper>
        <Input.Wrapper
          label="Contact Number"
          withAsterisk
          error={<ErrorMessage name={"contactNumber"} errors={errors} />}
        >
          <Input placeholder="Contact Number" {...register("contactNumber")} />
        </Input.Wrapper>
        <Select
          searchable
          withAsterisk
          onChange={(departmentId) =>
            setValue("departmentId", departmentId || "")
          }
          label="Department Id"
          placeholder="From Account"
          data={employeeDepartmentForDrop || []}
          value={watch("departmentId")}
        />

        <Textarea
          label="Doc"
          {...register("docs")}
          placeholder="Write your docs"
        />
        <Input.Wrapper
          label="Blood Group"
          withAsterisk
          error={<ErrorMessage name={"bloodGroup"} errors={errors} />}
        >
          <Input placeholder="Blood Group" {...register("bloodGroup")} />
        </Input.Wrapper>
        <Input.Wrapper
          label="designation"
          withAsterisk
          error={<ErrorMessage name={"designation"} errors={errors} />}
        >
          <Input placeholder="designation" {...register("designation")} />
        </Input.Wrapper>
        <Input.Wrapper
          label="Religion"
          withAsterisk
          error={<ErrorMessage name={"religion"} errors={errors} />}
        >
          <Input placeholder="Religion" {...register("religion")} />
        </Input.Wrapper>
        <Input.Wrapper
          label="Salary"
          withAsterisk
          error={<ErrorMessage name={"salary"} errors={errors} />}
        >
          <Input placeholder="Salary" {...register("salary")} />
        </Input.Wrapper>

        <DateTimePicker
          withAsterisk
          className="w-full"
          valueFormat="DD MMM YYYY hh:mm A"
          value={new Date(watch("appointmentDate"))}
          onChange={(e) => {
            const dateTimeValue = e?.toISOString() || new Date().toISOString();
            setValue("appointmentDate", dateTimeValue);
          }}
          label="Date & Time"
          placeholder="Select your date and time"
          mx="auto"
        />
        <DateTimePicker
          withAsterisk
          className="w-full"
          valueFormat="DD MMM YYYY hh:mm A"
          value={new Date(watch("joiningDate"))}
          onChange={(e) => {
            const dateTimeValue = e?.toISOString() || new Date().toISOString();
            setValue("joiningDate", dateTimeValue);
          }}
          label="Date & Time"
          placeholder="Select your date and time"
          mx="auto"
        />
        <Switch
          checked={watch("isActive")}
          onChange={(event) => {
            console.log(event.currentTarget.checked);

            setValue("isActive", event.currentTarget.checked);
          }}
          label="Is active"
          size="lg"
          onLabel="True"
          offLabel="False"
        />

        <Button
          loading={employeeUpdateLoading || employeeCreateLoading}
          type="submit"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default EmployeesForm;

const validationSchema = yup.object({
  departmentId: yup.string().required().label("Department Name"),
  name: yup.string().required().label("Name"),
  address: yup.string().required().label("Available Balance"),
  bloodGroup: yup.string().optional().label("Available Balance"),
  contactNumber: yup.number().optional().label("Available Balance"),
  designation: yup.string().optional().label("Available Balance"),
  docs: yup.string().optional().label("Available Balance"),
  gender: yup.string().optional().label("Please select your gender"),
  isActive: yup.boolean().optional().label("Available Balance"),
  religion: yup.string().optional().label("Available Balance"),
  salary: yup.number().optional().label("Available Balance"),
  joiningDate: yup.string().required().label("Available Balance"),
  appointmentDate: yup.string().required().label("Opening Data"),
});
