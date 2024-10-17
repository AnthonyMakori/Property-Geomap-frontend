import {
    Modal,
    Button,
    TextInput,
    Text,
    Select,
    Textarea,
  } from "@mantine/core";
  import { DatePicker } from "@mantine/dates";
  import { useState, useEffect } from "react";
  import { showNotification } from "@mantine/notifications";
  import store from "@/store/store";
  import { useRouter } from "next/router";
  import { IconCircleCheck, IconCurrencyDollar, IconPlus } from "@tabler/icons-react";
  import { getInvoices } from "@/store/accounts/accounts-slice";
  import { getUnits } from "@/store/properties/buildings/buildings-slice";
  import { useSelector } from "react-redux";
  import { getRepairs } from "@/store/properties/buildings/buildings-slice";
  import { getPurchases } from "@/store/accounts/accounts-slice";
  import { getExpenses } from "@/store/accounts/accounts-slice";
  import { useSession } from "next-auth/react";
  import { getAirtimeBalance } from "@/store/communications/communication-slice";
  
  function TopUpModal() {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
  
    const [isSubmitting, setIsSubmitting] = useState("");

    const submitDetails = async (e) => {
      e.preventDefault();
  
        setIsSubmitting(true);
      
        setOpened(false);
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getAirtimeBalance(params));

        setIsSubmitting(false);

        showNotification({
            title: "Success",
            message: "Refresh successful!",
            color: "green",
        });
  }
  
    return (
      <>
        <Modal
          opened={opened}
          title="Topup Airtime"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg mt-4">
            <Text mt="md">Pay via Our C2B Paybill</Text>
            <Text>Organization: <b>ILO INNOVATIONS LTD</b> </Text>
            <Text>Business No: <b>4085473</b> </Text>
            <Text>Account No: <b>{ session?.user?.code ?? '-'}</b></Text>
          </section>
  
          <section className="flex justify-end space-y-2 bg-light mt-5 p-3 rounded-lg my-3">
            <Button mt="md" onClick={submitDetails} loading={isSubmitting}>
            Finish
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconCircleCheck size={16} />}
          onClick={() => setOpened(true)}
          variant="filled"
          size="xs"
          color="blue"
        >
          Topup Airtime
        </Button>
      </>
    );
  }
  
  export default TopUpModal;
  