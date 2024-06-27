'use client'
import React, { useEffect, useState } from 'react'
import { Box, Card, CardBody, Flex, Text, InputGroup,InputLeftElement, Input } from '@chakra-ui/react'
import TableComponent from '@/utils/tableComponent'
import FormTambah from './formTambah'
import FormEdit from './formEdit'
import HapusPelanggan from './hapusPelanggan'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { fetchData } from '@/libs/api'

const columns = [
	{
		name: 'Nama',
		selector: row => row.nama,
        sortable: true,
	},
	{
		name: 'Domisili',
		selector: row => row.domisili,
        sortable: true,
	},
	{
		name: 'Jenis Kelamin',
		selector: row => row.jenisKelamin,
        sortable: true,
	},
	{
		name: 'Aksi',
		selector: row => row.aksi,
        sortable: true,
	},
];


const MasterPelanggan = () => {

    const [data,setData] = useState([]);
    const [filterData,setFilterData] = useState([]);
    
    const getData = async () => {

        try {
            const list = [];

            const result = await fetchData(`/pelanggan/allPelanggan`);
            result.forEach((value) => {
                const object = {
                    id_pelanggan : value.ID_PELANGGAN,
                    nama         : value.NAMA,
                    domisili     : value.DOMISILI,
                    jenisKelamin : value.JENIS_KELAMIN,
                    aksi         :  <Flex gap={2} alignItems={'center'}>
                                        <FormEdit idPelanggan={value.ID_PELANGGAN} callback={getData} />
                                         <HapusPelanggan idPelanggan={value.ID_PELANGGAN} namaPelanggan={value.NAMA} callback={getData} />
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
                <Text fontSize={'xl'}>Master Data Pelanggan</Text>

                <Flex mt={5} justifyContent={'space-between'}>
                    <Box>
                       <FormTambah callback={getData} />
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

export default MasterPelanggan