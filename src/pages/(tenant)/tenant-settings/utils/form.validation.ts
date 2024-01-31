import * as Yup from 'yup';

export const ORGANIZATION_OVERVIEW_FORM_VALIDATION_SCHEMA = Yup.object().shape({
	name: Yup.string().required().label('Name'),
	address: Yup.string().optional().nullable().label('Address'),
	description: Yup.string().optional().nullable().label('Description'),
	businessPhoneNumber: Yup.string().optional().nullable().label('Phone number'),
});

export type IOrganizationFormType = Yup.InferType<
	typeof ORGANIZATION_OVERVIEW_FORM_VALIDATION_SCHEMA
>;
