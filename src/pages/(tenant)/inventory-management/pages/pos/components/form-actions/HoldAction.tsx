import { commonNotifierCallback } from '@/commons/components/Notification/commonNotifierCallback.ts';
import { Purchase_Invoice_Status } from '@/commons/graphql-models/graphql';
import { useMutation } from '@apollo/client';
import { Button, Input, Space, Text, Title } from '@mantine/core';
import React, { useState } from 'react';
import { IPosFormType } from '../../pos.page';
import { Create_Product_Invoice } from '../../utils/query.payment';

interface ExtendedFormData extends IPosFormType {
  subTotal: number;
  netTotal: number;

  discountAmount: number;
  discountPercentage: number;
}

interface IHoldActionProps {
  formData: ExtendedFormData;
  onSuccess: () => void;
}

const HoldAction: React.FC<IHoldActionProps> = ({ formData, onSuccess }) => {
  const [reference, setReference] = useState('');

  // create invoice mutation
  const [createInvoiceAsHold, { loading: creating }] = useMutation(
    Create_Product_Invoice,
    commonNotifierCallback({
      successTitle: 'Added to hold list',
      onSuccess() {
        onSuccess();
      },
    }),
  );

  // console.log({ formData });
  return (
    <div>
      <Title order={3}>Hold Invoice</Title>

      <Space h={'sm'} />

      <Text fw={500}>
        Give a reference <br /> to quick payment
      </Text>

      <Space h={'sm'} />
      <Input
        placeholder="Reference"
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
                clientId: formData?.clientId,
                note: 'A simple note',
                products: formData?.products,
                taxRate: formData?.taxRate || 0,
                taxAmount: formData?.taxAmount,
                costAmount: formData?.costAmount || 0,
                subTotal: formData?.subTotal,
                netTotal: formData?.netTotal,
                status: Purchase_Invoice_Status.Hold,
                reference,
              },
            },
          })
        }
      >
        Hold
      </Button>
    </div>
  );
};

export default HoldAction;
