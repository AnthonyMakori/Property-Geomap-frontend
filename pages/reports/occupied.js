import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Badge, Menu} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconChevronDown, IconEdit, IconEye, IconPdf, IconPencil, IconPlus, IconPrinter, IconTrash} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { getLeases } from "@/store/properties/buildings/buildings-slice";
import { debounce } from 'lodash'; // Import debounce from lodash
import { showNotification } from '@mantine/notifications';
import { getOccupiedUnits } from "@/store/reports/reports-slice";
import { useSession } from "next-auth/react";

function OccupiedUnits() {
  const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pdfLoading, setPdfLoading] = useState({});
  
    const occupiedUnitsStatus = useSelector((state) => state.reports.getOccupiedUnitsStatus);
    const occupiedUnits = useSelector((state) => state.reports.getOccupiedUnits);
  
    const isLoading = occupiedUnitsStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getOccupiedUnits(params));
    }, [debouncedSearchTerm, session, status]);
  
    console.log('data monyancha', occupiedUnits);
  
    function onPaginationLinkClicked(page) {
      if (!session || !page) {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;
        params['page'] = page;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getOccupiedUnits(params));
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
                                    <Title order={3}>Occupied Units Report</Title>
                                </Stack>
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Total Units: {occupiedUnits?.total ?? 0}</Text>
                                
                                <Group justify="flex-end">
                                <TextInput
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                />
                                <Select
                                        placeholder="Filter by Building"
                                        searchable
                                        clearable
                                        data={[
                                            { value: 'Ridge Apartments', label: 'Ridge Apartments' },
                                            { value: 'Eden Palace', label: 'Eden Palace' },
                                            { value: 'Test building', label: 'Test building' },
                                        ]}
                                />
                                <Select
                                        placeholder="Filter by Type"
                                        searchable
                                        clearable
                                        data={[
                                            { value: 'Studio', label: 'Studio' },
                                            { value: 'Bedsitter', label: 'Bedsitter' },
                                            { value: 'One Bedroom', label: 'One Bedroom' },
                                            { value: 'Two Bedroom', label: 'Two Bedroom' },
                                            { value: 'Three Bedroom', label: 'Three Bedroom' },
                                            { value: 'Four Bedroom', label: 'Four Bedroom' },
                                        ]}
                                />
                                <Button leftIcon={<IconPrinter size={14} />} variant="filled">
                                    Export PDF
                                </Button>
                                </Group>
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>Unit</th>
                                <th>Unit Code</th>
                                <th>Tenant</th>
                                <th>Phone</th>
                                <th>Type</th>
                                <th>Building</th>                                
                                <th>Rent</th>
                                <th>Location</th>
                                </tr>
                            </thead>
                            <tbody>
                            {occupiedUnits?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{item?.name ?? "-"}</td>
                            <td>{item?.code ?? "-"}</td>
                            <td>{item?.tenant?.name ?? "-"}</td>
                            <td>{item?.tenant?.phone ?? "-"}</td>
                            <td>{item?.type?.name ?? "-"}</td>
                            <td>{item?.building?.name ?? "-"}</td>
                            {/* <td>Ksh. {item?.deposit ?? "-"}</td> */}
                            <td>Ksh. {item?.amount ?? "-"}</td>
                            <td>{item?.building?.location ?? "-"}</td>

                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={occupiedUnits}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default OccupiedUnits;
