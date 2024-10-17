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
  import { IconCircleCheck, IconCurrencyDollar, IconPlus } from "@tabler/icons-react";
  import { getInvoices } from "@/store/accounts/accounts-slice";
  import { getUnits } from "@/store/properties/buildings/buildings-slice";
  import { useSelector } from "react-redux";
  import { getRepairs } from "@/store/properties/buildings/buildings-slice";
  import { getPurchases } from "@/store/accounts/accounts-slice";
  import { getExpenses } from "@/store/accounts/accounts-slice";
  import { useSession } from "next-auth/react";
  
  function ApprovalModal({ item, origin }) {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState(item?.status);
  
    const [isSubmitting, setIsSubmitting] = useState("");

    const submitDetails = async (e) => {
      e.preventDefault();
  
      if (!approvalStatus) {
        showNotification({
          title: "Error",
          message: "Status is required!",
          color: "red",
        });
        return;
      }
  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      let endpoint = "";

      if(origin === "purchases"){
        endpoint = `${API_URL}/purchases/approve/${item?.id}`;
      }else if(origin === "repairs") {
        endpoint = `${API_URL}/repairs/approve/${item?.id}`;
      }else if(origin === "expenses") {
        endpoint = `${API_URL}/accounts/approve-expense/${item?.id}`;
      }else{
        showNotification({
            title: "Success",
            message: "Endpoint is null!",
            color: "green",
        });
      }
      
  
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
                status: approvalStatus,       
            }),
          });
  
          if (!response.ok) {
              throw new Error(`Failed to store: ${response.statusText}`);
          }
  
          setIsSubmitting(false);

          if(origin === "purchases"){
  
          showNotification({
              title: "Success",
              message: "Purchase approved Successfully",
              color: "green",
          });
  
          setOpened(false);
          const params = {};
          params["accessToken"] = session.user.accessToken;
          store.dispatch(getPurchases(params));

        }else if(origin === "repairs"){

            showNotification({
                title: "Success",
                message: "Repair approved Successfully",
                color: "green",
            });
    
            setOpened(false);
            const params = {};
            params["accessToken"] = session.user.accessToken;
            store.dispatch(getRepairs(params));

          }else if(origin === "expenses"){

            showNotification({
                title: "Success",
                message: "Expense approved Successfully",
                color: "green",
            });
    
            setOpened(false);
            const params = {};
            params["accessToken"] = session.user.accessToken;
            store.dispatch(getExpenses(params));

          }
          
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
          title="Approve Purchase"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
  
          <Select
            placeholder="Set Status"
            label="Set Status"
            value={approvalStatus}
            onChange={setApprovalStatus}
            data={[
                { value: "Pending", label: "Pending" },
                { value: "Approved", label: "Approved" },
                { value: "Rejected", label: "Rejected" },
            ]}
            searchable
            clearable
            />

  
          </section>
  
          <section className="flex justify-end space-y-2 bg-light mt-5 p-3 rounded-lg my-3">
            <Button mt="md" onClick={submitDetails} loading={isSubmitting}>
            Save
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconCircleCheck size={16} />}
          onClick={() => setOpened(true)}
          variant="outline"
          size="xs"
          color="blue"
        >
          Approve
        </Button>
      </>
    );
  }
  
  export default ApprovalModal;
  