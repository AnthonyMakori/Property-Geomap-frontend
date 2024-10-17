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
  
  function GenerateInvoices() {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    //generateInvoices
    const generateInvoices = async () => {
    
      setIsSubmitting(true);
    
      const accessToken = session.user.accessToken;
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
    
      try {
          const response = await fetch(`${API_URL}/cron/index`, {
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${accessToken} `,
                  Accept: "application/json",
                  'Content-Type': 'application/json',
              },
          });
    
          if (!response.ok) {
              throw new Error(`Failed : ${response.statusText}`);
          }
    
          setIsSubmitting(false);
    
          showNotification({
              title: "Success",
              message: "Invoices generated Successfully",
              color: "green",
          });
    
          const params = {};
          params["accessToken"] = session.user.accessToken;
          store.dispatch(getInvoices(params));
          setIsSubmitting(false);
          setOpened(false)
    
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
          title="Generate invoices for this month."
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
            By clicking confirm you agree to generate invoices for the current month. If the invoices for this month have been generated already kindly don't proceed because it will result to duplicate invoices sent.
          </section>

          <section className="flex justify-end space-y-2 bg-light mt-5 p-3 rounded-lg my-3">
            <Button mt="8px" mr="md" color="red" variant="outline" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button  onClick={generateInvoices} loading={isSubmitting}>
             Confirm
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconCircleCheck size={16} />}
          onClick={() => setOpened(true)}
          variant="outline"
          size="xs"
          ml="xs"
        >
          Generate Invoices
        </Button>
      </>
    );
  }
  
  export default GenerateInvoices;
  