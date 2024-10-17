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
  import { IconPlus, IconTrash } from "@tabler/icons-react";
  import { useState, useEffect } from "react";
  import { useSelector } from "react-redux";
  import { showNotification } from "@mantine/notifications";
  import store from "@/store/store";
  import { getLands } from "@/store/properties/buildings/buildings-slice";
  import { getOwners } from '@/store/users/users-slice';
import { getTaxes } from "../../store/settings/settings-slice";

  function AddLandModal({ clients }) {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState("");
    const [regId, setRegId] = useState("");
    const [landId, setLandId] = useState("");
    const [contactId, setContact] = useState("");
    const [price, setPrice] = useState("");
    const [acquiredDate, setAcquiredDate] = useState("");
    const [location, setLocation] = useState("");
    const [city, setCity] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [tax, setTax] = useState("");
    const [taxType, setTaxType] = useState("");


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
    setSize("");
    setRegId("");
    setLandId("");
    setContact("");
    setPrice("");
    setAcquiredDate("");
    setLocation("");
    setCity("");
    setDimensions("");
    setTax("");
    setTaxType("");
    setDocuments([]);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate other form fields if needed
    if (!regId) {
      showNotification({
        title: "Error",
        message: "Land Registration ID is required! ",
        color: "red",
      });
      return;
    }
  
    // Form data for other fields
    const data = {
      size,
      regId,
      landId,
      contactId,
      price,
      acquiredDate,
      location,
      city,
      dimensions,
      tax,
      taxType,
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
    const endpoint = `${API_URL}/lands/store-land`;
  
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
          message: "Land created successfully!",
          color: "green",
        });
        clearForm();
        setLoading(false);
        setOpened(false);
        const params = {};
        params["accessToken"] = accessToken;
        store.dispatch(getLands(params));
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
    const owners = useSelector((state) => state.users.getOwners);

    useEffect(() => {
        if (!session || status !== "authenticated") {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;
    
        store.dispatch(getOwners(params));
    }, [session]);

    console.log("Monyancha Owners", owners);

    const ownersList =
    owners?.data?.map((item) => ({
      value: item.id,
      label: item.name,
    })) ?? [];
    ///

  
    return (
      <>
        <Modal
          opened={opened}
          title="Add Land"
          onClose={() => setOpened(false)}
          padding="md"
          overflow="hidden"
          size="lg"
        >
          <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
                
                <TextInput
                placeholder="Registration ID"
                label="Registration ID"
                value={regId}
                onChange={(e) => setRegId(e.currentTarget.value)}
                />
                <TextInput
                placeholder="Land ID"
                label="Land ID"
                value={landId}
                onChange={(e) => setLandId(e.currentTarget.value)}
                />
                <Select
                label="Owner"
                placeholder="Owner"
                value={contactId}
                onChange={setContact}
                data={ownersList}
                searchable
                clearable
                size="sm"
                sx={{ flex: 1 }}
                className="w-full sm:w-auto"
            />

              <TextInput
                placeholder="Buying Price(KES)"
                label="Buying Price(KES)"
                value={price}
                onChange={(e) => setPrice(e.currentTarget.value)}
                />

                <TextInput
                placeholder="Acquired Date"
                label="Acquired Date"
                type="date"
                value={acquiredDate}
                onChange={(e) => setAcquiredDate(e.currentTarget.value)}
                />
                <TextInput
                placeholder="Location"
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.currentTarget.value)}
                />
                {/* <TextInput
                placeholder="City"
                label="City"
                value={city}
                onChange={(e) => setCity(e.currentTarget.value)}
                /> */}
                <TextInput
                placeholder="Size(Acres)"
                label="Size(Acres)"
                value={size}
                onChange={(e) => setSize(e.currentTarget.value)}
                />
                <TextInput
                placeholder="Dimensions eg. 50mx100m"
                label="Dimensions"
                value={dimensions}
                onChange={(e) => setDimensions(e.currentTarget.value)}
                />
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
              Add Land
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconPlus size={16} />}
          onClick={() => setOpened(true)}
          variant="outline"
          size="xs"
        >
          Add Land
        </Button>
      </>
    );
  }
  
  export default AddLandModal;
  