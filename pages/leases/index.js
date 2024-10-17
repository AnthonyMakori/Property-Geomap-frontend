import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Badge, Menu} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconChevronDown, IconCircleCheck, IconEdit, IconEye, IconPencil, IconPlus, IconPrinter, IconTrash} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { getLeases } from "@/store/properties/buildings/buildings-slice";
import { debounce } from 'lodash'; // Import debounce from lodash
import { showNotification } from '@mantine/notifications';
import { useSession } from "next-auth/react";
import TerminateLeaseModal from '../../components/Lease/terminate-lease-modal';

function Leases() {
  const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pdfLoading, setPdfLoading] = useState({});
  
    const leasesStatus = useSelector((state) => state.buildings.getLeasesStatus);
    const leases = useSelector((state) => state.buildings.getLeases);
  
    const isLoading = leasesStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};
        params["accessToken"] = session.user.accessToken;

        
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getLeases(params));
    }, [debouncedSearchTerm, session, status]);
  
    console.log('data monyancha', leases);
  
    function onPaginationLinkClicked(page) {
      if (!page || !session) {
        return;
    }
  
      const params = {};
      params['page'] = page;
      params["accessToken"] = session.user.accessToken;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getLeases(params));
    }
  
    console.log('Search Term Here', debouncedSearchTerm);
  
    // Debounce the search term input
    const debouncedSearch = debounce((value) => setDebouncedSearchTerm(value), 500);
  
    const handleSearchTermChange = (e) => {
      const { value } = e.target;
      setSearchTerm(value);
      debouncedSearch(value); // Debounced search term
    };

    const download = async (itemId) => {
        // Set loading state to true for the clicked item
        setPdfLoading((prevPdfLoading) => ({
          ...prevPdfLoading,
          [itemId]: true,
        }));
    
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const endpoint = `${API_URL}/leases/download/${itemId}`;
    
        const accessToken = session.user.accessToken;
    
        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: "GET",
          // Tell the server we're sending JSON.
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        };
    
        //Fix Naming Start Here
        const response = await fetch(endpoint, options);
    
        if (!response.ok) {
          throw { message: "failure" };
        }
    
        const filenameHeader = response.headers.get('Content-Disposition');
        const filename = filenameHeader ? filenameHeader.split('filename=')[1] : 'Invoice.pdf';
    
        const result = await response.blob();
    
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(result);
        a.innerHTML = filename; // Set the actual filename here
        a.target = "_blank";
        a.click();
        //End Here
    
        console.log(response);
    
        if (response.status === 200) {
          showNotification({
            title: "Success",
            message: "Download Successful",
            color: "green",
          });
          setPdfLoading((prevPdfLoading) => ({
            ...prevPdfLoading,
            [itemId]: false,
          }));
        } else {
          showNotification({
            title: "Error",
            message: "Sorry! " + result.message,
            color: "red",
          });
          setPdfLoading((prevPdfLoading) => ({
            ...prevPdfLoading,
            [itemId]: false,
          }));
        }
        setPdfLoading((prevPdfLoading) => ({
          ...prevPdfLoading,
          [itemId]: false,
        }));
      };

    //Terminate Lease
    const terminateLease = async (e) => {
      e.preventDefault();

      if (!building) {
          showNotification({
              title: "Error",
              message: "Select a Building first!",
              color: "red",
          });
          return;
      }


      setIsSubmitting(true);

      const accessToken = session.user.accessToken;

      try {
          const response = await fetch(`${API_URL}/leases/store`, {
              method: 'POST',
              headers: {
                  Authorization: `Bearer ${accessToken} `,
                  Accept: "application/json",
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  building_id: building,
                  unit_id: unit,
                  tenant_id: tenant,
                  amount: amount,
                  start_date: formattedStartDate,
                  due: dueOn,
                  deposit: deposit,
                  processing_fee: processingFee,
                  service_fee: serviceFee,
                  penalty: penalty,
                  grace_period: gracePeriod,
                  generate_on: generateOn,
                  total: total,
                  terms,
                  tenant_sign: tenantSign,
                  landloard_sign: landloardSign,
              }),
          });

          if (!response.ok) {
              throw new Error(`Failed : ${response.statusText}`);
          }

          setIsSubmitting(false);

          showNotification({
              title: "Success",
              message: "Lease created Successfully",
              color: "green",
          });

          // Assuming the login was successful, you can proceed to navigate to the dashboard.
          await router.push('/leases');
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
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                    <Flex
                                align="center"
                                justify="space-between"
                                direction={{base: 'row', sm: 'row'}}
                                gap={{base: 'sm', sm: 4}}
                            >
                                <Stack>
                                    <Title order={3}>Leases</Title>
                                </Stack>
                                <Link href="/leases/create">
                                <Button leftIcon={<IconPlus size={18}/>}>New Lease</Button>
                                </Link>
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Leases</Text>
                                <TextInput
                                    label="Search"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>Lease No.</th>
                                {/* <th>Building</th> */}
                                <th>Unit Code</th>
                                <th>Unit</th>
                                <th>Tenant</th>
                                <th>Rent</th>
                                {/* <th>Deposit</th> */}
                                {/* <th>Processing Fee</th> */}
                                {/* <th>Service Fee</th> */}
                                {/* <th>Penalty Fee</th> */}
                                {/* <th>Start Date</th> */}
                                <th>Last Billing</th>
                                <th>Due</th>
                                <th>Status</th>
                                {/* <th>Date</th> */}
                                <th>Action</th>
                                <th>Terminate</th>
                                </tr>
                            </thead>
                            <tbody>
                            {leases?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.code }</td>
                            {/* <td>{ item?.building?.name ?? '-' }</td> */}
                            <td>{item?.unit?.code ?? "-"}</td>
                            <td>{item?.unit?.name ?? "-"}</td>
                            <td>{item?.tenant?.name ?? "-"}</td>
                            <td>Ksh. {item?.amount ?? "-"}</td>
                            {/* <td>Ksh. {item?.deposit ?? "-"}</td> */}
                            {/* <td>Ksh. {item?.processing_fee ?? "-"}</td> */}
                            {/* <td>Ksh. {item?.service_fee ?? "-"}</td> */}
                            {/* <td>Ksh. {item?.penalty ?? "-"}</td> */}
                            {/* <td>{new Date(item?.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td> */}
                            <td>{new Date(item?.last_billing).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                            <td>{item?.due ?? "-"}</td>
                            <td>
                            {item?.status === "Active" 
                            ? <Badge color="green" variant="filled" radius="sm">Active</Badge> 
                            : <Badge color="red" variant="filled" radius="sm">Terminated</Badge>
                            }
                            </td>
                            
                            {/* <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td> */}

                            <td>
                                <Menu
                                    shadow="md"
                                    width={200}
                                    position="bottom-end"
                                    variant="outline"
                                >
                                    <Menu.Target>
                                    <Button
                                        rightIcon={<IconChevronDown size={14} />}
                                        size="xs"
                                    >
                                        Actions
                                    </Button>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                    <Menu.Label>#{item?.id}</Menu.Label>
                                    {/* <Link href={`/askaris/revenue/rentals/${item?.id}`}>
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconEye size={15} />}
                                        >
                                        View
                                        </Menu.Item>
                                    </Link> */}

                                    <Link
                                        href={`/leases/edit/${item?.id}`}
                                    >
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconPencil size={15} />}
                                        >
                                        Edit
                                        </Menu.Item>
                                    </Link>
                                    <Menu.Item
                                        color="blue"
                                        icon={<IconPrinter size={15} />}
                                        loading={pdfLoading[item.id]} 
                                        onClick={() => download(item?.id)}
                                        >
                                        Download
                                    </Menu.Item>
                                        <Menu.Item
                                            icon={<IconTrash size={15} />}                                           
                                            color="red"
                                        >
                                        Delete
                                    </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                                
                            </td>
                            <td>
                              {item?.status === "Active" 
                            ? <TerminateLeaseModal item={item} /> 
                            : <Button leftIcon={<IconCircleCheck size={16} />}
                            onClick={() => setOpened(true)}
                            variant="filled"
                            size="xs"
                            color="yellow">Terminated</Button>
                            }
                            </td>
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={leases}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Leases;
