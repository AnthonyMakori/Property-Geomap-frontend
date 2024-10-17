import {
  Button,
  Modal,
  Textarea,
  TextInput,
  useMantineTheme,
  Select,
  Alert,
  SimpleGrid,
  ActionIcon,
  FileInput,
} from "@mantine/core";
import { useSession } from "next-auth/react";
import { IconMoneybag, IconPlus, IconTrash } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import { getLands } from "@/store/properties/buildings/buildings-slice";
import { getOwners } from "@/store/users/users-slice";
import { getTenants } from "@/store/users/users-slice";
import { getStaff } from "@/store/users/users-slice";
import { useRouter } from "next/router";
import { getPlots } from "@/store/properties/buildings/buildings-slice";
import { getTaxes } from "../../store/settings/settings-slice";
import Link from "next/link";
import AddStaffModal from "../Partners/add-staff-modal";

function SellPlotModal({ item }) {
  const { data: session, status } = useSession();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [staffId, setStaffId] = useState("");
  const [commission, setCommission] = useState("");
  const [plotId, setPlotId] = useState(item?.id);
  const [landId, setLandId] = useState(item?.land_id);
  const [contactId, setContact] = useState("");
  const [price, setPrice] = useState(item?.price ?? "");
  //setInterest
  const [interest, setInterest] = useState("");
  const [duration, setDuration] = useState("");
  const [type, setType] = useState("Cash");
  //
  const [tax, setTax] = useState("");
  const [taxMethod, setTaxMethod] = useState("");


  const [documents, setDocuments] = useState([]);

  const handleDocumentChange = (index, key, value) => {
    const updatedPayments = [...documents];
    updatedPayments[index][key] = value;
    setDocuments(updatedPayments);
  };
  
  const handleAddDocument = () => {
    setDocuments([...documents, { file: null, description: "" }]);
  };
  
  const handleRemoveDocument = (index) => {
    const updatedPayments = [...documents];
    updatedPayments.splice(index, 1);
    setDocuments(updatedPayments);
  };
  

  const clearForm = () => {
    // Clear other form fields if needed
    setStaffId("");
    setCommission("");
    setPlotId("");
    setLandId("");
    setContact("");
    setPrice("");
    setInterest("");
    setType("");
    setDuration("");
    setTax("");
    setTaxMethod("");
    setDocuments([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate other form fields if needed
    if (!contactId) {
      showNotification({
        title: "Error",
        message: "Customer is required! ",
        color: "red",
      });
      return;
    }

    //Initialize tax amount
    let taxAmount = 0;
    let total = parseFloat(price);

    if (interest && type === "Installments") {
      const totalAmount = total * (interest / 100);
      total += totalAmount;
    }

    //Calculate new price with tax
    if (tax && taxMethod) {
      if (taxMethod === "Exclusive") {
        taxAmount = total * (tax / 100);
        total += taxAmount;
      } else {
        if (tax == "16") {
          taxAmount = (0.16 * total) / (0.16 + 1);
          total = total;
        } else {
          taxAmount = total * (tax / 100);
          total = total;
        }
      }
    }

    // Form data for other fields
    const data = {
      staffId,
      commission,
      plotId,
      landId,
      contactId,
      price: total,
      duration,
      type,
      interest,
      tax,
      taxMethod,
      taxAmount,
    };

    // Create FormData for file uploads
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append proof of payments if they are selected
    documents.forEach((document, index) => {
      if (document.file) {
        formData.append(`document[${index}][file]`, document.file);
      }
      formData.append(`document[${index}][description]`, document.description);
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/lands/store-sales`;

    const accessToken = session.user.accessToken;

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    };

    setLoading(true);

    try {
      const response = await fetch(endpoint, options);
      const result = await response.json();

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Plot sell successfull!",
          color: "green",
        });
        clearForm();
        setLoading(false);
        setOpened(false);
        const params = {};
        params["accessToken"] = accessToken;
        if (landId) {
          params["landId"] = landId;
        }
        store.dispatch(getPlots(params));
        //Redirect to sales page
        // router.push('/lands/sales')
        router.push("/invoices");
      } else {
        showNotification({
          title: "Error",
          message: "Sorry! " + result.message,
          color: "red",
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  ///
  const staff = useSelector((state) => state.users.getStaff);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};

    params["accessToken"] = session.user.accessToken;

    store.dispatch(getStaff(params));
  }, [session]);

  console.log("Monyancha Owners", staff);

  const staffList =
    staff?.data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];
  ///

  //Get Users
  const tenants = useSelector((state) => state.users.getTenants);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getTenants(params));
  }, [session, status]);

  const customersList =
    tenants?.data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];
  //Users

  ///
  const taxes = useSelector((state) => state.settings.getTaxes);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};

    params["accessToken"] = session.user.accessToken;

    store.dispatch(getTaxes(params));
  }, [session]);

  const taxesList =
    taxes?.data?.map((item) => ({
      value: item.tax,
      label: item.name,
    })) ?? [];
  ///

  return (
    <>
      <Modal
        opened={opened}
        title={`Generate Invoice #${item?.number}`}
        onClose={() => setOpened(false)}
        padding="md"
        overflow="hidden"
        size="lg"
      >
        <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
          <Select
            label="Client"
            placeholder="Client"
            value={contactId}
            onChange={setContact}
            data={customersList}
            searchable
            clearable
            size="sm"
            sx={{ flex: 1 }}
            className="w-full sm:w-auto"
          />

          <Select
            label="Seller"
            placeholder="Seller"
            value={staffId}
            onChange={setStaffId}
            data={staffList}
            searchable
            clearable
            size="sm"
            sx={{ flex: 1 }}
            className="w-full sm:w-auto"
          />

          <Button size="xs" component="a" href="/askaris/tenants/create" fullWidth variant="outline" >Add Client</Button>

          <AddStaffModal />
          {/* <Button component="a" href="#" fullWidth variant="outline" >Add Seller</Button> */}
  

          <TextInput
            placeholder="Selling Price(KES)"
            label="Selling Price(KES)"
            value={price}
            onChange={(e) => setPrice(e.currentTarget.value)}
          />

          <TextInput
            placeholder="Seller Commission(%)"
            label="Seller Commission(%)"
            value={commission}
            onChange={(e) => setCommission(e.currentTarget.value)}
          />

          <Select
            label="Tax Method"
            placeholder="Tax Method"
            data={[
              { value: "Exclusive", label: "Exclusive" },
              { value: "Inclusive", label: "Inclusive" },
            ]}
            clearable
            value={taxMethod}
            searchable
            onChange={setTaxMethod}
          />

          <Select
            label="Tax"
            placeholder="Tax"
            data={taxesList}
            clearable
            value={tax}
            searchable
            onChange={setTax}
          />

          <Select
            label="Payment Type"
            placeholder="Payment Type"
            data={["Cash", "Installments"]}
            clearable
            value={type}
            searchable
            onChange={setType}
          />

          {type === "Installments" && (
            <>
              <TextInput
                placeholder="Duration(Months)"
                label="Duration(Months)"
                value={duration}
                onChange={(e) => setDuration(e.currentTarget.value)}
              />

              <TextInput
                placeholder="Interest(%)"
                label="Interest(%)"
                value={interest}
                onChange={(e) => setInterest(e.currentTarget.value)}
              />
            </>
          )}
        </SimpleGrid>

        {documents.map((document, index) => (
          <SimpleGrid
          cols={3}
          mt="xl"
          key={index}
          spacing="xs"
        >

          <FileInput
            onChange={(file) => handleDocumentChange(index, "file", file)}
            label="Upload Document"
            placeholder="Upload Document"
          />

          <TextInput
            value={document.description}
            onChange={(e) => handleDocumentChange(index, "description", e.target.value)}
            placeholder="Description"
            label="Description"
          />

        <Button
          mt={25}
          leftIcon={<IconTrash size={18} />}
          variant="outline"
          color="red"
          onClick={() => handleRemoveDocument(index)}
        >
          Remove
        </Button>

        </SimpleGrid>
        ))}
        <Button mt="xs" leftIcon={<IconPlus size={18} />} variant="outline" onClick={handleAddDocument}>
          Add Document
        </Button>


        <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
          <Button onClick={handleSubmit} loading={loading}>
            Generate Invoice
          </Button>
        </section>
      </Modal>

      <Button
        leftIcon={<IconMoneybag size={16} />}
        onClick={() => setOpened(true)}
        variant="outline"
        size="xs"
        disabled={item?.status === "Sold"}
      >
        Invoice
      </Button>
    </>
  );
}

export default SellPlotModal;
