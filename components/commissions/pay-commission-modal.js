import {
    Button,
    Modal,
    Textarea,
    TextInput,
    useMantineTheme,
    Select,
    Alert,
  } from "@mantine/core";
  import { useSession } from "next-auth/react";
  import { IconPlus, IconAlertCircle, IconCircleCheck } from "@tabler/icons-react";
  import { useState, useEffect } from "react";
  import { useSelector } from "react-redux";
  import { showNotification } from "@mantine/notifications";
  import store from "@/store/store";
  import { getIncome } from '@/store/reports/reports-slice';
import { getTaxes } from "../../store/settings/settings-slice";
import { getCommissions } from "@/store/reports/reports-slice";
  
  function PayCommissionModal({item}) {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    //
    const [amount, setAmount] = useState(item?.amount ?? "");

    function clearForm() {
        setAmount("");
    }
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!amount) {
        showNotification({
          title: "Error",
          message: "Amount is required! ",
          color: "red",
        });
        return;
      }
  
      const data = {
        amount,
        commId: item?.id,
      };
  
      const JSONdata = JSON.stringify(data);
  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/reports/commissions/pay`;
  
      const accessToken = session.user.accessToken;
  
      // Form the request for sending data to the server.
      const options = {
        // The method is POST because we are sending data.
        method: "POST",
        // Tell the server we're sending JSON.
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // Body of the request is the JSON data we created above.
        body: JSONdata,
      };
  
      setLoading(true);
  
      const response = await fetch(endpoint, options);
      const result = await response.json();
  
      console.log(result);
  
      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Commission paid successfully!",
          color: "green",
        });
        clearForm();
        setLoading(false);
        setOpened(false);
        const params = {};
        params["accessToken"] = accessToken;
        store.dispatch(getCommissions(params));
      } else {
        showNotification({
          title: "Error",
          message: "Sorry! " + result.message,
          color: "red",
        });
        setLoading(false);
      }
      setLoading(false);
    };
  
    return (
      <>
        <Modal
          opened={opened}
          title="Record Commission Payment"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
            <TextInput
              placeholder="Commission Amount (KES)"
              label="Commission Amount (KES)"
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value)}
            />

          </section>
  
          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            <Button onClick={handleSubmit} loading={loading}>
              Record & Pay
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconCircleCheck size={16} />}
          onClick={() => setOpened(true)}
          variant="filled"
          color="green"
          size="xs"
          disabled={item?.status === 'paid'}
        >
          Mark as Paid
        </Button>
      </>
    );
  }
  
  export default PayCommissionModal;
  