import {
  EmployeeDepartment,
  MatchOperator,
  User_Gender,
} from "@/_app/graphql-models/graphql";
import { IReligion } from "@/_app/models/religion.model";
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
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  PEOPLE_EMPLOYEES_CREATE_MUTATION,
  PEOPLE_EMPLOYEES_UPDATE_MUTATION,
} from "../utils/query";

interface IEmployeesFormProps {
  onSubmissionDone: () => void;
  operationType: "create" | "update" | "View";
  operationId?: string | null;
  formData?: any;
  departments: EmployeeDepartment[];
}

const EmployeesForm: React.FC<IEmployeesFormProps> = ({
  onSubmissionDone,
  operationType,
  operationId,
  formData,
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
      startingSalary: "0.0",
      religion: "",
      gender: "",
      designation: "",
      contactNumber: "",
      isActive: false,
      docs: "",
      bloodGroup: "",
      joiningDate: new Date().toISOString(),
      dateOfBirth: new Date().toISOString(),
      appointmentDate: new Date().toISOString(),
    },
  });

  useEffect(() => {
    setValue("departmentId", formData?.department?._id);
    setValue("name", formData?.name);
    setValue("docs", formData?.docs);
    setValue("address", formData?.address);
    setValue("startingSalary", formData?.startingSalary);
    setValue("salary", formData?.salary);
    setValue("designation", formData?.designation);
    setValue("contactNumber", formData?.contactNumber);
    setValue("gender", formData?.gender);
    setValue(
      "joiningDate",
      formData?.["joiningDate"] || new Date().toISOString()
    );
    setValue(
      "dateOfBirth",
      formData?.["dateOfBirth"] || new Date().toISOString()
    );
    setValue(
      "appointmentDate",
      formData?.["appointmentDate"] || new Date().toISOString()
    );
    setValue("bloodGroup", formData?.bloodGroup);
    setValue("religion", formData?.religion);
    setValue("isActive", formData?.isActive);

    console.log(formData);
  }, [formData]);

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
          body: { ...data, startingSalary: parseFloat(data.startingSalary) },
        },
        onCompleted: (res) => {
          console.log(res);
          onSubmissionDone();
        },
        onError: (err) => console.log(err),
      });
    }

    if (operationType === "update") {
      const updateData = {
        departmentId: data.departmentId,
        designation: data.designation,
        bloodGroup: data.bloodGroup,
        address: data.address,
        appointmentDate: data.appointmentDate,
        contactNumber: data.contactNumber,
        docs: data.docs,
        gender: data.gender,
        isActive: data.isActive,
        joiningDate: data.joiningDate,
        name: data.name,
        religion: data.religion,
        startingSalary: parseFloat(data.startingSalary),
      };
      peopleEmployeeUpdateMutation({
        variables: {
          where: {
            key: "_id",
            operator: MatchOperator.Eq,
            value: operationId,
          },
          body: updateData,
        },
        onCompleted: (res) => {
          console.log(res);
          onSubmissionDone();
        },
        onError: (err) => console.log(err),
      });
    }
  };
  console.log(watch("departmentId"));
  return (
    <div>
      <Title order={4}>
        <span className="capitalize">{operationType}</span> a Employee
      </Title>
      <Space h={"lg"} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid gap-3 lg:grid-cols-2">
          <Input.Wrapper
            label="Name"
            withAsterisk
            error={<ErrorMessage name={"name"} errors={errors} />}
          >
            <Input placeholder="Name" {...register("name")} />
          </Input.Wrapper>

          <Input.Wrapper
            label="Contact Number"
            error={<ErrorMessage name={"contactNumber"} errors={errors} />}
          >
            <Input
              placeholder="Contact Number"
              {...register("contactNumber")}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Gender"
            withAsterisk
            error={<ErrorMessage name={"gender"} errors={errors} />}
          >
            <Select
              value={watch("gender")}
              onChange={(gender) =>
                setValue("gender", gender || "", { shouldValidate: true })
              }
              data={[
                {
                  label: "Female",
                  value: User_Gender.Female,
                },
                {
                  label: "Male",
                  value: User_Gender.Male,
                },
                {
                  label: "NonBinary",
                  value: User_Gender.NonBinary,
                },
                {
                  label: "Other",
                  value: User_Gender.Other,
                },
                {
                  label: "PreferNotToSay",
                  value: User_Gender.PreferNotToSay,
                },
              ]}
            />
          </Input.Wrapper>
          <Input.Wrapper
            label="Religion"
            error={<ErrorMessage name={"religion"} errors={errors} />}
          >
            <Select
              value={watch("religion")}
              onChange={(religion) =>
                setValue("religion", religion || "", { shouldValidate: true })
              }
              data={[
                {
                  label: "ISLAM",
                  value: IReligion.ISLAM,
                },
                {
                  label: "BUDDHISM",
                  value: IReligion.BUDDHISM,
                },
                {
                  label: "CHRISTIANITY",
                  value: IReligion.CHRISTIANITY,
                },
                {
                  label: "JUDAISM",
                  value: IReligion.JUDAISM,
                },
              ]}
            />
          </Input.Wrapper>
        </div>
        <Textarea
          label="Address"
          {...register("address")}
          placeholder="Write your Address"
        />

        <div className="grid gap-3 lg:grid-cols-2">
          <Input.Wrapper
            label="Designation"
            error={<ErrorMessage name={"designation"} errors={errors} />}
          >
            <Input placeholder="Designation" {...register("designation")} />
          </Input.Wrapper>

          <Input.Wrapper
            label="Department"
            withAsterisk
            error={<ErrorMessage name={"departmentId"} errors={errors} />}
          >
            <Select
              searchable
              onChange={(departmentId) =>
                setValue("departmentId", departmentId || "", {
                  shouldValidate: true,
                })
              }
              placeholder="Select Department"
              data={employeeDepartmentForDrop || []}
              value={watch("departmentId")}
            />
          </Input.Wrapper>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <Input.Wrapper
            label="Blood Group"
            error={<ErrorMessage name={"bloodGroup"} errors={errors} />}
          >
            <Input placeholder="Blood Group" {...register("bloodGroup")} />
          </Input.Wrapper>

          <DateTimePicker
            className="w-full"
            valueFormat="DD MMM YYYY"
            value={new Date(watch("dateOfBirth"))}
            onChange={(e) => {
              const dateTimeValue =
                e?.toISOString() || new Date().toISOString();
              setValue("dateOfBirth", dateTimeValue);
            }}
            label="Date Of Birth"
            placeholder="Select your date and time"
            mx="auto"
          />
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <Input.Wrapper
            label="Starting Salary"
            withAsterisk
            error={<ErrorMessage name={"startingSalary"} errors={errors} />}
          >
            <Input
              placeholder="Salary"
              type="number"
              disabled={operationType === "update"}
              {...register("startingSalary", { valueAsNumber: true })}
            />
          </Input.Wrapper>

          <Input.Wrapper label="Salary">
            <Input
              defaultValue={watch("salary") || 0}
              placeholder="Salary"
              {...register("salary")}
              disabled
            />
          </Input.Wrapper>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <DateTimePicker
            withAsterisk
            className="w-full"
            valueFormat="DD MMM YYYY hh:mm A"
            value={new Date(watch("appointmentDate"))}
            onChange={(e) => {
              const dateTimeValue =
                e?.toISOString() || new Date().toISOString();
              setValue("appointmentDate", dateTimeValue);
            }}
            label="Appointment Date"
            placeholder="Select your date and time"
            mx="auto"
          />
          <DateTimePicker
            withAsterisk
            className="w-full"
            valueFormat="DD MMM YYYY hh:mm A"
            value={new Date(watch("joiningDate"))}
            onChange={(e) => {
              const dateTimeValue =
                e?.toISOString() || new Date().toISOString();
              setValue("joiningDate", dateTimeValue);
            }}
            label="Joining Date"
            placeholder="Select your date and time"
            mx="auto"
          />
        </div>
        <Switch
          checked={watch("isActive")}
          onChange={(event) => {
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
  address: yup.string().optional().nullable().label("Address"),
  bloodGroup: yup.string().optional().nullable().label("blood group"),
  contactNumber: yup.string().optional().nullable().label("contact number"),
  designation: yup.string().optional().nullable().label(" Designation"),
  docs: yup.string().optional().nullable().label("Docs"),
  gender: yup.string().required().label("Gender"),
  isActive: yup.boolean().optional().label("Status"),
  religion: yup.string().optional().nullable().label(" Religion"),
  startingSalary: yup.string().required().label("starting salary"),
  salary: yup.number().optional().nullable().label("salary"),
  joiningDate: yup.string().required().label("join Date"),
  dateOfBirth: yup.string().required().label("join Date"),
  appointmentDate: yup.string().required().label("appointment date"),
});
