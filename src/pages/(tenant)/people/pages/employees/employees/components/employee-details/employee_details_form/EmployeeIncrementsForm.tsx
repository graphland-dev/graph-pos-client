import { Notify } from '@/_app/common/Notification/Notify';
import { useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Space, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { CREATE_INCREMENT_MUTATION_QUERY } from '../../../../increments/utils/increment.query';

interface IIncrementDetailsFormProps {
  employeeId: string | undefined;
  onFormSubmitted: () => void;
}

interface IIncrements {
  amount: number;
  date: Date;
  note: string;
}

const EmployeeIncrementsForm: React.FC<IIncrementDetailsFormProps> = ({
  employeeId,
  onFormSubmitted,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      amount: 1000,
      note: '',
      date: new Date(),
    },
    resolver: yupResolver(formValidationSchema),
  });

  const [createIncrement, { loading: creating }] = useMutation(
    CREATE_INCREMENT_MUTATION_QUERY,
    Notify({
      successTitle: 'Increment done!',
      onSuccess() {
        onFormSubmitted();
      },
    }),
  );

  const onSubmit = (values: IIncrements) => {
    createIncrement({
      variables: {
        body: {
          amount: values.amount,
          employeeId: employeeId,
          note: values.note,
          date: values.date,
        },
      },
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input.Wrapper
          label="Amount"
          withAsterisk
          error={<ErrorMessage errors={errors} name="amount" />}
        >
          <Input
            type="number"
            placeholder="Write amount"
            {...register('amount')}
          />
        </Input.Wrapper>

        <Space h={'sm'} />

        <Input.Wrapper
          label="Date"
          withAsterisk
          error={<ErrorMessage errors={errors} name="date" />}
        >
          <DateInput
            placeholder="Pick a date"
            defaultValue={watch('date')}
            onChange={(d) => setValue('date', d!)}
          />
        </Input.Wrapper>

        <Space h={'sm'} />

        <Input.Wrapper
          label="Note"
          withAsterisk
          error={<ErrorMessage errors={errors} name="note" />}
        >
          <Textarea placeholder="Write a note..." {...register('note')} />
        </Input.Wrapper>

        <Space h={'sm'} />

        <Button type="submit" loading={creating} fullWidth>
          Save
        </Button>
      </form>
    </div>
  );
};

export default EmployeeIncrementsForm;

export const formValidationSchema = Yup.object().shape({
  amount: Yup.number().required().label('Amount'),
  date: Yup.date().required().label('Date'),
  note: Yup.string().required().label('Note'),
});
