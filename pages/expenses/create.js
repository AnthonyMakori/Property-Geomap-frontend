import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";
import { showNotification } from "@mantine/notifications";
import store from "@/store/store";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Select,
  TextInput,
  Group,
  Textarea,
  Badge,
  Text,
  Flex,
  Stack,
  Title,
} from "@mantine/core";
import { DateInput, DatePicker } from "@mantine/dates";
import { IconArrowBack, IconCalendar } from "@tabler/icons-react";
import { IconTrash, IconCircleCheck } from "@tabler/icons-react";
// import { getExpenseTypes } from "@/store/accounts/acounts-slice";
import {AppLayout} from "@/layout";
import { getUnits } from "@/store/properties/buildings/buildings-slice";
import { ActionIcon } from '@mantine/core';
import Link from "next/link";
import CreateExpenseTypeModal from "../../components/Invoices/expense-type-modal";
import { getExpenseTypes } from "@/store/accounts/accounts-slice";
import { useSession } from "next-auth/react";

function CreateExpense() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [unit, setUnit] = useState("");
  const [expenseType, setExpenseType] = useState("General Expense");

  const types = useSelector(
    (state) => state.accounts.getExpenseTypes
  );

  useEffect(() => {  
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getExpenseTypes(params));
  }, [session, status]);

  console.log("Expense Types Enock", types);

  const expenseTypeList = 
  types?.map((item) => ({
    value: item?.title,
    label: item?.title,
  })) ?? [];

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
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getUnits(params));
  }, [session, status]);

  console.log("Units data monyancha", units);

  const unitsList =
  units?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  })) ?? [];

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  //UseStates
  const [items, setItems] = useState([
    { product: "", description: "", quantity: 1, price: "", tax: "" },
  ]);
  const [posNumber, setPosNumber] = useState("");
  const [description, setDescription] = useState("");
  const [signature, setSignature] = useState("");
  const [estimateDate, setEstimateDate] = useState("");

  function handleItemChange(index, key, value) {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  }

  function handleAddItem() {
    setItems((prevItems) => [
      ...prevItems,
      { product: "", description: "", quantity: 1, price: "", tax: "" },
    ]);
  }

  function handleRemoveItem(index) {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  }

  function clearForm() {
    setPosNumber("");
    setDescription("");
    setSignature("");
    setEstimateDate("");
    // setItems("");
  }

  const dateObj = new Date(estimateDate);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  const formattedEstimateDate = `${year}-${month}-${day}`;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    const formdata = new FormData();
    formdata.append("type", expenseType);
    formdata.append("unit_id", unit);
    formdata.append("description", description);
    formdata.append("signature", signature);
    formdata.append("expense_date", formattedEstimateDate);
    formdata.append("payment_method", paymentMethod);
    items.forEach((item) => {
      formdata.append("name[]", item.product);
      formdata.append("name_description[]", item.description);
      formdata.append("quantity[]", item.quantity ?? 1);
      formdata.append("price[]", item.price);
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/store-expense`;

    const accessToken = session.user.accessToken;

    const response = fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken} `,
        Accept: "application/json",
      },
      body: formdata,
    }).then(async (response) => {
      const data = await response.json();
      console.log("Response Data", data);
      console.log(response);

      if (response?.status !== 422 && response?.status === 201) {
        showNotification({
          title: "Success",
          message: "Expense created Successfully",
          color: "green",
        });
        setLoading(false);
        router.push("/expenses");
        clearForm();
      } else {
        // error occurred
        let message = "";
        for (let field in data.errors) {
          message += data.errors[field][0] + ", ";
        }
        message = message.slice(0, -2); // remove last comma and space
        showNotification({
          title: "Error",
          message: message + response?.statusText,
          color: "red",
        });

        setLoading(false);
      }
    });
    setLoading(false);
  };


    //Calculations
    const TAX_PERCENTAGE = 0;

    const calculateTotal = () => {
      let totalTax = 0;
      let totalPrice = 0;
  
      items.forEach((item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemTax = parseFloat(item.tax) || 0;
        const itemQuantity = parseInt(item.quantity) || 1; // Default quantity is 1
  
        const itemTotalPrice = itemPrice * itemQuantity;
        const itemTotalTax = itemTax
          ? (itemTotalPrice * itemTax) / 100
          : (itemTotalPrice * TAX_PERCENTAGE) / 100;
  
        totalPrice += itemTotalPrice;
        totalTax += itemTotalTax;
      });
  
      totalPrice += totalTax;
  
      return { totalTax, totalPrice };
    };
  
    const { totalTax, totalPrice } = calculateTotal();


  return (
<AppLayout m={5}>
<Flex
                                align="center"
                                justify="space-between"
                                direction={{base: 'row', sm: 'row'}}
                                gap={{base: 'sm', sm: 4}}
                            >
                                <Stack>
                                    <Title order={3}>Add Expense</Title>
                                </Stack>
                                <Link href="/expenses">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
      <main className="w-full flex-grow mt-4" >
        <div className="w-full mt-0">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-2">
                <h2>Create Expense</h2>
                <p className="mt-1 text-sm text-gray-500">
                  You can create a new expense type or select from the existing
                  expense types.
                </p>
              </div>
              <div className="mt-3 md:mt-0 md:col-span-1">
                <div className="grid grid-cols-12">
                <div className="col-span-12">
                <Select
                placeholder="Expense Type"
                label="Expense Type"
                value={expenseType}
                onChange={setExpenseType}
                data={[
                  { value: "General Expense", label: "General Expense" },
                  { value: "Unit Expense", label: "Unit Expense" },
                ]}
                searchable
                clearable
              />
                  </div>
                  {expenseType === "Unit Expense" && (
                    <div className="col-span-12">
                    <Select
                        className="w-full sm:w-auto"
                        label="Assign a Unit"
                        placeholder="Select Unit"
                        searchable
                        clearable
                        data={unitsList}
                        onChange={setUnit}
                      />
                      </div>
                  )}
                
                  <div className="col-span-12">
                    <DateInput
                      placeholder="Expense Date"
                      label="Expense Date"
                      icon={<IconCalendar size={16} />}
                      onChange={setEstimateDate}
                    />
                  </div>

                  <div className="col-span-12">
                    <Select
                      placeholder="Payment Method"
                      label="Payment Method"
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                      data={[
                        { value: "Mpesa", label: "M-Pesa" },
                        { value: "Cash", label: "Cash" },
                        { value: "Visa", label: "Visa/Mastercard" },
                        { value: "Credit", label: "Credit" },
                        { value: "Cheque", label: "Cheque" },
                        { value: "Bank Transfer", label: "Bank Transfer" },
                      ]}
                      searchable
                      clearable
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mt-2">
            <div className="md:grid md:grid-cols-2 md:gap-6">
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-12">
                  <div className="col-span-12">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Items
                    </h3>
                    <label
                      htmlFor="expense_items_tax.0"
                      className="block text-sm font-medium text-gray-700 text-left"
                    >
                      <CreateExpenseTypeModal />
                    </label>
                  </div>
                  <div id="estimate_items" className="col-span-12">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                      className="mt-2 add-input"
                    ></div>
                  </div>
                  <div className="col-span-12 flex flex-col space-y-2">
                    {items.map((item, index) => (
                      <Group  key={index} spacing="md">
                        <Select
                          className="w-full sm:w-auto"
                          placeholder="Expense Type"
                          searchable
                          clearable
                          creatable

                          data={expenseTypeList}
                          value={item.product}
                          onChange={(value) =>
                            handleItemChange(index, "product", value)
                          }
                        />

                        <TextInput
                          className="w-full sm:w-auto"
                          placeholder="Description"
                          value={item.description}
                          onChange={(event) =>
                            handleItemChange(
                              index,
                              "description",
                              event.currentTarget.value
                            )
                          }
                        />
                        <TextInput
                          className="w-full sm:w-auto"
                          placeholder="Quantity"
                          defaultValue={1}
                          value={item.quantity}
                          onChange={(event) =>
                            handleItemChange(
                              index,
                              "quantity",
                              event.currentTarget.value
                            )
                          }
                        />
                        <TextInput
                          className="w-full sm:w-auto"
                          placeholder="Price"
                          value={item.price}
                          onChange={(event) =>
                            handleItemChange(
                              index,
                              "price",
                              event.currentTarget.value
                            )
                          }
                        />
                        <ActionIcon size="lg" color="red" variant="filled" aria-label="Settings" onClick={() => handleRemoveItem(index)}>
                          <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                      </Group>
                    ))}
                    <Group position="left" className="mb-5 mt-5">
                      <Button
                        variant="outline"
                        color="primary"
                        onClick={handleAddItem}
                        leftIcon={<Text size="sm">+</Text>}
                      >
                        Add Item
                      </Button>
                      {items.length > 0 && (
                        <>
                          <Badge variant="filled" color="primary">
                            {items.length} expense{items.length > 1 ? "s" : ""}
                          </Badge>
                        </>
                      )}
                    </Group>
                  </div>
                  <div className="col-span-12">
                    <Textarea
                      placeholder="Notes"
                      label="Notes"
                      minRows={3}
                      autosize
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </div>

                  <div className="col-span-12">
                    <Textarea
                      placeholder="Signature"
                      label="Signature"
                      minRows={3}
                      autosize
                      onChange={(event) => setSignature(event.target.value)}
                    />
                  </div>

                  <div className="col-span-12">
                    <div className="px-4 py-3  text-right sm:px-6">
                      <h3 className="text-lg mt-2 font-medium leading-6 text-gray-900">
                        Total KSH{" "}
                        <span name="temp_total_amount">
                          {" "}
                          {totalPrice.toFixed(2)}{" "}
                        </span>
                      </h3>
                      {/* <PreviewQuotationModal
                        description={description}
                        signature={signature}
                        totalTax={totalTax}
                        totalPrice={totalPrice}
                        merchant={merchant}
                        due={estimateDate}
                        po={posNumber}
                        items={items}
                      /> */}
                      <Button
                        className=" mt-2"
                        onClick={handleSubmit}
                        leftIcon={<IconCircleCheck size={16} />}
                        loading={loading}
                      >
                        Create Expense
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </AppLayout>

  );
}

export default CreateExpense;
