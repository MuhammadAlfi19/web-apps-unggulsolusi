'use client'
import React, { useEffect, useState } from 'react'
import { Box, Card, CardBody, Flex, Text, InputGroup,InputLeftElement, Input } from '@chakra-ui/react'
import { MagnifyingGlass } from '@phosphor-icons/react';
import FormTambahTransaksi from './formTambahTransaksi';
import { fetchData } from '@/libs/api';
import TableComponent from '@/utils/tableComponent';
import moment from 'moment';
import FormEditTransaksi from './formEditTransaksi';
import HapusTransaksi from './hapusTransaksi';

const columns = [
	{
		name: 'Tanggal Transaksi',
		selector: row => row.tgltransaksi,
        sortable: true,
	},
	{
		name: 'Nama',
		selector: row => row.nama,
        sortable: true,
	},
	{
		name: 'Subtotal',
		selector: row => row.subtotal,
        sortable: true,
	},
	{
		name: 'Aksi',
		selector: row => row.aksi,
        sortable: true,
	},
];

const TransaksiPenjualan = () => {

  const [data,setData] = useState([]);
  const [filterData,setFilterData] = useState([]);

  const getData = async () => {
        try {
            const list = [];
            const result = await fetchData('/penjualan/detailPenjualan');
            result.forEach((value) => {
                const object = {
                    id_transaksi: value.ID_NOTA,
                    tgltransaksi: moment(value.TGL).format('DD MMMM YYYY'),
                    nama        : value.NAMA,
                    subtotal    : value.SUBTOTAL.toLocaleString('id-ID'),
                    aksi        : <Flex gap={2} alignItems={'center'}>
                                        <FormEditTransaksi id={value.ID_NOTA} callback={getData} />
                                        <HapusTransaksi idTransaksi={value.ID_NOTA} namaPelanggan={value.NAMA} callback={getData} />
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
  }, [])


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
                <Text fontSize={'xl'}>Transaksi</Text>

                <Flex mt={5} justifyContent={'space-between'}>
                    <Box>
                       <FormTambahTransaksi callback={getData} />
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

export default TransaksiPenjualan