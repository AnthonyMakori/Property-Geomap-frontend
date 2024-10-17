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
import { getPlotSales } from "@/store/properties/buildings/buildings-slice";
import AddLandModal from '../../components/lands/add-land-modal';
import { formatNumber, formatDate } from "@/lib/shared/data-formatters";
import { IconChevronDown } from '@tabler/icons-react';
import GeneratePlotsModal from '../../components/lands/generate-plots';
import { useRouter } from 'next/router';
import SellPlotModal from '../../components/lands/sell-plot-modal';

function LandDocuments() {
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
                                <th>Uploaded Date</th>
                                <th className='text-right'>Actions</th> 
                                </tr>
                            </thead>
                            <tbody>
                            {/* {items?.sales?.data?.map((item) => ( */}
                            <tr  >
                            {/* <td>{ item?.id }</td> */}
                            <td>1002</td>
                            <td>Land Document</td>
                            <td>Land Title Deed</td>
                            <td>18-03-2024</td>
                            <td>
                              <Button leftIcon={<IconDownload size={18} />} variant='outline' size='xs'>Download</Button>
                            </td>                                                                             
                            </tr>
                            <tr  >
                            {/* <td>{ item?.id }</td> */}
                            <td>951</td>
                            <td>Land Document</td>
                            <td>Land Sale Agreement</td>
                            <td>18-03-2024</td>
                            <td>
                              <Button leftIcon={<IconDownload size={18} />} variant='outline' size='xs'>Download</Button>
                            </td>                                                                             
                            </tr>
                            <tr  >
                            {/* <td>{ item?.id }</td> */}
                            <td>950</td>
                            <td>Owner Document</td>
                            <td>Owner National Id</td>
                            <td>18-03-2024</td>
                            <td>
                              <Button leftIcon={<IconDownload size={18} />} variant='outline' size='xs'>Download</Button>
                            </td>                                                                             
                            </tr>
                            <tr  >
                            {/* <td>{ item?.id }</td> */}
                            <td>949</td>
                            <td>Owner Document</td>
                            <td>Owner Passport</td>
                            <td>18-03-2024</td>
                            <td>
                              <Button leftIcon={<IconDownload size={18} />} variant='outline' size='xs'>Download</Button>
                            </td>                                                                             
                            </tr>
                            <tr  >
                            {/* <td>{ item?.id }</td> */}
                            <td>948</td>
                            <td>Owner Document</td>
                            <td>Owner Sale Agreement</td>
                            <td>18-03-2024</td>
                            <td>
                              <Button leftIcon={<IconDownload size={18} />} variant='outline' size='xs'>Download</Button>
                            </td>                                                                             
                            </tr>
                        

                            </tbody>
                            
                            </Table>
                            </div>
                            {/* <PaginationLinks
                                paginatedData={items?.sales}
                                onLinkClicked={onPaginationLinkClicked}
                            /> */}
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default LandDocuments;
