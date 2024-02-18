const OrganizationOverviewPage: React.FC = () => {
  // const params = useParams<{ tenant: string }>();
  // const [tenants] = useAtom(userTenantsAtom);
  // const tenant = tenants?.find((t) => t.uid === params.tenant);

  // const { uploadFile, uploading } = useServerFile();
  // const [organizationLogo, setOrganizationLogo] = useState({});
  // console.log(organizationLogo);

  // // form initiated
  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors, isDirty },
  //   setValue,
  // } = useForm<IOrganizationFormType>({
  //   resolver: yupResolver(ORGANIZATION_OVERVIEW_FORM_VALIDATION_SCHEMA),
  // });

  // // prefill form with previous values
  // useEffect(() => {
  //   setValue("name", tenant?.name || "");
  //   setValue("address", tenant?.address);
  //   setValue("businessPhoneNumber", tenant?.businessPhoneNumber);
  //   setValue("description", tenant?.description);
  // }, [tenant]);

  // // update mutation
  // const [updateOrganizationInfo, { loading }] = useMutation(
  //   ORGANIZATION_OVERVIEW_INFO_UPDATE_MUTATION,
  //   Notify({
  //     sucTitle: "Organization information updated.",
  //   })
  // );

  // // submit form with update mutation
  // const onSubmit = (values: IOrganizationFormType) => {
  //   updateOrganizationInfo({
  //     variables: { input: values },
  //   });
  // };

  // return (
  //   <div>
  //     <Paper px={20} py={20} radius={10} className="lg:w-8/12">
  //       <Title order={3}>Organization overview</Title>

  //       <Space h={20} />

  //       <form onSubmit={handleSubmit(onSubmit)}>
  //         <Flex align={"center"} gap={20}>
  //           <Dropzone
  //             onDrop={async (files) => {
  //               await uploadFile({
  //                 files,
  //                 folder: "organization",
  //               }).then((res) => {
  //                 res?.data?.length > 0 && setOrganizationLogo(res.data[0]);
  //               });
  //               // result === true && onChange(files[0]);
  //             }}
  //             loading={uploading}
  //             maxSize={3 * 1024 ** 2}
  //             className={clsx(
  //               "flex items-center justify-center group p-0 m-0 h-[200px] w-[200px] rounded-full",
  //               {
  //                 " h-[100px] w-[100px] ": isLogo,
  //               }
  //             )}
  //           >
  //             {!file?.path ? (
  //               <IconPhoto
  //                 style={{
  //                   width: rem(isLogo ? 33 : 52),
  //                   height: rem(isLogo ? 33 : 52),
  //                   color: "var(--mantine-color-blue-6)",
  //                 }}
  //                 stroke={1.5}
  //               />
  //             ) : (
  //               <div className="relative">
  //                 <Image
  //                   className={clsx(
  //                     "w-[200px] h-[200px] rounded-full object-cover",
  //                     {
  //                       " h-[100px] w-[100px] ": isLogo,
  //                     }
  //                   )}
  //                   src={getFileUrl(file)}
  //                 />

  //                 <FaCamera
  //                   size={isLogo ? 33 : 55}
  //                   color="white"
  //                   className="absolute shadow-xl opacity-0 group-hover:opacity-100"
  //                   style={{
  //                     transform: "translate(-50%, -50%)",
  //                     top: "50%",
  //                     left: "50%",
  //                     borderRadius: "5px",
  //                     fontSize: "12px",
  //                     fontWeight: "bold",
  //                     transition: "all 0.5s ease-in-out",
  //                   }}
  //                 />
  //               </div>
  //             )}
  //           </Dropzone>
  //           {/*
  //           <Dropzone
  //             onDrop={async (files) => {
  //               const result = await useServerFile({
  //                 file: files[0],
  //                 folder,
  //               });
  //               onChange(result.data);
  //             }}
  //             loading={uploading}
  //             maxSize={3 * 1024 ** 2}
  //             className={clsx(
  //               "flex items-center justify-center group p-0 m-0 h-[200px] w-[200px] rounded-full",
  //               {
  //                 " h-[100px] w-[100px] ": isLogo,
  //               }
  //             )}
  //           >
  //             {!file?.path ? (
  //               <IconPhoto
  //                 style={{
  //                   width: rem(isLogo ? 33 : 52),
  //                   height: rem(isLogo ? 33 : 52),
  //                   color: "var(--mantine-color-blue-6)",
  //                 }}
  //                 stroke={1.5}
  //               />
  //             ) : (
  //               <div className="relative">
  //                 <Image
  //                   className={clsx(
  //                     "w-[200px] h-[200px] rounded-full object-cover",
  //                     {
  //                       " h-[100px] w-[100px] ": isLogo,
  //                     }
  //                   )}
  //                   src={getFileUrl(file)}
  //                 />

  //                 <FaCamera
  //                   size={isLogo ? 33 : 55}
  //                   color="white"
  //                   className="absolute shadow-xl opacity-0 group-hover:opacity-100"
  //                   style={{
  //                     transform: "translate(-50%, -50%)",
  //                     top: "50%",
  //                     left: "50%",
  //                     borderRadius: "5px",
  //                     fontSize: "12px",
  //                     fontWeight: "bold",
  //                     transition: "all 0.5s ease-in-out",
  //                   }}
  //                 />
  //               </div>
  //             )}
  //           </Dropzone> */}

  //           <Text fw={500}>Organization Logo</Text>
  //         </Flex>

  //         <Space h={"sm"} />

  //         <Input.Wrapper
  //           label="Name"
  //           error={<ErrorMessage name="name" errors={errors} />}
  //         >
  //           <Input placeholder="Organization name" {...register("name")} />
  //         </Input.Wrapper>

  //         <Space h={"xs"} />

  //         <Input.Wrapper label="Organization Uid">
  //           <Input
  //             placeholder="Organization uid"
  //             disabled
  //             value={tenant?.uid as string}
  //           />
  //         </Input.Wrapper>

  //         <Space h={"xs"} />

  //         <Input.Wrapper
  //           label="Business phone number"
  //           error={<ErrorMessage name="businessPhoneNumber" errors={errors} />}
  //         >
  //           <Input
  //             placeholder="Business phone number"
  //             {...register("businessPhoneNumber")}
  //           />
  //         </Input.Wrapper>

  //         <Space h={"xs"} />

  //         <Input.Wrapper
  //           label="Address"
  //           error={<ErrorMessage name="address" errors={errors} />}
  //         >
  //           <Input placeholder="Address" {...register("address")} />
  //         </Input.Wrapper>

  //         <Space h={"xs"} />

  //         <Input.Wrapper
  //           label="Description"
  //           error={<ErrorMessage name="description" errors={errors} />}
  //         >
  //           <Textarea placeholder="Description" {...register("description")} />
  //         </Input.Wrapper>

  //         <Space h={"sm"} />

  //         <Button type="submit" loading={loading} disabled={!isDirty}>
  //           Save
  //         </Button>
  //       </form>
  //     </Paper>
  //   </div>
  // );

  return <h1>Org Details</h1>;
};

export default OrganizationOverviewPage;
