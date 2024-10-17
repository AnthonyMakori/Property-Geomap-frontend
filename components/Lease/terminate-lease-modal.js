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
  import { IconBan, IconCurrencyDollar } from "@tabler/icons-react";
  import { getLeases } from "@/store/properties/buildings/buildings-slice";
  import { useSession } from "next-auth/react";
  
  function TerminateLeaseModal({ item }) {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
  
    const itemId = item?.id;
  
    const [date, setDate] = useState("");
    const [refunded, setRefunded] = useState("");
    const [deposit, setDeposit] = useState("");
    const [refundDeposit, setRefundDeposit] = useState("No");
    const [reason, setReason] = useState("");
    const [inspection, setInspection] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const submitDetails = async (e) => {
      e.preventDefault();
  
      if (!date){
        showNotification({
          title: "Error",
          message: "Sorry! Date is required.",
          color: "red",
        });
        return;
      }

      
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/leases/terminate/${itemId}`;
  
  
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
                date,
                reason,
                inspection,
                deposit,
                refunded,
                refund_deposit: refundDeposit,
            }),
          });
  
          if (!response.ok) {
              throw new Error(`Failed to store: ${response.statusText}`);
          }
  
          setIsSubmitting(false);
  
          showNotification({
              title: "Success",
              message: "Lease Termination Successfull",
              color: "green",
          });
  
          setDate("");
          setReason("");
          setInspection("");
          setOpened(false);
          const params = {};
          params["accessToken"] = session?.user?.accessToken;
          store.dispatch(getLeases(params));
          
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
          title={`Terminate Lease #${item?.code}`}
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
  
            <TextInput
              placeholder="Termination Date"
              label="Termination Date"
              withAsterisk
              type="date"
              value={date}
              onChange={(e) => setDate(e.currentTarget.value)}
            />

            <TextInput
              placeholder="Deposit Paid"
              label="Deposit Paid"             
              value={item?.deposit}
              onChange={(e) => setDeposit(e.currentTarget.value)}
            />

          <Select
              placeholder="Refund Deposit"
              label="Refund Deposit"
              value={refundDeposit}
              onChange={setRefundDeposit}
              data={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              searchable
              clearable
            />

            {refundDeposit === "Yes" && (
            <TextInput
              placeholder="Deposit Amount Refunded"
              label="Amount Refunded"             
              defaultValue={item?.deposit}
              onChange={(e) => setRefunded(e.currentTarget.value)}
            />

            )}

            <Textarea 
                placeholder="Enter termination reason"
                label="Enter termination reason"
                value={reason}
                onChange={(e) => setReason(e.currentTarget.value)}
            />

            <Textarea 
                placeholder="Enter Inspection Report Details"
                label="Inspection Report Details"
                value={inspection}
                onChange={(e) => setInspection(e.currentTarget.value)}
            />
          </section>
  
          <section className="flex justify-end space-y-2 bg-light mt-5 p-3 rounded-lg my-3">
            <Button mt="md" onClick={submitDetails} loading={isSubmitting}>
              Terminate Lease
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconBan size={16} />}
          onClick={() => setOpened(true)}
          variant="filled"
          size="xs"
          color="red"
        >
          Terminate
        </Button>
      </>
    );
  }
  
  export default TerminateLeaseModal;
  