import * as Yup from 'yup';

export const Profile__Form__Validation = Yup.object().shape({
	name: Yup.string().required().label('Name'),
	// description: Yup.string().optional().nullable().label('Description'),
});

export type IProfileFormType = Yup.InferType<typeof Profile__Form__Validation>;

export const Password__update__Form__Validation = Yup.object().shape({
  password: Yup.string().required().label("Current Password"),
  newPassword: Yup.string().required().label("New Password"),
  confirmNewPassword: Yup.string().required().label("Confirm New Password"),
});

export type IPasswordUpdateFormType = Yup.InferType<
  typeof Password__update__Form__Validation
>;
