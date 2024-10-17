import React, {SyntheticEvent, useState} from 'react';
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Badge, Menu} from "@mantine/core";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPrinter, IconCurrencyDollar, IconShare, IconPlus, IconChartPie, IconTrash, IconMoneybag, IconArrowBack} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { getInstallments } from "@/store/properties/buildings/buildings-slice";
import AddLandModal from '../../components/lands/add-land-modal';
import { formatNumber, formatDate } from "@/lib/shared/data-formatters";
import { IconChevronDown } from '@tabler/icons-react';
import GeneratePlotsModal from '../../components/lands/generate-plots';
import { useRouter } from 'next/router';
import SellPlotModal from '../../components/lands/sell-plot-modal';

function Installments() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const saleId = router.query?.saleId ?? null;
    const [searchTerm, setSearchTerm] = useState('');

    const itemsStatus = useSelector((state) => state.buildings.getInstallmentsStatus);
    const items = useSelector((state) => state.buildings.getInstallments);
  
    const isLoading = itemsStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};
        params["accessToken"] = session.user.accessToken;

        if (saleId) {
            params['saleId'] = saleId;
          }

      store.dispatch(getInstallments(params));
    }, [saleId, session, status]);
  
    console.log('data monyancha', items);
  
    function onPaginationLinkClicked(page) {
      if (!page || !session) {
        return;
    }
  
      const params = {};
      params['page'] = page;
      params["accessToken"] = session.user.accessToken;
      if (saleId) {
        params['saleId'] = saleId;
      }

  
      store.dispatch(getInstallments(params));
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
                                    <Link href="/lands/sales">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                                </Stack>
                                <Button size='xs' leftIcon={<IconPrinter size={18} />} >Export</Button>
                                {/* <GeneratePlotsModal landId={landId} /> */}
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Plot Installments</Text>
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
                                <th>Invoice</th>
                                <th>Land Reg. ID</th>
                                <th>Plot No.</th>
                                <th>Interest(%)</th>
                                <th>Amount(KES)</th>
                                <th>Duration</th>
                                <th>Month</th>
                                <th>Next Payment Date</th>  
                                </tr>
                            </thead>
                            <tbody>
                            {items?.items?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.invoice?.code ?? "-" }</td>
                            <td>{ item?.land?.reg_id ?? '' }</td>
                            <td>{item?.plot?.number ?? "-"}</td>
                            <td>{item?.interest ?? 0}</td>
                            <td>Ksh. {formatNumber(item?.price) ?? 0}</td>
                            <td>{item?.duration ?? 0}</td>
                            <td>{item?.month ?? "-"}</td>
                            <td>{formatDate(item?.date) ?? "-"}</td>
                                                                        
                            </tr>
                             ))}

                            <tr className="text-lg">
                              <th
                                scope="row"
                                colSpan="4"
                                className="text-primary font-bold"
                              >
                                TOTAL
                              </th>
                              <td className="text-dark tracking-wider text-xxl font-bold">
                                Ksh. {formatNumber(items?.total) ?? 0}
                              </td>
                            </tr>

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={items?.items}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Installments;
