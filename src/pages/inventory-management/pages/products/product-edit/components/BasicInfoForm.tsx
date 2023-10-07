import { Notify } from '@/_app/common/Notification/Notify';
import { MatchOperator, Product } from '@/_app/graphql-models/graphql';
import { useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Input, Space, Textarea } from '@mantine/core';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import * as Yup from 'yup';
import {
	INVENTORY_PRODUCT_BASIC_INFO_QUERY,
	INVENTORY_PRODUCT_UPDATE,
} from '../utils/productEdit.query';

const BasicInfoForm = () => {
	const { productId } = useParams();
	const {
		register,
		setValue,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: '',
			code: '',
			modelName: '',
			note: '',
		},

		resolver: yupResolver(BASIC_FORM_SCHEMA),
	});

	const { data: basicInfo, refetch } = useQuery<{
		inventory__product: Product;
	}>(INVENTORY_PRODUCT_BASIC_INFO_QUERY, {
		variables: {
			where: {
				key: '_id',
				operator: MatchOperator.Eq,
				value: productId,
			},
		},
	});

	const [saveForm, { loading: savingInfo }] = useMutation(
		INVENTORY_PRODUCT_UPDATE,
		Notify({
			sucTitle: 'Basic information saved!',
			onSuccess() {
				refetch();
			},
		})
	);

	useEffect(() => {
		setValue('name', basicInfo?.inventory__product?.name as string);
		setValue('code', basicInfo?.inventory__product?.code as string);
		setValue('modelName', basicInfo?.inventory__product?.modelName as string);
		setValue('note', basicInfo?.inventory__product?.note as string);
	}, [basicInfo]);

	const onSubmit = (value: IBasicInfoFormState) => {
		saveForm({
			variables: {
				where: {
					key: '',
					operator: 'eq',
					value: '',
				},
				body: value,
			},
		});
	};

	return (
		<div>
			<form onSubmit={handleSubmit(onSubmit)} className='lg:w-8/12'>
				<Input.Wrapper
					label='Name'
					error={<ErrorMessage errors={errors} name='name' />}
				>
					<Input placeholder='Write product name' {...register('name')} />
				</Input.Wrapper>
				<Space h={'sm'} />
				<Input.Wrapper
					label='Code'
					error={<ErrorMessage errors={errors} name='code' />}
				>
					<Input placeholder='Write product code' {...register('code')} />
				</Input.Wrapper>
				<Space h={'sm'} />
				<Input.Wrapper
					label='Model'
					error={<ErrorMessage errors={errors} name='modelName' />}
				>
					<Input placeholder='Write product model' {...register('modelName')} />
				</Input.Wrapper>
				<Space h={'sm'} />
				<Input.Wrapper
					label='Note'
					error={<ErrorMessage errors={errors} name='note' />}
				>
					<Textarea placeholder='Write product note' {...register('note')} />
				</Input.Wrapper>
				<Space h={'sm'} />

				<Button type='submit' loading={savingInfo}>
					Save
				</Button>
			</form>
		</div>
	);
};

export default BasicInfoForm;

const BASIC_FORM_SCHEMA = Yup.object().shape({
	name: Yup.string().required().label('Name'),
	code: Yup.string().optional().nullable().label('Code'),
	modelName: Yup.string().optional().nullable().label('Model name'),
	note: Yup.string().optional().nullable().label('Note'),
});

export interface IBasicInfoFormState
	extends Yup.Asserts<typeof BASIC_FORM_SCHEMA> {}
