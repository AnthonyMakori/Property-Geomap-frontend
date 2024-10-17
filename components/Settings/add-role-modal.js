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
  import { getPurchases } from "@/store/accounts/accounts-slice";
  import { useSession } from "next-auth/react";
  import { getAccessGroups } from "@/store/settings/settings-slice";
  
  function AddAccessControlRoleModal({ item }) {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
  
    const [role, setRole] = useState("");
  
    const [isSubmitting, setIsSubmitting] = useState("");
  
    const submitDetails = async (e) => {
      e.preventDefault();
  
      if (!role) {
        showNotification({
          title: "Error",
          message: "Role is required!",
          color: "red",
        });
        return;
      }
  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/settings/store-access-group`;
  
  
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
                name: role,        
            }),
          });
  
          if (!response.ok) {
              throw new Error(`Failed to store: ${response.statusText}`);
          }
  
          setIsSubmitting(false);
  
          showNotification({
              title: "Success",
              message: "Role added Successfully",
              color: "green",
          });
  
          setRole("");
          setOpened(false);
          const params = {};
          params["accessToken"] = session.user.accessToken;
          store.dispatch(getAccessGroups(params));
          
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
          title="Add Access Group"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
  
          <TextInput
              placeholder="Role"
              label="Role"
              withAsterisk
              value={role}
              onChange={(e) => setRole(e.currentTarget.value)}
            />
          </section>
  
          <section className="flex justify-end space-y-2 bg-light mt-5 p-3 rounded-lg my-3">
            <Button mt="md" onClick={submitDetails} loading={isSubmitting}>
            Add Role
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
          Add Role
        </Button>
      </>
    );
  }
  
  export default AddAccessControlRoleModal;
  