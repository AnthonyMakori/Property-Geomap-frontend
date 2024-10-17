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
import { getInvoices } from "@/store/accounts/accounts-slice";
import { getUnits } from "@/store/properties/buildings/buildings-slice";
import { useSelector } from "react-redux";
import { getRepairs } from "@/store/properties/buildings/buildings-slice";
import { useSession } from "next-auth/react";

function RepairsModal({ item }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);

  const [unit_id, setUnitId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repairType, setRepairType] = useState("General Repair");

  const [isSubmitting, setIsSubmitting] = useState("");

  const unitsStatus = useSelector(
    (state) => state.buildings.getUnitsStatus
  );
  const units = useSelector(
    (state) => state.buildings.getUnits
  );

  const isLoading = unitsStatus === "loading";

  useEffect(() => {  
    if (!session || status !== "authenticated") {
      return;
      }
const params = {};

  params["accessToken"] = session?.user?.accessToken;

    store.dispatch(getUnits(params));
  }, [session, status]);

  console.log("Units data monyancha", units);

  const unitsList =
  units?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  })) ?? [];

  const submitDetails = async (e) => {
    e.preventDefault();

    if (!title) {
      showNotification({
        title: "Error",
        message: "Title is required!",
        color: "red",
      });
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/repairs/store`;


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
              unit_id,
              title,
              description,
              repair_type: repairType,
          }),
        });

        if (!response.ok) {
            throw new Error(`Failed to store: ${response.statusText}`);
        }

        setIsSubmitting(false);

        showNotification({
            title: "Success",
            message: "Repair added Successfully",
            color: "green",
        });

        setUnitId("");
        setTitle("");
        setDescription("");
        setRepairType("General Repair");
        setOpened(false);
        const params = {};
        params["accessToken"] = session.user.accessToken;
        store.dispatch(getRepairs(params));
        
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
        title="Add Repair"
        onClose={() => setOpened(false)}
        padding="xs"
        overflow="inside"
      >
        <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
          
        <Select
            placeholder="Repair Type"
            label="Repair Type"
            value={repairType}
            onChange={setRepairType}
            data={[
              { value: "General Repair", label: "General Repair" },
              { value: "Unit Repair", label: "Unit Repair" },
            ]}
            searchable
            clearable
          />


          {repairType === "Unit Repair" && (
            <Select
            placeholder="Assign a Unit"
            label="Assign a Unit"
            value={unit_id}
            onChange={setUnitId}
            data={unitsList}
            searchable
            clearable
          />
          )}
          

        <TextInput
            placeholder="Repair Title"
            label="Repair Title"
            withAsterisk
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />

          <Textarea
            placeholder="Description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
          />
        </section>

        <section className="flex justify-end space-y-2 bg-light mt-5 p-3 rounded-lg my-3">
          <Button mt="md" onClick={submitDetails} loading={isSubmitting}>
          Add Repair
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconPlus size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        size="xs"
        color="blue"
      >
        Add Repair
      </Button>
    </>
  );
}

export default RepairsModal;
