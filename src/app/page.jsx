import MasterBarang from '@/components/DataBarang/page';
import MasterPelanggan from '@/components/DataPelanggan/page';
import TransaksiPenjualan from '@/components/Transaksi/page';
import { 
  Card,
  CardBody, 
  Text,
  Tabs, 
  TabList,
  TabPanels, 
  Tab,
  TabPanel,
  Box,
  TabIndicator,
  ChakraProvider
 } from '@chakra-ui/react';

export default function Home() {
  
  return (
    <ChakraProvider>
      <Card px="30px" borderRadius="0px">
            <CardBody>
                <Text fontSize='xl' fontWeight="bold">PT. Unggul Mitra Solusi</Text>
            </CardBody>
        </Card>
        <Tabs position='relative' variant='unstyled' isFitted>
             <Box bg='white' px="30px">
                <TabList>
                    <Tab>Transaksi Penjualan</Tab>
                    <Tab>Data Pelanggan</Tab>
                    <Tab>Data Barang</Tab>
                </TabList>
             </Box>
            <TabIndicator mt='-1.5px' bg={'green'} height='2px' borderRadius='1px' />
            <TabPanels>
                
                <TabPanel>
                  <TransaksiPenjualan />
                </TabPanel>
                
                <TabPanel>
                    <MasterPelanggan />
                </TabPanel>

                <TabPanel>
                    <MasterBarang />
                </TabPanel>

            </TabPanels>
        </Tabs>
    </ChakraProvider>

  );
}
