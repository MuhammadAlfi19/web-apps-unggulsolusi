'use client'
import React, { useEffect, useState } from 'react'
import { Box, Card, CardBody, Flex, Text,InputGroup,InputLeftElement, Input } from '@chakra-ui/react'
import TableComponent from '@/utils/tableComponent'
import FormTambahBarang from './formTambahBarang'
import FormEditBarang from './formEditBarang'
import HapusBarang from './hapusBarang'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { fetchData } from '@/libs/api'

const columns = [
	{
		name: 'Nama',
		selector: row => row.nama,
        sortable: true,
	},
	{
		name: 'Kateogri',
		selector: row => row.kateogri,
        sortable: true,
	},
	{
		name: 'Harga',
		selector: row => row.harga,
        sortable: true,
	},
	{
		name: 'Aksi',
		selector: row => row.aksi,
        sortable: true,
	},
];


const MasterBarang = () => {

    const [data,setData] = useState([]);
    const [filterData,setFilterData] = useState([]);
    
    const getData = async () => {

        try {
            const list = [];

            const result = await fetchData('/barang/allBarang');
            result.forEach((value) => {
                    const object = {
                        id_barang    : value.KODE,
                        nama         : value.NAMA,
                        kateogri     : value.KATEOGRI,
                        harga        : value.HARGA.toLocaleString('id-ID'),
                        aksi         :  <Flex gap={2} alignItems={'center'}>
                                                <FormEditBarang id={value.KODE} callback={getData} />
                                                <HapusBarang id={value.KODE} namaBarang={value.NAMA} callback={getData} />
                                        </Flex> 
                    }
    
                    list.push(object);
                });
    
                setData(list);
                setFilterData(list);
        } catch (error) {
            console.log(error);
        }
       
    }
    
    useEffect(() => {
        getData();
    },[])

    const handleSearch = (e) => {
        e.persist();

        const newData = data.filter(row => {
            return row.nama.toLowerCase().includes(e.target.value.toLowerCase());
        })

        setFilterData(newData);
    }

    return (
    <div>
        <Card>
            <CardBody>
                <Text fontSize={'xl'}>Master Data Barang</Text>

                <Flex mt={5} justifyContent={'space-between'}>
                    <Box>
                       <FormTambahBarang callback={getData} />
                    </Box>
                    <Box>
                        <InputGroup>
                            <InputLeftElement pointerEvents='none'>
                            <MagnifyingGlass size={20} />
                            </InputLeftElement>
                            <Input type='text' placeholder='Cari berdasarkan nama' onChange={handleSearch} />
                        </InputGroup>
                    </Box>
                </Flex>

                <Card mt={3}>
                    <TableComponent columns={columns} datas={filterData} />
                </Card>
            </CardBody>
        </Card>
    </div>
  )
}

export default MasterBarang