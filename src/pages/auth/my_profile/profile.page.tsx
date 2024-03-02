import { Notify } from "@/_app/common/Notification/Notify";
import { getFileUrl } from "@/_app/common/utils/getFileUrl";
import { useServerFile } from "@/_app/hooks/use-upload-file";
import { FOLDER__NAME } from "@/_app/models/FolderName";
import { userAtom } from "@/_app/states/user.atom";
import { useMutation } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Flex,
  Image,
  Input,
  Paper,
  Space,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconArrowLeft, IconUpload } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  IProfileFormType,
  Profile__Form__Validation,
} from "./utils/form.validation";
import { UPDATE_PROFILE_MUTATION } from "./utils/query.gql";

const MyProfilePage = () => {
  const navigate = useNavigate();
  const [user] = useAtom(userAtom);
  const [profileLogo, setProfileLogo] = useState({
    path: null,
  });
  const { uploadFile, uploading } = useServerFile();

  // form initiated
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IProfileFormType>({
    resolver: yupResolver(Profile__Form__Validation),
  });

  // prefill form with previous values
  useEffect(() => {
    setValue("name", user?.name as string);
  }, [user]);

  // update mutation
  const [updateProfileInfo, { loading }] = useMutation(
    UPDATE_PROFILE_MUTATION,
    Notify({
      sucTitle: "Profile information updated.",
    })
  );

  // submit form with update mutation
  const onSubmit = (values: IProfileFormType) => {
    updateProfileInfo({
      variables: {
        input: {
          name: values?.name,
          email: user?.email,
          avatar: profileLogo,
        },
      },
    });
  };

  return (
    <div className="mx-auto my-10 lg:w-6/12">
      <Button
        onClick={
          window.history.state.idx ? () => navigate(-1) : () => navigate("/")
        }
        leftIcon={<IconArrowLeft />}
        variant="subtle"
      >
        Back
      </Button>
      <Space h={"lg"} />
      <Paper px={20} py={20} radius={10} withBorder>
        <Title order={3}>Profile Settings</Title>

        <Space h={20} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex align={"center"} gap={20}>
            <Dropzone
              onDrop={async (files) => {
                const res = await uploadFile({
                  files,
                  folder: FOLDER__NAME.USER__AVATAR,
                });
                if (res.data.length > 0) {
                  setProfileLogo(res.data[0]);
                }
              }}
              accept={IMAGE_MIME_TYPE}
              loading={uploading}
              maxSize={3 * 1024 ** 2}
              className="flex items-center justify-center group p-0 m-0 h-[100px] w-[100px] rounded-full"
            >
              {!profileLogo?.path && !user?.avatar?.path ? (
                <IconUpload
                  style={{
                    width: rem(52),
                    height: rem(52),
                  }}
                  stroke={1.5}
                />
              ) : (
                <div className="relative w-[100px] h-[100px]">
                  <Image
                    height="100px"
                    width="100px"
                    fit="cover"
                    className="rounded-full overflow-hidden"
                    src={
                      profileLogo?.path
                        ? getFileUrl(profileLogo)
                        : user?.avatar?.path
                        ? getFileUrl(user?.avatar)
                        : ""
                    }
                  />

                  <FaCamera
                    size={rem(55)}
                    color="white"
                    className="absolute shadow-xl opacity-0 group-hover:opacity-100"
                    style={{
                      transform: "translate(-50%, -50%)",
                      top: "50%",
                      left: "50%",
                      borderRadius: "5px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      transition: "all 0.5s ease-in-out",
                    }}
                  />
                </div>
              )}
            </Dropzone>

            <Text fw={500}>Profile Photo</Text>
          </Flex>

          <Space h={"sm"} />

          <Input.Wrapper
            label="Name"
            error={<ErrorMessage name="name" errors={errors} />}
          >
            <Input placeholder="Organization name" {...register("name")} />
          </Input.Wrapper>

          <Space h={"xs"} />

          <Input.Wrapper label="Email">
            <Input placeholder="Email" disabled value={user?.email as string} />
          </Input.Wrapper>

          {/* <Space h={'xs'} />

					<Input.Wrapper
						label='Description'
						error={<ErrorMessage name='description' errors={errors} />}
					>
						<Textarea placeholder='Description' {...register('description')} />
					</Input.Wrapper> */}

          <Space h={"sm"} />

          <Button type="submit" loading={loading}>
            Save
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default MyProfilePage;
