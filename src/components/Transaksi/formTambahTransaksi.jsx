import React, { useEffect, useState } from 'react'
import {
    Button,
    Flex,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Select,
    useToast
  } from '@chakra-ui/react'
import { Wallet } from '@phosphor-icons/react'
import moment from 'moment'
import SelectReact from 'react-select'
import { getPelanggan } from '@/libs/function'
import { fetchData, saveData } from '@/libs/api'

const FormTambahTransaksi = ({callback}) => {
   
   const toast = useToast()

   const today = moment().format('YYYY-MM-DD');

   const [dataPelanggan,setDataPelanggan] = useState([]);
   const [dataBarang,setDataBarang] = useState([]);

   const [selectedPelanggan, setSelectedPelanggan] = useState('');
   const [selectedBarang, setSelectedBarang] = useState({idBarang: '',  hargaBarang: 0,});

   const [data,setData] = useState({
       tanggaltransaksi: '',
       quantity        : 0,
       subtotal        : 0,
   });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getDataPelanggan = async () => {
    
    try {
      var dataList = [];
      const result = await fetchData('/pelanggan/allPelanggan');

      result.map(item => {
        var object = {
          value : item.ID_PELANGGAN,
          label : item.NAMA,
        }

        dataList.push(object);
      });

      setDataPelanggan(dataList);

    } catch (error) {
      console.log(error);
    }

    getDataBarang();
    
  }

  const getDataBarang = async () => {

    try {
      var dataList = [];
      const result = await fetchData('/barang/allBarang');

      result.map(item => {
        var object = {
          value : item.KODE,
          label : item.NAMA,
          hargaBarang: item.HARGA
        }

        dataList.push(object);
      });

      setDataBarang(dataList);
    } catch (error) {
      console.log(error);
    }
  }

  
  useEffect(() => {

    if (isOpen) {
      setData({
        tanggaltransaksi: today
      });
  
      getDataPelanggan();

    }

  },[isOpen])


  const handleInput = (e) => {
    e.persist();

    setData({...data,[e.target.name] : e.target.value})
  }

 const  handleChangeBarang = (selected) => {
    setSelectedBarang({idBarang: selected.value, hargaBarang: selected.hargaBarang})
    setData({...data,quantity: 0,subtotal: 0})
  }

  const handleQuantity = (e) => {
    e.persist();
    
    var total = e.target.value * selectedBarang.hargaBarang;
      
     if (parseInt(e.target.value) < 0) {
      setData({...data,quantity: 0,subtotal: 0})
     }else {
       setData({...data,quantity: e.target.value,subtotal: total.toLocaleString('id-ID')});
     }

    
  }
  

 const simpanData = async (e) => {
    e.preventDefault();

    try {
        
    if (selectedPelanggan === '' || selectedBarang.idBarang == '' || data.quantity === undefined || data.quantity === 0) {
      toast({
        title: `Field harus diisi semua`,
        status: 'warning',
        isClosable: true,
        position: 'top',
    })
    }else {
      const dataInput = {
         TGL : data.tanggaltransaksi == undefined ? today : data.tanggaltransaksi,
         KODE_PELANGGAN : selectedPelanggan,
         SUBTOTAL : data.subtotal.replace(/\./g,''),
         KODE_BARANG : selectedBarang.idBarang,
         Qty        : data.quantity
      };

      const result = await saveData('/penjualan/simpan',dataInput);
      if (result === 200) {
                onClose();
                callback(true);
                toast({
                    title: 'Berhasil.',
                    description: "Transaksi Berhasil",
                    status: 'success',
                    duration: 3000,
                    position: 'top',
                    isClosable: true,
                })
      }
    }
    } catch (error) {
      console.log(error);
    }


  }

  return (
    <div>
        <Button colorScheme='green' variant='solid' onClick={onOpen}>
            <Flex alignItems={'center'} gap={2}>
                <Wallet size={30} />
                <Text>Tambah Transaksi</Text>
            </Flex>
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Tambah Transaksi</ModalHeader>
            <ModalCloseButton />
            <ModalBody>

                  <FormControl>
                    <FormLabel>Tanggal Transaksi</FormLabel>
                    <Input size='md' value={data.tanggaltransaksi} type='date' name='tanggaltransaksi' onChange={handleInput} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Nama Pelanggan</FormLabel>
                    <SelectReact options={dataPelanggan} name='idPelanggan' onChange={(selected) => setSelectedPelanggan(selected.value)} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Barang</FormLabel>
                    <SelectReact options={dataBarang} name='idBarang' onChange={(selected) => handleChangeBarang(selected)} />
                  </FormControl>
                  
                  <Flex gap={3} mt={4}>
                    <FormControl>
                      <FormLabel>Harga Barang</FormLabel>
                      <Input size='md' value={selectedBarang.hargaBarang.toLocaleString('id-ID')} type='text' readOnly />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Quantity</FormLabel>
                      <Input size='md' value={data.quantity} type='number' name='quantity' onChange={handleQuantity} readOnly={selectedBarang.idBarang == '' ? true : false} />
                    </FormControl>
                  </Flex>

                  <FormControl mt={4}>
                      <FormLabel>Subtotal</FormLabel>
                      <Input size='md' value={data.subtotal} type='text' readOnly />
                    </FormControl>

            </ModalBody>

            <ModalFooter>
                   <Button colorScheme='blue' mr={3} onClick={onClose}>
                      Batal
                    </Button>
                    <Button colorScheme='green' mr={3} onClick={simpanData}>
                      Simpan
                    </Button>
            </ModalFooter>
            </ModalContent>
      </Modal>
    </div>
  )
}

export default FormTambahTransaksi