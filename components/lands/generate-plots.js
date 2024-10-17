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
  import { getPlots } from "@/store/properties/buildings/buildings-slice";
  import { getOwners } from "@/store/users/users-slice";
  
  function GeneratePlotsModal({landId}) {
    const { data: session, status } = useSession();
    const [opened, setOpened] = useState(false);
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState("");
    const [plotsNo, setPlotsNo] = useState("");
  
    const clearForm = () => {
      setSize("");
      setPlotsNo("");
    };
  
    const [plots, setPlots] = useState([]);
  
    const addPlotFields = (count) => {
      const newPlots = Array.from({ length: count }, (_, index) => ({
        number: "",
        size: "",
        price: "",
      }));
      setPlots(newPlots);
    };
  
    const handlePlotChange = (index, field, value) => {
      const updatedPlots = [...plots];
      updatedPlots[index][field] = value;
      setPlots(updatedPlots);
    };

    const addMorePlot = () => {
        const newPlot = { number: "", size: "", price: "" };
        setPlots((prevPlots) => [...prevPlots, newPlot]);
        setPlotsNo((prevPlotsNo) => String(Number(prevPlotsNo) + 1));
      };
    
      const removePlot = (index) => {
        const updatedPlots = [...plots];
        updatedPlots.splice(index, 1);
        setPlots(updatedPlots);
        setPlotsNo((prevPlotsNo) => String(Number(prevPlotsNo) - 1));
      };

  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (!plotsNo || plots.length === 0) {
        showNotification({
          title: "Error",
          message: "No. of plots is required!",
          color: "red",
        });
        return;
      }
  

      const data = {
        land_id: landId,
        plots: plots.map((plot) => ({
          number: plot.number,
          size: plot.size,
          price: plot.price,
        })),
      };
    

  
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const endpoint = `${API_URL}/lands/store-plots`;
  
      const accessToken = session.user.accessToken;
  
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
  
      setLoading(true);
  
      try {
        const response = await fetch(endpoint, options);
        const result = await response.json();
  
        if (response.status === 200) {
          showNotification({
            title: "Success",
            message: "Plots generated successfully!",
            color: "green",
          });
          clearForm();
          setLoading(false);
          setOpened(false);
          const params = { accessToken }; // Simplify object creation
          if (landId) {
            params['landId'] = landId;
          }
          store.dispatch(getPlots(params));
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
  
    return (
      <>
        <Modal
          opened={opened}
          title="Generate Plots"
          onClose={() => setOpened(false)}
          padding="md"
          overflow="hidden"
          size="lg"
        >
          <TextInput
            placeholder="No. of Plots"
            label="No. of Plots"
            value={plotsNo}
            onChange={(e) => {
              setPlotsNo(e.currentTarget.value);
              addPlotFields(Number(e.currentTarget.value));
            }}
          />
  
          {plots.map((plot, index) => (
            <>
            <SimpleGrid key={index} cols={4} spacing="xs" mt="md" verticalSpacing="xs">
              <TextInput
                placeholder={`Plot ${index + 1} No.`}
                value={plot.number}
                onChange={(e) => handlePlotChange(index, "number", e.currentTarget.value)}
              />
              <TextInput
                placeholder={`Plot ${index + 1} Size (Acres)`}
                value={plot.size}
                onChange={(e) => handlePlotChange(index, "size", e.currentTarget.value)}
              />
              <TextInput
                placeholder={`Plot ${index + 1} Price (KES)`}
                value={plot.price}
                onChange={(e) => handlePlotChange(index, "price", e.currentTarget.value)}
              />
              <Button
            leftIcon={<IconTrash size={16} />}
            onClick={() => removePlot(index)}
            color="red"
            variant="outline"
          >
            Remove
          </Button>
            </SimpleGrid>
            
          </>
          ))}

        <Button mt="md" leftIcon={<IconPlus size={16} />} onClick={addMorePlot} variant="outline" >
          Add More
        </Button>
  
          <section className="flex justify-end space-y-2 bg-light p-3 rounded-lg my-3">
            <Button onClick={handleSubmit} loading={loading}>
              Generate Plots
            </Button>
          </section>
        </Modal>
  
        <Button
          leftIcon={<IconPlus size={16} />}
          onClick={() => setOpened(true)}
          variant="outline"
          size="xs"
        >
          Generate Plots
        </Button>
      </>
    );
  }
  
  export default GeneratePlotsModal;
  