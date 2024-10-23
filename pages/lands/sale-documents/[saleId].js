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
import { useRouter } from 'next/router';
import { getSaleDocuments } from '../../../store/properties/buildings/buildings-slice';
import { formatDate, formatNumber } from '../../../lib/shared/data-formatters';

function LandSaleDocuments() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const saleId = router.query?.saleId ?? null;
    const [searchTerm, setSearchTerm] = useState('');

    const itemsStatus = useSelector((state) => state.buildings.getSaleDocumentsStatus);
    const items = useSelector((state) => state.buildings.getSaleDocuments);
  
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

      store.dispatch(getSaleDocuments(params));
    }, [saleId, session, status]);
  
    console.log('data Anthony', items);
  
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

  
      store.dispatch(getSaleDocuments(params));
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
                                {/* <GeneratePlotsModal landId={landId} /> */}
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Land Sale Documents</Text>
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
                                <th>ID</th>
                                <th>File Name</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Size</th>
                                <th>Uploaded Date</th>
                                <th className='text-right'>Actions</th> 
                                </tr>
                            </thead>
                            <tbody>
                            {items?.data?.map((item) => (
                            <tr  key={item?.id}>
                            <td>{item?.id}</td>
                            <td>{item?.name ?? '-'}</td>
                            <td>{item?.description ?? '-'}</td>
                            <td>{item?.type ?? '-'}</td>
                            <td>{formatNumber(item?.size/1048576) ?? 0} Mbs</td>
                            <td>{formatDate(item?.created_at)}</td>
                            <td>
                            <Link href={item?.url} target='_blank' >
                              <Button leftIcon={<IconEye size={18} />} variant='outline' size='xs'>View & Download</Button>
                            </Link>
                            </td>                                                                             
                            </tr>
                            ))}
                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={items}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default LandSaleDocuments;
