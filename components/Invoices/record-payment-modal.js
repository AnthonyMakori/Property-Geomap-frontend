import {
  Modal,
  Button,
  TextInput,
  Select,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import { useRouter } from "next/router";
import { IconCurrencyDollar } from "@tabler/icons-react";
import { getInvoices } from "@/store/accounts/accounts-slice";

function RecordPaymentModal({ item }) {
  const [opened, setOpened] = useState(false);

  const itemId = item?.id;

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDetails = async (e) => {
    e.preventDefault();

    if (amount > item?.total_owed){
      showNotification({
        title: "Error",
        message: "Amount is greater than the invoice balance of Ksh. " + item?.total_owed,
        color: "red",
      });
      return;
    }

    if (item?.total_owed === 0){
      showNotification({
        title: "Error",
        message: "Invoice already fully paid!",
        color: "red",
      });
      return;
    }
    
    if (!amount) {
      showNotification({
        title: "Error",
        message: "Amount is required!",
        color: "red",
      });
      return;
    }

    if (!paymentMethod) {
      showNotification({
        title: "Error",
        message: "Payment Method is required!",
        color: "red",
      });
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/store-payment`;


    setIsSubmitting(true);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              amount,
              method: paymentMethod,
              reference_code: referenceCode,
              tenant_id: item?.tenant?.id,
              invoice_id: item?.id,
          }),
        });

        if (!response.ok) {
            throw new Error(`Failed to store: ${response.statusText}`);
        }

        setIsSubmitting(false);

        showNotification({
            title: "Success",
            message: "Payment Successfull",
            color: "green",
        });

        setAmount("");
        setPaymentMethod("");
        setReferenceCode("");
        setOpened(false);
        const params = {};
        store.dispatch(getInvoices(params));
        
    } catch (error) {
        setIsSubmitting(false);
        // Handle network errors or other errors here

        showNotification({
            title: "Error",
            message: "" + error,
            color: "red",
        });
    }
}

  return (
    <>
      <Modal
        opened={opened}
        title="Record New Invoice Payment"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <TextInput
            placeholder="Payment Amount"
            label="Payment Amount"
            withAsterisk
            value={amount}
            onChange={(e) => setAmount(e.currentTarget.value)}
          />

          <Select
            placeholder="Payment Method"
            label="Payment Method"
            value={paymentMethod}
            onChange={setPaymentMethod}
            data={[
              { value: "Cheque", label: "Cheque" },
              { value: "Bank Transfer", label: "Bank Transfer" },
              // { value: "Mpesa", label: "M-Pesa" },
              // { value: "Cash", label: "Cash" },
            ]}
            searchable
            clearable
          />

          <TextInput
            placeholder="Payment Reference code eg. RYHF3526R"
            label="Reference Code"
            value={referenceCode}
            onChange={(e) => setReferenceCode(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light mt-5 p-3 rounded-lg my-3">
          <Button mt="md" onClick={submitDetails} loading={isSubmitting}>
            Submit Payment
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconCurrencyDollar size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        size="xs"
        color="blue"
      >
        Record Pay
      </Button>
    </>
  );
}

export default RecordPaymentModal;
