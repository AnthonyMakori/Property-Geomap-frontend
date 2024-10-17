import {
    Modal,
    Button,
    TextInput,
    Select,
  } from "@mantine/core";
  import { DatePicker } from "@mantine/dates";
  import { useState, useEffect } from "react";
  import { showNotification } from "@mantine/notifications";
  import store from "@/store/store";
  import { useRouter } from "next/router";
  import { IconCurrencyDollar, IconPlus } from "@tabler/icons-react";
  import { getExpenseTypes } from "@/store/accounts/accounts-slice";
  import { useSession } from "next-auth/react";

  function CreateExpenseTypeModal() {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);

    const [expenseType, setExpenseType] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const submitDetails = async (e) => {
      e.preventDefault();
  
      if (!expenseType){
        showNotification({
          title: "Error",
          message: "Expense Type is Required!",
          color: "red",
        });
        return;
      }

  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/accounts/store-expense-type`;
  
  
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
                title: expenseType,
            }),
          });
  
          if (!response.ok) {
              throw new Error(`Failed to store: ${response.statusText}`);
          }
  
          setIsSubmitting(false);
  
          showNotification({
              title: "Success",
              message: "Expense Type Created Successfully",
              color: "green",
          });
  
          setExpenseType("");
          setOpened(false);
          const params = {};
          store.dispatch(getExpenseTypes(params));
          
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
          title="Create Expense Type"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
  
            <TextInput
              placeholder="Expense Type"
              label="Expense Type"
              withAsterisk
              value={expenseType}
              onChange={(e) => setExpenseType(e.currentTarget.value)}
            />
  

          </section>
  
          <section className="flex justify-end space-y-2 bg-light mt-5 p-3 rounded-lg my-3">
            <Button mt="md" onClick={submitDetails} loading={isSubmitting}>
            Create Expense Type
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
          Create Expense Type
        </Button>
      </>
    );
  }
  
  export default CreateExpenseTypeModal;
  