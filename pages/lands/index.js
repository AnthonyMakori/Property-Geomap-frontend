import React, {SyntheticEvent, useState} from 'react';
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Badge, Menu} from "@mantine/core";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPrinter, IconCurrencyDollar, IconShare, IconPlus, IconChartPie, IconTrash} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { getLands } from "@/store/properties/buildings/buildings-slice";
import AddLandModal from '../../components/lands/add-land-modal';
import { formatNumber, formatDate } from "@/lib/shared/data-formatters";
import { IconChevronDown } from '@tabler/icons-react';

function Lands() {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');

    const itemsStatus = useSelector((state) => state.buildings.getLandsStatus);
    const items = useSelector((state) => state.buildings.getLands);
  
    const isLoading = itemsStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};
        params["accessToken"] = session.user.accessToken;

  
      if (searchTerm) {
        params['filter'] = searchTerm;
      }
  
      store.dispatch(getLands(params));
    }, [searchTerm, session, status]);
  
    console.log('data Anthony', items);
  
    function onPaginationLinkClicked(page) {
      if (!page || !session) {
        return;
    }
  
      const params = {};
      params['page'] = page;
      params["accessToken"] = session.user.accessToken;
  
      if (searchTerm) {
        params['filter'] = searchTerm;
      }
  
      store.dispatch(getLands(params));
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
                                    <Title order={3}>Manage Lands</Title>
                                </Stack>
                                <AddLandModal />
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}></Text>
                                <TextInput
                                    label="Search"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.currentTarget.value)}
                                />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                {/* <th>No.</th> */}
                                <th>Reg. ID</th>
                                <th>Land ID</th>
                                <th>Owner</th>                               
                                <th>Phone No.</th>
                                <th>Size(Acres)</th>  
                                {/* <th>Dimensions</th>                               */}
                                <th>Buying P.(KES)</th>
                                {/* <th>Acquired Date</th> */}
                                <th>Location</th> 
                                {/* <th>City</th>  */}
                                <th>Created On</th> 
                                <th className='text-right'>Actions</th> 
                                </tr>
                            </thead>
                            <tbody>
                            {items?.lands?.data?.map((item) => (
                            <tr key={item?.id} >
                            {/* <td>{ item?.id }</td> */}
                            <td>{ item?.reg_id ?? '' }</td>
                            <td>{item?.land_id ?? "-"}</td>
                            <td>{item?.owner?.name ?? "-"}</td> 
                            <td>{item?.owner?.phone ?? "-"}</td>  
                            <td>{item?.size ?? "0"}</td>
                            {/* <td>{item?.dimensions ?? "0"}</td> */}
                            <td>Ksh. {formatNumber(item?.price) ?? "0"}</td>
                            {/* <td>{formatDate(item?.acquired_date) ?? "-"}</td> */}
                            <td>{item?.location ?? "-"}</td>
                            {/* <td>{item?.city ?? "-"}</td> */}
                            <td>{formatDate(item?.created_at) ?? "-"}</td>  
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
                                    {/* <Link
                                        href={`#`}
                                    >
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconEdit size={15} />}
                                        >
                                        Edit
                                        </Menu.Item>
                                    </Link> */}
                                    <Link
                                        href={`/lands/subdivisions?landId=${item?.id}`}
                                    >
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconChartPie size={15} />}
                                        >
                                        Subdivisions
                                        </Menu.Item>
                                    </Link>
                                    {item?.documents?.length > 0 && (
                                    <Link
                                        href={`/lands/documents/${item?.id}`}
                                    >
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconEye size={15} />}
                                        >
                                        View Documents
                                        </Menu.Item>
                                    </Link>  
                                    )}                                 
                                    {/* <Menu.Item
                                        icon={<IconTrash size={15} />}
                                        // onClick={() => {
                                        // setDeleteModalOpen(true);
                                        // setCurrentStaff(item);
                                        // }}
                                        color="red"
                                    >
                                        Delete
                                    </Menu.Item> */}
                                    </Menu.Dropdown>
                                </Menu>
                            </td>                                                                             
                            </tr>
                             ))}

                             <tr className="text-lg">
                              <th
                                scope="row"
                                colSpan="5"
                                className="text-primary font-bold"
                              >
                                TOTAL LANDS VALUE
                              </th>
                              <td className="text-dark tracking-wider text-xxl font-bold">
                                Ksh. {formatNumber(items?.total) ?? 0}
                              </td>
                            </tr>

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={items?.lands}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Lands;
