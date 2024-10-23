import { Modal, Button, TextInput, Select, Textarea, SimpleGrid } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import { useRouter } from "next/router";
import { IconCurrencyDollar, IconPlus } from "@tabler/icons-react";
import { getInvoices } from "@/store/accounts/accounts-slice";
import { getUnits } from "@/store/properties/buildings/buildings-slice";
import { useSelector } from "react-redux";
import { getRepairs } from "@/store/properties/buildings/buildings-slice";
import { getPurchases } from "@/store/accounts/accounts-slice";
import { useSession } from "next-auth/react";
import { getBuildings } from "@/store/properties/buildings/buildings-slice";

function PurchasesModal({ item }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [vendor, setVendor] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [apartment, setApartment] = useState("");

  const [isSubmitting, setIsSubmitting] = useState("");

  const unitsStatus = useSelector((state) => state.buildings.getUnitsStatus);
  const units = useSelector((state) => state.buildings.getUnits);

  const isLoading = unitsStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};

    params["accessToken"] = session?.user?.accessToken;

    store.dispatch(getUnits(params));
  }, [session, status]);

  console.log("Units data Anthony", units);

  const unitsList =
    units?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) ?? [];

  const submitDetails = async (e) => {
    e.preventDefault();

    if (!name) {
      showNotification({
        title: "Error",
        message: "Name is required!",
        color: "red",
      });
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/purchases/store`;

    setIsSubmitting(true);

    const accessToken = session.user.accessToken;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken} `,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          vendor,
          name,
          description,
          quantity,
          amount,
          apartment,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to store: ${response.statusText}`);
      }

      setIsSubmitting(false);

      showNotification({
        title: "Success",
        message: "Purchase added Successfully",
        color: "green",
      });

      setVendor("");
      setName("");
      setDescription("");
      setQuantity("");
      setAmount("");
      setOpened(false);
      const params = {};
      params["accessToken"] = session.user.accessToken;
      store.dispatch(getPurchases(params));
    } catch (error) {
      setIsSubmitting(false);
      // Handle network errors or other errors here

      showNotification({
        title: "Error",
        message: "" + error,
        color: "red",
      });
    }
  };

  //Get Apartments
  const apartments = useSelector((state) => state.buildings.getBuildings);
  
  useEffect(() => {
      if (!session || status !== "authenticated") {
      return;
      }
    const params = {};

    params["accessToken"] = session.user.accessToken;

    store.dispatch(getBuildings(params));
  }, [session, status]);

  const apartmentsList =
  apartments?.data?.map((item) => ({
    value: item?.name,
    label: item?.name,
  })) ?? [];

  return (
    <>
      <Modal
        opened={opened}
        title="Add Purchase"
        onClose={() => setOpened(false)}
        size="lg"
        overflow="inside"
      >

        <SimpleGrid cols={2} >
          <TextInput
            placeholder="Vendor"
            label="Vendor"
            withAsterisk
            value={vendor}
            onChange={(e) => setVendor(e.currentTarget.value)}
          />

          <Select
              label="Select Apartment"
              placeholder="Select Apartment"
              searchable
              onChange={setApartment}
              value={apartment}
              clearable
              data={apartmentsList}
            />

          <TextInput placeholder="Order Date" label="Order Date" type="date" />

          <TextInput
            placeholder="Receipt Date"
            label="Receipt Date"
            type="date"
          />

          <TextInput
            placeholder="Deadline Date"
            label="Deadline Date"
            type="date"
          />

          <TextInput
            placeholder="Confirm Before E.g 2,4,7 Days etc."
            label="Confirm Before"
          />

          <TextInput
            placeholder="Item Name"
            label="Item Name"
            withAsterisk
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Quantity"
            label="Quantity"
            withAsterisk
            value={quantity}
            onChange={(e) => setQuantity(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Amount"
            label="Amount"
            withAsterisk
            value={amount}
            onChange={(e) => setAmount(e.currentTarget.value)}
          />

          <Textarea
            placeholder="Terms and Conditions"
            label="Terms and Conditions"
            withAsterisk
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
        </SimpleGrid>

        <Button mt="md" onClick={submitDetails} loading={isSubmitting}>
            Add Purchase
        </Button>

      </Modal>

      <Button
        leftIcon={<IconPlus size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        size="xs"
        color="blue"
      >
        Add Purchase
      </Button>
    </>
  );
}

export default PurchasesModal;
