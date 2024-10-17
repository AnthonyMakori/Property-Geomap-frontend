import {
    Modal,
    Button,
    TextInput,
    Select,
    Textarea,
    PasswordInput,
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
  import { getStaff } from "@/store/users/users-slice";
  
  function AddSupplierModal({ item }) {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
  
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const [isSubmitting, setIsSubmitting] = useState("");
  
    const submitDetails = async (e) => {
      e.preventDefault();
  
      if(!name){
        showNotification({
            title: "Error",
            message: "Name is required!",
            color: "red",
        });
        return;
    }

    if(password != confirmPassword){
        showNotification({
            title: "Error",
            message: "Password does not match!",
            color: "red",
        });
        return;
    }
  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/users/store-staff`;
  
  
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
                name,     
                email,
                phone,
                password   
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
  
          setName("");
          setOpened(false);
          const params = {};
          params["accessToken"] = session.user.accessToken;
          store.dispatch(getStaff(params));
          
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
          title="Add Supplier"
          onClose={() => setOpened(false)}
          padding="xs"
          overflow="inside"
        >
          <section className="flex flex-col space-y-2 bg-light p-3 rounded-lg">
  
          <TextInput
              placeholder="Name"
              label="Name"
              withAsterisk
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <TextInput
              placeholder="Email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <TextInput
              placeholder="Phone No."
              label="Phone No."
              value={phone}
              onChange={(e) => setPhone(e.currentTarget.value)}
            />
        
          </section>
  
          <section className="flex justify-end space-y-2 bg-light mt-5 p-3 rounded-lg my-3">
            <Button mt="md" onClick={submitDetails} loading={isSubmitting}>
            Add Supplier
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
          Add Supplier
        </Button>
      </>
    );
  }
  
  export default AddSupplierModal;
  