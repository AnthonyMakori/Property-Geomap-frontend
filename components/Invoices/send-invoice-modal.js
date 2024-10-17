import {
    Modal,
    Button,
    TextInput,
    Select,
    Textarea,
    Text,
  } from "@mantine/core";
  import { DatePicker } from "@mantine/dates";
  import { useState, useEffect } from "react";
  import { showNotification } from "@mantine/notifications";
  import store from "@/store/store";
  import { useRouter } from "next/router";
  import { IconCurrencyDollar, IconPlus, IconSend } from "@tabler/icons-react";
  import { getBills } from "@/store/accounts/accounts-slice";
  import { useSession } from "next-auth/react";
  import { getOneUnit } from "../../store/properties/buildings/buildings-slice";
  import { formatNumber } from "@/lib/shared/data-formatters"
  
  function SendInvoiceModal({ item, due }) {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
  
    const itemId = item?.id;
  
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const submitDetails = async (e) => {
      e.preventDefault();
  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/accounts/send-individual-invoice/${item?.id}`;
  
  
      setIsSubmitting(true);
  
      const accessToken = session.user.accessToken;
  
      try {
          const response = await fetch(endpoint, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken} `,
                  'Content-Type': 'application/json',
              },
              credentials: 'include',
          });
  
          if (!response.ok) {
              throw new Error(`Failed to store: ${response.statusText}`);
          }
  
          setIsSubmitting(false);
  
          showNotification({
              title: "Success",
              message: "Invoice sent successfully",
              color: "green",
          });
  
          setOpened(false);
          const params = {};
          params["accessToken"] = session?.user?.accessToken;
          params["unitId"] = item?.id,
          store.dispatch(getOneUnit(params));
          
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
          title="Send an Invoice"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
            <Text>Are you sure you want to send an invoice to {item?.tenant?.name}. An SMS will be sent out to the tenant.</Text>
            {/* <TextInput
              placeholder="Bill Amount"
              label="Bill Amount"
              withAsterisk
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value)}
            /> */}
          </section>
  
          <section className="flex justify-end  bg-light mt-5 p-3 rounded-lg ">
          <Button mr="xs" onClick={() => setOpened(false)} variant="outline" color="red">
              Cancel
            </Button>
            <Button onClick={submitDetails} loading={isSubmitting}>
              Send Invoice
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconSend size={16} />}
          onClick={() => setOpened(true)}
          variant="outline"
          mt="md"
          fullWidth
          color="blue"
        >
         Send Invoice
        </Button>
      </>
    );
  }
  
  export default SendInvoiceModal;
  