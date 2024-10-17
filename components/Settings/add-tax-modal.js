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
  import { IconPlus, IconAlertCircle } from "@tabler/icons-react";
  import { useState, useEffect } from "react";
  import { useSelector } from "react-redux";
  import { showNotification } from "@mantine/notifications";
  import store from "@/store/store";
  import { getIncome } from '@/store/reports/reports-slice';
import { getTaxes } from "../../store/settings/settings-slice";
  
  function AddTaxModal() {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    //
    const [name, setName] = useState("");
    const [tax, setTax] = useState("");
  
    function clearForm() {
        setName("");
        setTax("");
    }
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!name) {
        showNotification({
          title: "Error",
          message: "Name is required! ",
          color: "red",
        });
        return;
      }
  
      if (!tax) {
        showNotification({
          title: "Error",
          message: "Tax is required! ",
          color: "red",
        });
        return;
      }
  
      const data = {
        name,
        tax,
      };
  
      const JSONdata = JSON.stringify(data);
  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/settings/store-tax`;
  
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
  
      if (response.status === 201) {
        showNotification({
          title: "Success",
          message: "Tax created successfully!",
          color: "green",
        });
        clearForm();
        setLoading(false);
        setOpened(false);
        const params = {};
        params["accessToken"] = accessToken;
        store.dispatch(getTaxes(params));
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
          title="Add Tax"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
            <TextInput
              placeholder="Tax Name"
              label="Tax Name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />

            <TextInput
              placeholder="Eg. 16"
              label="Tax(%)"
              value={tax}
              onChange={(e) => setTax(e.currentTarget.value)}
            />

          </section>
  
          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            <Button onClick={handleSubmit} loading={loading}>
              Add Tax
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconPlus size={16} />}
          onClick={() => setOpened(true)}
          variant="outline"
        >
          Add Tax
        </Button>
      </>
    );
  }
  
  export default AddTaxModal;
  