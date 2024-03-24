import { Notify } from '@/_app/common/Notification/Notify';
import { useMutation } from '@apollo/client';
import { Button, Input, Space, Text, Title } from '@mantine/core';
import React, { useState } from 'react';
import { Create_Product_Invoice } from '../../utils/query.payment';

interface IHoldActionProps {
	formData: any;
	onSuccess: () => void;
}

const HoldAction: React.FC<IHoldActionProps> = ({ formData, onSuccess }) => {
	const [reference, setReference] = useState('');

	const [createInvoiceAsHold, { loading: creating }] = useMutation(
		Create_Product_Invoice,
		Notify({
			sucTitle: 'Added to hold list',
			onSuccess() {
				onSuccess();
			},
		})
	);

	console.log({ formData });
	return (
		<div>
			<Title order={3}>Hold Invoice</Title>

			<Space h={'sm'} />

			<Text fw={500}>
				Give a reference <br /> to quick payment
			</Text>

			<Space h={'sm'} />
			<Input
				placeholder='Reference'
				onChange={(e) => setReference(e?.target?.value)}
				required
			/>

			<Space h={'sm'} />

			<Button
				disabled={!reference}
				loading={creating}
				onClick={() =>
					createInvoiceAsHold({
						variables: {
							input: {
								clientId: formData?.client,
								note: 'A simple note',
								products: formData?.products,
								taxRate: formData?.invoiceTax,
								taxAmount: formData?.taxAmount,
								costAmount: formData?.transportCost,
								subTotal: formData?.subTotal,
								netTotal: formData?.netTotal,
								status: 'HOLD',
								reference,
							},
						},
					})
				}
			>
				Save
			</Button>
		</div>
	);
};

export default HoldAction;
