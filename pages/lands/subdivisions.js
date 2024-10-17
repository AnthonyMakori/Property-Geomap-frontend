import React, {SyntheticEvent, useState} from 'react';
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Badge, Menu} from "@mantine/core";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPrinter, IconCurrencyDollar, IconShare, IconPlus, IconChartPie, IconTrash, IconMoneybag, IconArrowBack, IconDownload} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { getPlots } from "@/store/properties/buildings/buildings-slice";
import AddLandModal from '../../components/lands/add-land-modal';
import { formatNumber, formatDate } from "@/lib/shared/data-formatters";
import { IconChevronDown } from '@tabler/icons-react';
import GeneratePlotsModal from '../../components/lands/generate-plots';
import { useRouter } from 'next/router';
import SellPlotModal from '../../components/lands/sell-plot-modal';

function LandSubdivisions() {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const landId = router.query?.landId ?? null;

    const itemsStatus = useSelector((state) => state.buildings.getPlotsStatus);
    const items = useSelector((state) => state.buildings.getPlots);
  
    const isLoading = itemsStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};
        params["accessToken"] = session.user.accessToken;

        if (landId) {
            params['landId'] = landId;
          }
  
      if (searchTerm) {
        params['filter'] = searchTerm;
      }
  
      store.dispatch(getPlots(params));
    }, [searchTerm, landId, session, status]);
  
    console.log('data monyancha', items);
  
    function onPaginationLinkClicked(page) {
      if (!page || !session) {
        return;
    }
  
      const params = {};
      params['page'] = page;
      params["accessToken"] = session.user.accessToken;
      if (landId) {
        params['landId'] = landId;
      }
      if (searchTerm) {
        params['filter'] = searchTerm;
      }
  
      store.dispatch(getPlots(params));
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
                                    <Link href="/lands">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                                </Stack>
                                <GeneratePlotsModal landId={landId} />
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Land Subdivisions</Text>
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
                                <th>Land Reg. ID</th>
                                <th>Plot No.</th>
                                <th>Size(Acres)</th>  
                                {/* <th>Dimensions</th>                               */}
                                <th>Selling P.(KES)</th>
                                {/* <th>Acquired Date</th> */}
                                <th>Location</th> 
                                <th>Status</th> 
                                {/* <th>City</th>  */}
                                <th>Created On</th> 
                
                                <th className='text-right'>Actions</th> 
                                </tr>
                            </thead>
                            <tbody>
                            {items?.plots?.data?.map((item) => (
                            <tr key={item?.id} >
                            {/* <td>{ item?.id }</td> */}
                            <td>{ item?.land?.reg_id ?? '' }</td>
                            <td>{item?.number ?? "-"}</td>
                            {/* <td>{item?.owner?.name ?? "-"}</td> 
                            <td>{item?.owner?.phone ?? "-"}</td>   */}
                            <td>{item?.size ?? "0"}</td>
                            {/* <td>{item?.dimensions ?? "0"}</td> */}
                            <td>Ksh. {formatNumber(item?.price) ?? "0"}</td>
                            {/* <td>{formatDate(item?.acquired_date) ?? "-"}</td> */}
                            <td>{item?.land?.location ?? "-"}</td>
                            {/* <td>{item?.city ?? "-"}</td> */}
                            <td>
                            {item?.status === "Sold" 
                            ? <Badge color="red" variant="filled" radius="sm">Sold Out</Badge>
                            : <Badge color="green" variant="filled" radius="sm">Available</Badge> 
                            }
                            </td>
                            <td>{formatDate(item?.created_at) ?? "-"}</td>  
                            <td>
                            <SellPlotModal item={item} />
                            
                            </td>  
                                                                          
                            </tr>
                             ))}

                             <tr className="text-lg">
                              <th
                                scope="row"
                                colSpan="3"
                                className="text-primary font-bold"
                              >
                                PLOTS VALUE
                              </th>
                              <td className="text-dark tracking-wider text-xxl font-bold">
                                Ksh. {formatNumber(items?.total) ?? 0}
                              </td>
                            </tr>
                            <tr className="text-lg">
                              <th
                                scope="row"
                                colSpan="3"
                                className="text-primary font-bold"
                              >
                                LAND VALUE
                              </th>
                              <td className="text-dark tracking-wider text-xxl font-bold">
                                Ksh. {formatNumber(items?.land_value) ?? 0}
                              </td>
                            </tr>
                            <tr className="text-lg">
                            <th
                                scope="row"
                                colSpan="3"
                                className="text-primary font-bold"
                            >
                                EXPECTED VALUE
                            </th>
                            <td className={`text-xxl font-bold ${items?.profits < 0 ? 'text-red-500' : 'text-lime-700'}`}>
                                Ksh. {formatNumber(Math.abs(items?.profits) ?? 0)} {items?.profits < 0 ? 'LOSS' : 'PROFIT'}
                            </td>
                            </tr>

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={items?.plots}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default LandSubdivisions;
