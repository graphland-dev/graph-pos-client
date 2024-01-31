import * as Yup from 'yup';

export const Profile__Form__Validation = Yup.object().shape({
	name: Yup.string().required().label('Name'),
	// description: Yup.string().optional().nullable().label('Description'),
});

export type IProfileFormType = Yup.InferType<typeof Profile__Form__Validation>;
