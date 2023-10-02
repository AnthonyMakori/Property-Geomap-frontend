import {
    Modal,
    Button,
    TextInput,
    Text,
    Select,
  } from "@mantine/core";
  import { DatePicker } from "@mantine/dates";
  import { useState, useEffect } from "react";
  import { showNotification } from "@mantine/notifications";
  import store from "@/store/store";
  import { useRouter } from "next/router";
  import { IconCircleCheck, IconCoin, IconCurrencyDollar } from "@tabler/icons-react";
  import { getInvoices } from "@/store/accounts/accounts-slice";
  
  function StkPushModal({ item }) {
    const [opened, setOpened] = useState(false);

    const unitNumber = item?.unit?.code;

    const [amount, setAmount] = useState(item?.total_owed);
    const [phone, setPhone] = useState("");
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
  
      if (!phone) {
        showNotification({
          title: "Error",
          message: "Phone Number is required!",
          color: "red",
        });
        return;
      }
  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/stk/initiate`;
  
  
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
                phone,
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
              message: "Payment Initiated Successfully",
              color: "green",
          });

          showNotification({
            title: "Info",
            message: "Awaiting Payment! Kindly check your phone and enter your M-Pesa Pin",
            color: "blue",
        });
  
          setAmount("");
          setPhone("");
          setOpened(false);
          const params = {};
          setTimeout(() => {
            store.dispatch(getInvoices(params));
          }, 4000);
          
          
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
          title="Initiate Stk Push Payment"
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
  
            <TextInput
              placeholder="Eg. 0799117020"
              label="Phone Number"
              withAsterisk
              value={phone}
              onChange={(e) => setPhone(e.currentTarget.value)}
            />
          </section>

          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg mt-4">
            <Text mt="md">OR</Text>
            <Text mt="md">Pay via Our Paybill</Text>
            <Text>Business No: <b>4085473</b> </Text>
            <Text color="red">For Test Use: <b>4073825</b> </Text>
            <Text>Account No: <b>YOUR UNIT NUMBER - {unitNumber}</b></Text>
          </section>
  
          <section className="flex justify-end space-y-2 bg-light mt-5 p-3 rounded-lg my-3">
            <Button mt="md" onClick={submitDetails} loading={isSubmitting}>
              Initiate Payment
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconCircleCheck size={16} />}
          onClick={() => setOpened(true)}
          variant="outline"
          size="xs"
          ml="xs"
          color="green"
        >
          Pay Now
        </Button>
      </>
    );
  }
  
  export default StkPushModal;
  