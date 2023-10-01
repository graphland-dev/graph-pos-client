import {
  ActionIcon,
  Button,
  Group,
  Input,
  Space,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconX } from "@tabler/icons-react";
import easyinvoice, { InvoiceData } from "easyinvoice";
import React, { useState } from "react";

export const InvoiceGenerator: React.FC = () => {
  const [isDiscount, setIsDiscount] = useState(false);
  const [isTax, setIsTax] = useState(false);
  const [isShipping, setIsShipping] = useState(true);

  const [tableData, setTableData] = useState([
    {
      item: "Item 1",
      qty: 1,
      rate: 0,
      amount: 0,
    },
  ]);

  const downloadInvoice = () => {
    const data: InvoiceData = {
      // Customize enables you to provide your own templates
      // Please review the documentation for instructions and examples
      images: {
        // The logo on top of your invoice
        logo: "https://scontent.fdac14-1.fna.fbcdn.net/v/t39.30808-6/317251787_105713745713768_827585269257476874_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=a2f6c7&_nc_eui2=AeH6xto_ARBbrbxT5CrenpqqNJG9_Kk9Oac0kb38qT05p3j8k4k9iUq8iLgGvNCgJ83KmL-YvOzzHh098FmF8CQj&_nc_ohc=tqxIbIe9lmQAX-kjkzP&_nc_ht=scontent.fdac14-1.fna&oh=00_AfCTT7Zawxf4oXrjqGmIY_-YiOQKcUqvtMjixq_k6YxY1Q&oe=651DEB77",
        // The invoice background
        // background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg",
      },
      // Your own data
      sender: {
        company: "Sample Corp",
        address: "Sample Street 123",
        // zip: "1234 AB",
        // city: "Sampletown",
        // country: "Samplecountry",
        // custom1: "custom value 1",
        // custom2: "custom value 2",
        // custom3: "custom value 3",
      },
      // Your recipient
      client: {
        company: "Client Corp",
        address: "Clientstreet 456",
        zip: "4567 CD",
        city: "Clientcity",
        country: "Clientcountry",
        custom1: "custom value 1",
        custom2: "custom value 2",
        custom3: "custom value 3",
      },
      information: {
        // Invoice number
        number: "00001",
        // Invoice data
        date: "12-12-2021",
        // Invoice due date
        // "due-date": "31-12-2021",
      },
      // The products you would like to see on your invoice
      // Total values are being calculated automatically
      products: [
        {
          quantity: "2",
          description: "Product 1",
          price: 33.87,
        },
      ],
      // The message you would like to display on the bottom of your invoice
      "bottom-notice": "Kindly pay your invoice within 15 days.",
      // Settings to customize your invoice
      settings: {
        currency: "BDT", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
        // "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')
        // "margin-top": 25, // Defaults to '25'
        // "margin-right": 25, // Defaults to '25'
        // "margin-left": 25, // Defaults to '25'
        // "margin-bottom": 25, // Defaults to '25'
        // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
        // "height": "1000px", // allowed units: mm, cm, in, px
        // "width": "500px", // allowed units: mm, cm, in, px
        // "orientation": "landscape", // portrait or landscape, defaults to portrait
      },
      // Translate your invoice to your preferred language
      translate: {
        // "invoice": "FACTUUR",  // Default to 'INVOICE'
        // "number": "Nummer", // Defaults to 'Number'
        // "date": "Datum", // Default to 'Date'
        // "due-date": "Verloopdatum", // Defaults to 'Due Date'
        // "subtotal": "Subtotaal", // Defaults to 'Subtotal'
        // "products": "Producten", // Defaults to 'Products'
        // "quantity": "Aantal", // Default to 'Quantity'
        // "price": "Prijs", // Defaults to 'Price'
        // "product-total": "Totaal", // Defaults to 'Total'
        // "total": "Totaal", // Defaults to 'Total'
        // "vat": "btw" // Defaults to 'vat'
      },
    };
    easyinvoice.createInvoice(data, function (result) {
      //The response will contain a base64 encoded PDF file
      easyinvoice.download("myInvoice.pdf", result.pdf);
    });
  };

  return (
    <div className="px-5 py-5 bg-white rounded-md shadow-lg">
      <div className="items-start justify-between lg:flex">
        <div>
          {" "}
          <Image />
        </div>
        <div>
          <Title fz={50} mb={10} fw={500}>
            Invoice
          </Title>
          <TextInput
            label="Invoice number"
            placeholder="Invoice number"
            defaultValue={"01"}
            w={300}
          />
        </div>
      </div>
      <Space h={"lg"} />
      <div className="lg:flex !items-start justify-between">
        <div>
          <Textarea
            label="Invoice from"
            w={410}
            placeholder="Who is this invoice from ?"
            withAsterisk
          />
          <Space h={"sm"} />

          <div className="justify-between lg:flex">
            <Textarea
              label="Invoice to"
              w={200}
              placeholder="Who is this invoice to ?"
              withAsterisk
            />
            <Textarea label="Ship to" size="sm" w={200} placeholder="Ship to" />
          </div>
        </div>
        <div>
          <DateInput label="Date" placeholder="Pick a date" w={300} />
          <TextInput
            label="Payment terms"
            placeholder="Payment terms"
            w={300}
          />
          <DateInput label="Due date" placeholder="Pick a date" w={300} />
          <TextInput label="PO number" placeholder="PO number" w={300} />
        </div>
      </div>
      <Space h={"lg"} />
      <Table withBorder={false} withColumnBorders={false}>
        <thead>
          <tr>
            <th className="w-6/12">Item</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {tableData?.map((td, idx) => (
            <tr key={idx}>
              <td>
                <TextInput placeholder="Item name" defaultValue={td?.item} />
              </td>
              <td>
                <Input
                  type="number"
                  placeholder="Quantity"
                  defaultValue={td?.qty}
                />
              </td>
              <td>
                <Input
                  type="number"
                  placeholder="Rate"
                  defaultValue={td?.rate}
                />
              </td>
              <td>
                <Input
                  type="number"
                  placeholder="Amount"
                  defaultValue={td?.amount}
                />
              </td>
            </tr>
          ))}

          <Button
            variant="subtle"
            color="teal"
            onClick={() =>
              setTableData([
                ...tableData,
                {
                  item: `Item ${tableData?.length + 1}`,
                  qty: 1,
                  rate: 0,
                  amount: 0,
                },
              ])
            }
          >
            Add new
          </Button>
        </tbody>
      </Table>
      <Space h={"lg"} />
      <div className="lg:flex !items-start justify-between">
        <div>
          <Textarea label="Notes" w={300} placeholder="Invoice notes..." />
          <Space h={"sm"} />
          <Textarea
            label="Terms"
            size="sm"
            w={300}
            placeholder="Invoice terms"
          />
        </div>
        <div>
          <div className="flex items-center justify-between gap-5">
            <Text color="gray">Subtotal</Text>
            <Text>120</Text>
          </div>

          <Space h={"sm"} />

          {isShipping && (
            <>
              <div className="flex items-center justify-between">
                <Text color="gray">Shipping (OMR)</Text>

                <div className="flex items-center">
                  <Input defaultValue={0} w={100} />
                  <ActionIcon
                    color="red"
                    size={"xs"}
                    ml={5}
                    onClick={() => setIsShipping(false)}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </div>
              </div>
              <Space h={"sm"} />
            </>
          )}

          {isDiscount && (
            <>
              <div className="flex items-center justify-between">
                <Text color="gray">Discount (%)</Text>
                <div className="flex items-center">
                  <Input defaultValue={5} w={100} />
                  <ActionIcon
                    color="red"
                    size={"xs"}
                    ml={5}
                    onClick={() => setIsDiscount(false)}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </div>
              </div>
              <Space h={"sm"} />
            </>
          )}
          {isTax && (
            <>
              <div className="flex items-center justify-between">
                <Text color="gray">Tax (%)</Text>

                <div className="flex items-center">
                  <Input defaultValue={5} w={100} />
                  <ActionIcon
                    color="red"
                    size={"xs"}
                    ml={5}
                    onClick={() => setIsTax(false)}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </div>
              </div>

              <Space h={"sm"} />
            </>
          )}

          <div className="flex items-center justify-end">
            {!isTax && (
              <Button
                size="sm"
                compact
                variant="subtle"
                color="teal"
                onClick={() => setIsTax(true)}
              >
                + Tax
              </Button>
            )}
            {!isDiscount && (
              <Button
                size="sm"
                compact
                variant="subtle"
                color="teal"
                onClick={() => setIsDiscount(true)}
              >
                + Discount
              </Button>
            )}

            {!isShipping && (
              <Button
                size="sm"
                compact
                variant="subtle"
                color="teal"
                onClick={() => setIsShipping(true)}
              >
                + Shipping
              </Button>
            )}
          </div>

          <Space h={"sm"} />
          <div className="flex items-center justify-between gap-5">
            <Text color="gray">Total</Text>
            <Text>120</Text>
          </div>
          <Space h={"sm"} />
          <div className="flex items-center justify-between gap-5">
            <Text color="gray">Amount paid (OMR)</Text>
            <Input defaultValue={100} w={100} />
          </div>
          <Space h={"sm"} />
          <div className="flex items-center justify-between gap-5">
            <Text color="gray">Balance due</Text>
            <Text>50</Text>
          </div>
        </div>
      </div>
      <Space h={50} />
      <Group position="right">
        <Button color="orange" variant="subtle">
          Save as Default
        </Button>
        <Button color="teal" variant="filled" onClick={downloadInvoice}>
          Download
        </Button>
      </Group>
    </div>
  );
};
