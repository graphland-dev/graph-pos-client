import { commonNotifierCallback } from "@/commons/components/Notification/commonNotifierCallback.ts";
import { AccountsWithPagination, ProductDiscountMode, ProductInvoice, Purchase_Invoice_Status } from "@/commons/graphql-models/graphql";
import { ACCOUNTING_ACCOUNTS_LIST } from "@/pages/(tenant)/accounting/pages/cashbook/accounts/utils/query";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Input, NumberInput, Paper, Select, Space } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import React, { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { IPosFormType } from "../../pos.page";
import { Create_Invoice_Payment, Create_Product_Invoice, INVENTORY_INVOICE } from "../../utils/query.payment";
import { Update_Invoice_Status } from "../../utils/query.pos";
import { Payment_Form_Validation } from "../../utils/validations/paymentForm.validation";

interface ExtendedFormData extends IPosFormType {
	subTotal: number;
	netTotal: number;

	discountAmount: number;
	discountPercentage: number;
}

interface IPaymentFormProps {
	formData: ExtendedFormData;
	onSuccess: () => void;
	onRefetchHoldList: () => void;
	preMadeInvoiceId?: string;
}

const PaymentForm: React.FC<IPaymentFormProps> = ({ formData, onSuccess, preMadeInvoiceId, onRefetchHoldList }) => {
	const [productInvoice, setProductInvoice] = useState<{ inventory__productInvoice: ProductInvoice } | null>(null);
	// accounts API
	const { data } = useQuery<{
		accounting__accounts: AccountsWithPagination;
	}>(ACCOUNTING_ACCOUNTS_LIST, {
		variables: {
			where: {
				limit: -1,
				page: 1,
			},
		},
	});

	const [getInvoiceData, { data: invoiceDetails }] = useLazyQuery<{ inventory__productInvoice: ProductInvoice }>(INVENTORY_INVOICE, {
		onCompleted: (data) => {
			// console.log(data);
			// setProductInvoice(data);
			handlePrint();
			onSuccess();
			reset({
				date: new Date(),
				paymentTerm: "",
				poReference: "",
				receiptNo: "",
				reference: "",
				payments: [],
			});
		},
	});

	// accounts data dropdown
	const accountListForDrop = data?.accounting__accounts?.nodes?.map((item) => ({
		value: item?._id,
		label: `${item?.name} [${item?.referenceNumber}]`,
	}));

	// payment form
	const {
		handleSubmit,
		setValue,
		formState: { errors },
		control,
		register,
		watch,
		reset,
	} = useForm({
		defaultValues: {
			receiptNo: "",
			paymentTerm: "",
			reference: "",
			poReference: "",
			date: new Date(),
			payments: [
				// Required
				{
					accountId: "",
					amount: formData?.netTotal || 0,
					type: "Cash",
				},
			],
		},
		resolver: yupResolver(Payment_Form_Validation),
		mode: "onChange",
	});

	// form fields array
	const { append, fields, remove } = useFieldArray({
		control,
		name: "payments",
	});

	// payment mutation
	const [paymentToInvoice, { loading: __payment__inprogress }] = useMutation(
		Create_Invoice_Payment,
		commonNotifierCallback({
			successTitle: "Payment successful",
		})
	);

	// payment mutation
	const [updateInvoice, { loading: __updating__invoice }] = useMutation(Update_Invoice_Status, {
		onCompleted: () => {
			// onSuccess();
			onRefetchHoldList();
		},
	});

	// create invoice mutation
	const [createInvoice, { loading: __creatingInvoice }] = useMutation(Create_Product_Invoice);

	useEffect(() => {
		// setValue(`paymentCount.${0}.amount`, formData?.netTotal);
	}, [formData]);

	// payment form submit
	const onSubmit = (values: any) => {
		if (preMadeInvoiceId) {
			paymentToInvoice({
				variables: {
					body: {
						clientId: formData?.clientId,

						invoiceId: preMadeInvoiceId,
						payments: values?.payments,
						poReference: values?.poReference,
						receptNo: values?.receptNo,
						reference: values?.reference,
						paymentTerm: values?.paymentTerm,
						date: values?.date,
					},
				},
			}).finally(() => {
				updateInvoice({
					variables: {
						invoiceId: preMadeInvoiceId,
						status: getTotalPaymentAmount(watch("payments")) === formData?.netTotal ? Purchase_Invoice_Status.Paid : Purchase_Invoice_Status.PartiallyPaid,
					},
				});
				getInvoiceData({
					variables: {
						where: {
							key: "_id",
							operator: "eq",
							value: preMadeInvoiceId,
						},
					},
				});
			});
		} else {
			createInvoice({
				variables: {
					input: {
						clientId: formData?.clientId,
						products: formData?.products,
						taxRate: formData?.taxRate,
						taxAmount: formData?.taxAmount,
						costAmount: formData?.costAmount,

						subTotal: formData?.subTotal || 0,
						netTotal: formData?.netTotal || 0,
						reference: values.reference || "",

						discountAmount: formData?.discountAmount || 0,
						discountMode: formData.discountMode || ProductDiscountMode.Amount,
						discountPercentage: formData.discountPercentage || 0,
						date: values?.date,
					},
				},
			}).then((invoice) => {
				paymentToInvoice({
					variables: {
						body: {
							clientId: formData?.clientId,

							invoiceId: invoice.data?.inventory__createProductInvoice?._id,
							payments: values?.payments,
							poReference: values?.poReference,
							receptNo: values?.receptNo,
							reference: values?.reference,
							paymentTerm: values?.paymentTerm,
							date: values?.date,
						},
					},
				}).finally(() => {
					getInvoiceData({
						variables: {
							where: {
								key: "_id",
								operator: "eq",
								value: invoice.data?.inventory__createProductInvoice?._id,
							},
						},
					});
				});
			});
		}
	};

	const invoiceSlip = useRef<HTMLDivElement>(null);

	const handlePrint = useReactToPrint({
		content: () => invoiceSlip.current!,
		pageStyle: `@media print{"@page { size: 70mm 56mm; margin: 0; }}`,
	});

	return (
		<div>
			{/* {JSON.stringify(errors, null, 2)} */}
			<form onSubmit={handleSubmit(onSubmit)}>
				<Input.Wrapper label="Reference" error={<ErrorMessage name={`reference`} errors={errors} />}>
					<Input placeholder="Reference" {...register(`reference`)} />
				</Input.Wrapper>
				<Space h={5} />
				<Input.Wrapper label="PO Reference" error={<ErrorMessage name={`poReference`} errors={errors} />}>
					<Input placeholder="PO Reference" {...register(`poReference`)} />
				</Input.Wrapper>
				<Space h={5} />
				<Input.Wrapper label="Receipt No" error={<ErrorMessage name={`receiptNo`} errors={errors} />}>
					<Input placeholder="Receipt no" {...register(`receiptNo`)} />
				</Input.Wrapper>
				<Space h={5} />
				<Input.Wrapper label="Payment Term" error={<ErrorMessage name={`paymentTerm`} errors={errors} />}>
					<Input placeholder="Payment Term" {...register(`paymentTerm`)} />
				</Input.Wrapper>
				<Space h={5} />
				<Input.Wrapper label="Date" error={<ErrorMessage name={`date`} errors={errors} />}>
					<DateInput placeholder="Pick a Date" onChange={(e) => setValue(`date`, e!)} defaultValue={watch(`date`)} />
				</Input.Wrapper>

				<Space h={10} />

				{fields.map((_, idx) => (
					<Paper key={idx} className="relative" p={10} my={10} withBorder>
						<Input.Wrapper withAsterisk label="Account" size="md" error={<ErrorMessage name={`payments.${idx}.accountId`} errors={errors} />}>
							<Select
								data={accountListForDrop ?? []}
								withAsterisk
								defaultValue={watch(`payments.${idx}.accountId`)}
								placeholder="Select account"
								onChange={(e) => setValue(`payments.${idx}.accountId`, e!)}
							/>
							{/* <Space h={5} /> */}
						</Input.Wrapper>
						<Space h={5} />
						<Input.Wrapper size="md" label="Payment Type" withAsterisk error={<ErrorMessage name={`payments.${idx}.type`} errors={errors} />}>
							<Select
								placeholder="Pick a payment type"
								withAsterisk
								data={["Nagad", "Rocket", "Bank", "Cash"]}
								onChange={(e) => setValue(`payments.${idx}.type`, e!)}
								defaultValue={watch(`payments.${idx}.type`)}
							/>
						</Input.Wrapper>
						<Space h={5} />
						<Input.Wrapper label="Amount" size="md" error={<ErrorMessage name={`payments.${idx}.amount`} errors={errors} />} withAsterisk>
							<NumberInput
								placeholder="Amount"
								onChange={(e) => setValue(`payments.${idx}.amount`, parseInt(e as string))}
								value={watch(`payments.${idx}.amount`)}
								min={0}
							/>
						</Input.Wrapper>
						<Space h={5} />

						<Group position="right">
							<Button color="red" onClick={() => remove(idx)} size="xs">
								Remove
							</Button>
						</Group>
					</Paper>
				))}

				<Space h={5} />

				<Group position="left">
					<Button
						variant="subtle"
						onClick={() =>
							append({
								accountId: "",
								type: "",
								amount: 0,
							})
						}
					>
						Add new
					</Button>

					<Button
						type="submit"
						loading={__creatingInvoice || __payment__inprogress || __updating__invoice}
						disabled={getTotalPaymentAmount(watch("payments")) > formData?.netTotal}
					>
						Make Payment
					</Button>
				</Group>
			</form>
			<div className="hidden print:block" ref={invoiceSlip}>
				<div className="w-[260px]">
					<div className="text-center border-b-2 border-black">
						<h2 className="text-2xl font-bold">{invoiceDetails?.inventory__productInvoice?.client?.name}</h2>
						<p className="mb-2">{invoiceDetails?.inventory__productInvoice?.client?.email}</p>
					</div>
					<div className="border-b-2 border-black py-2">
						<table className="w-full">
							<tbody>
								{invoiceDetails?.inventory__productInvoice?.products?.map((item, index) => (
									<tr key={index}>
										<td>
											{item?.name} x<span>{item?.quantity}</span>
										</td>
										<td className="text-right">{item?.netAmount} BDT</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="border-b-2 border-black py-2">
						<table className="w-full">
							<tbody>
								<tr>
									<td>Subtotal</td>
									<td className="text-right">{invoiceDetails?.inventory__productInvoice?.subTotal} BDT</td>
								</tr>
								<tr>
									<td>Discount</td>
									<td className="text-right">-{invoiceDetails?.inventory__productInvoice?.discountAmount} BDT</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="border-b-2 border-black py-2">
						<table className="w-full">
							<tbody>
								<tr>
									<td>Grand Total</td>
									<td className="text-right">{invoiceDetails?.inventory__productInvoice?.netTotal} BDT</td>
								</tr>
								<tr>
									<td>Paid Amount</td>
									<td className="text-right">{invoiceDetails?.inventory__productInvoice?.paidAmount} BDT</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="border-b-2 border-black py-2">
						<table className="w-full">
							<tbody>
								<tr>
									<td>Due Amount</td>
									<td className="text-right">0 BDT</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className="mt-5 text-center">Thanks for shopping with us.</div>
				</div>
			</div>
		</div>
	);
};

export default PaymentForm;

const getTotalPaymentAmount = (payments: any): number => {
	let totalPaymentAmount = 0;
	payments?.map((payment: any) => (totalPaymentAmount = totalPaymentAmount + payment?.amount));
	return totalPaymentAmount;
};
