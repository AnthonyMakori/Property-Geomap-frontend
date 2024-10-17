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
  import { useSession } from "next-auth/react";
  
  function BankModal({ item }) {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);

    const unitNumber = item?.unit?.code;

    const [amount, setAmount] = useState(item?.total_owed);
    const [phone, setPhone] = useState("");
    const [bank, setBank] = useState("");
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
          params["accessToken"] = session?.user?.accessToken;
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
          title="Initiate Bank Payment"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="mb-4 flex flex-col space-y-2 bg-light p-3 rounded-lg">
          <Select
            placeholder="Select your Bank"
            label="Select your Bank"
            value={bank}
            onChange={setBank}
            data={[
              { value: "Equity Bank", label: "Equity Bank" },
              { value: "Co-Operative Bank", label: "Co-Operative Bank" },
              { value: "KCB Bank", label: "KCB Bank" },
            ]}
            searchable
            clearable
          />

            <TextInput
              placeholder="Payment Amount"
              label="Payment Amount"
              withAsterisk
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value)}
            />
  
          </section>

        {bank === 'Equity Bank' && (
          <section className="flex flex-col space-y-2 p-3 rounded-lg mt-4">
            <Text mt="md">Kindly Pay <b> Ksh. { amount } </b> to <b>{ bank }</b>.</Text>
            <Text mt="md">Your payment will be reflected automatically once payment is confirmed</Text>
            <Text>Equity Bank Account No: <b>0510173039986</b> </Text>
            <Text>Country: <b>Kenya</b> </Text>
            <Text>Branch Name: <b>Nairobi CBD</b> </Text>
            <Text>Swift Code: <b>EQBLKENA</b> </Text>
            <Text>Bank Code: <b>13</b> </Text>
            {/* <Text color="red">For Test Use: <b>4073825</b> </Text> */}
            <Text>Reference No: <b>{unitNumber ?? 'Your Unit No.'} Your Unit No.</b></Text>
          </section>
        )}

        {bank === 'Co-Operative Bank' && (
          <section className="flex flex-col space-y-2 p-3 rounded-lg mt-4">
            <Text mt="md">Kindly Pay <b>Ksh. { amount }</b> to <b>{ bank }</b>.</Text>
            <Text mt="md">Your payment will be reflected automatically once payment is confirmed</Text>
            <Text>Co-Operative Bank Account No: <b>62736849930</b> </Text>
            <Text>Country: <b>Kenya</b> </Text>
            <Text>Branch Name: <b>Kilimani</b> </Text>
            <Text>Swift Code: <b>COPKENA</b> </Text>
            <Text>Bank Code: <b>09</b> </Text>
            {/* <Text color="red">For Test Use: <b>4073825</b> </Text> */}
            <Text>Reference No: <b>{unitNumber ?? 'Your Unit No.'} Your Unit No.</b></Text>
          </section>
        )}

        {bank === 'KCB Bank' && (
          <section className="flex flex-col space-y-2 p-3 rounded-lg mt-4">
            <Text mt="md">Kindly Pay <b>Ksh. { amount }</b> to <b>{ bank }</b>.</Text>
            <Text mt="md">Your payment will be reflected automatically once payment is confirmed</Text>
            <Text>KCB Bank Account No: <b>23094859983</b> </Text>
            <Text>Country: <b>Kenya</b> </Text>
            <Text>Branch Name: <b>Westlands</b> </Text>
            <Text>Swift Code: <b>KCBKENA</b> </Text>
            <Text>Bank Code: <b>78</b> </Text>
            {/* <Text color="red">For Test Use: <b>4073825</b> </Text> */}
            <Text>Reference No: <b>{unitNumber ?? 'Your Unit No.'} Your Unit No.</b></Text>
          </section>
        )}
  
  
          {/* <section className="flex justify-end space-y-2 mt-5 p-3 rounded-lg my-3">
            <Button mt="md" onClick={submitDetails} loading={isSubmitting}>
              Initiate Payment
            </Button>
          </section> */}
        </Modal>
  
        <Button
          leftIcon={<IconCircleCheck size={16} />}
          onClick={() => setOpened(true)}
          variant="outline"
          size="xs"
          ml="xs"
          color="green"
        >
          BANK
        </Button>
      </>
    );
  }
  
  export default BankModal;
  