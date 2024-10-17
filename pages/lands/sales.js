import React, {SyntheticEvent, useState} from 'react';
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Badge, Menu} from "@mantine/core";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPrinter, IconCurrencyDollar, IconShare, IconPlus, IconChartPie, IconTrash, IconMoneybag, IconArrowBack, IconCloud} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { getPlotSales } from "@/store/properties/buildings/buildings-slice";
import AddLandModal from '../../components/lands/add-land-modal';
import { formatNumber, formatDate } from "@/lib/shared/data-formatters";
import { IconChevronDown } from '@tabler/icons-react';
import GeneratePlotsModal from '../../components/lands/generate-plots';
import { useRouter } from 'next/router';
import SellPlotModal from '../../components/lands/sell-plot-modal';

function PlotSales() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const landId = router.query?.landId ?? null;
    const [searchTerm, setSearchTerm] = useState('');

    const itemsStatus = useSelector((state) => state.buildings.getPlotSalesStatus);
    const items = useSelector((state) => state.buildings.getPlotSales);
  
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

      store.dispatch(getPlotSales(params));
    }, [landId, session, status]);
  
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

  
      store.dispatch(getPlotSales(params));
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
                                {/* <GeneratePlotsModal landId={landId} /> */}
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Land Sales</Text>
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
                                <th>Buyer</th>
                                <th>Phone</th>
                                <th>Seller</th>
                                <th>Com(%)</th>
                                <th>Size(Acres)</th>  
                                {/* <th>Dimensions</th>                               */}
                                <th>Selling P.(KES)</th>
                                {/* <th>Acquired Date</th> */}
                                {/* <th>Location</th>  */}
                                {/* <th>Status</th>  */}
                                {/* <th>City</th>  */}
                                {/* <th>Created On</th>  */}
                                <th className='text-right'>Actions</th> 
                                <th className='text-right'>Downloads</th> 
                                </tr>
                            </thead>
                            <tbody>
                            {items?.sales?.data?.map((item) => (
                            <tr key={item?.id} >
                            {/* <td>{ item?.id }</td> */}
                            <td>{ item?.land?.reg_id ?? '' }</td>
                            <td>{item?.plot?.number ?? "-"}</td>
                            <td>{item?.contact?.name ?? "-"}</td>
                            <td>{item?.contact?.phone ?? "-"}</td>
                            <td>{item?.staff?.name ?? "-"}</td>
                            <td>{item?.commission ?? 0}%</td>
                            {/* <td>{item?.owner?.name ?? "-"}</td> 
                            <td>{item?.owner?.phone ?? "-"}</td>   */}
                            <td>{item?.plot?.size ?? "0"}</td>
                            {/* <td>{item?.dimensions ?? "0"}</td> */}
                            <td>Ksh. {formatNumber(item?.price) ?? "0"}</td>
                            {/* <td>{formatDate(item?.acquired_date) ?? "-"}</td> */}
                            {/* <td>{item?.land?.location ?? "-"}</td> */}
                            {/* <td>{item?.city ?? "-"}</td> */}
                            {/* <td>
                            <Badge color="red" variant="filled" radius="sm">Sold</Badge>
                            </td> */}
                            {/* <td>{formatDate(item?.created_at) ?? "-"}</td>   */}
                            <td>
                            <Link href={`/lands/installments?saleId=${item?.id}`}>
                              <Button disabled={item?.type === "Cash" || item?.type === null} leftIcon={<IconEye size={18} />} variant='outline' size='xs'>Installments</Button>
                            </Link>
                            </td>  
                            <td>
                              <Link href={`/lands/sale-documents/${item?.id}`}>
                              <Button leftIcon={<IconCloud size={18} />} ml="xs" variant='outline' size='xs'>Documents</Button>
                              </Link>
                              </td>                                                                            
                            </tr>
                             ))}

                            <tr className="text-lg">
                              <th
                                scope="row"
                                colSpan="7"
                                className="text-primary font-bold"
                              >
                                ACTUAL SALES VALUE
                              </th>
                              <td className="text-dark tracking-wider text-xxl font-bold">
                                Ksh. {formatNumber(items?.total) ?? 0}
                              </td>
                            </tr>

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={items?.sales}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default PlotSales;
