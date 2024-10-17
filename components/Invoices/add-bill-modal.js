import {
    Modal,
    Button,
    TextInput,
    Select,
    Textarea,
  } from "@mantine/core";
  import { DatePicker } from "@mantine/dates";
  import { useState, useEffect } from "react";
  import { showNotification } from "@mantine/notifications";
  import store from "@/store/store";
  import { useRouter } from "next/router";
  import { IconCurrencyDollar, IconPlus } from "@tabler/icons-react";
  import { getBills } from "@/store/accounts/accounts-slice";
  import { useSession } from "next-auth/react";
  import { getOneUnit } from "../../store/properties/buildings/buildings-slice";
  
  function AddBillModal({ item }) {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
  
    const itemId = item?.id;
  
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const submitDetails = async (e) => {
      e.preventDefault();
      if (!type) {
        showNotification({
          title: "Error",
          message: "Utility Type is required!",
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
  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/units/store-bill`;
  
  
      setIsSubmitting(true);
  
      const accessToken = session.user.accessToken;
  
      try {
          const response = await fetch(endpoint, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken} `,
                  'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                amount,
                type,
                description,
                unit_id: item?.id,
            }),
          });
  
          if (!response.ok) {
              throw new Error(`Failed to store: ${response.statusText}`);
          }
  
          setIsSubmitting(false);
  
          showNotification({
              title: "Success",
              message: "Bill added Successfull",
              color: "green",
          });
  
          setAmount("");
          setType("");
          setDescription("");
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
          title="Add Bill"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          
          <Select
              placeholder="Utility Type"
              label="Utility Type"
              value={type}
              onChange={setType}
              data={[
                { value: "Water", label: "Water" },
                { value: "Electricity", label: "Electricity" },
                { value: "Gas", label: "Gas" },
                { value: "Heating", label: "Heating" },
                { value: "Trash/Recycling", label: "Trash/Recycling" },
                { value: "Internet and Cable/TV Services", label: "Internet and Cable/TV Services" },
                { value: "Maintenance Fees", label: "Maintenance Fees" },
                { value: "Renter's Insurance", label: "Renter's Insurance" },
                { value: "Property Taxes", label: "Property Taxes" },
                { value: "Homeowner's Association (HOA) Fees", label: "Homeowner's Association (HOA) Fees" },
                { value: "Other", label: "Other" },  
            ]}
              searchable
              clearable
            />
  
            <TextInput
              placeholder="Bill Amount"
              label="Bill Amount"
              withAsterisk
              value={amount}
              onChange={(e) => setAmount(e.currentTarget.value)}
            />
  
            <Textarea
              placeholder="Bill Details (Eg. Water meter reading, Electricity meter reading, etc.)"
              label="Bill Details"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              minRows={2}
              autosize
            />
          </section>
  
          <section className="flex justify-end space-y-2 bg-light mt-5 p-3 rounded-lg my-3">
            <Button mt="md" onClick={submitDetails} loading={isSubmitting}>
              Add Bill
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconPlus size={16} />}
          onClick={() => setOpened(true)}
          variant="filled"
          mt="md"
          fullWidth
          color="blue"
        >
          Add Bill
        </Button>
      </>
    );
  }
  
  export default AddBillModal;
  