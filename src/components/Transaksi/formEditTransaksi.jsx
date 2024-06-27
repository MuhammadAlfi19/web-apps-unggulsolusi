import { fetchData, updateData } from '@/libs/api'
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
    IconButton,
    useToast
  } from '@chakra-ui/react'
import { PencilSimpleLine } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import SelectReact from 'react-select'

const FormEditTransaksi = ({id,callback}) => {

  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [dataPelanggan,setDataPelanggan] = useState([]);
  const [dataBarang,setDataBarang] = useState([]);

  const [defaultValuePelanggan,setDefaultPelanggan] = useState([]);
  const [defaultValueBarang,setDefaultBarang] = useState([]);

  const [data,setData] = useState({
      tanggaltransaksi: '',
      quantity        : 0,
      subtotal        : 0,
  });

  const getData = async (idTransaksi) => {

    try {
        const result = await fetchData(`/penjualan/detailPenjualanById/${idTransaksi}`);
        
        var pelanggan = {value: result[0].KODE_PELANGGAN, label: result[0].NAMA}
        var barang    = {value: result[0].KODE_BARANG, label: result[0].NAMA_BARANG, hargaBarang: result[0].HARGA}

        setData({
            tanggaltransaksi: result[0].TGL,
            quantity        : result[0].Qty,
            subtotal        : result[0].SUBTOTAL.toLocaleString('id-ID')
        });
        
        setDefaultPelanggan(pelanggan);
        setDefaultBarang(barang);
   
    } catch (error) {
        console.log(error);
    }
  }

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
        getData(id);
        getDataPelanggan();
        getDataBarang();
    }
  },[isOpen])

  const handleInput = (e) => {
    e.persist();

    setData({...data,[e.target.name] : e.target.value})
  }

 const handleChangePelanggan = (selected) => {
    setDefaultPelanggan({value: selected.value, label: selected.label})
 }

 const  handleChangeBarang = (selected) => {
    setDefaultBarang({value: selected.value, label: selected.label, hargaBarang: selected.hargaBarang})
    setData({...data,quantity: 0,subtotal: 0})
  }

  const handleQuantity = (e) => {
    e.persist();
    
    var total = e.target.value * defaultValueBarang.hargaBarang;
      
     if (parseInt(e.target.value) < 0) {
      setData({...data,quantity: 0,subtotal: 0})
     }else {
       setData({...data,quantity: e.target.value,subtotal: total.toLocaleString('id-ID')});
     }

    
  }

  const simpanData = async (e) => {

    e.preventDefault();

    try {
        if (data.quantity === 0) {
            toast({
                title: `Quantity tidak boleh 0`,
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top',
            })
        }else {
             const dataInput = {
                    TGL : data.tanggaltransaksi,
                    KODE_PELANGGAN : defaultValuePelanggan.value,
                    SUBTOTAL : data.subtotal.replace(/\./g,''),
                    KODE_BARANG : defaultValueBarang.value,
                    Qty        : data.quantity
                };
           
            const result = await updateData(`/penjualan/edit/${id}`,dataInput);
            if (result === 200) {
                onClose();
                callback(true);
                toast({
                    title: 'Berhasil.',
                    description: "Ubah Transaksi Berhasil",
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
        <IconButton variant='outline' colorScheme='blue' aria-label='edit' icon={<PencilSimpleLine size={17} />} onClick={onOpen}/>

        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Edit Transaksi</ModalHeader>
            <ModalCloseButton />
            <ModalBody>

                  <FormControl>
                    <FormLabel>Tanggal Transaksi</FormLabel>
                    <Input size='md' value={data.tanggaltransaksi} type='date' name='tanggaltransaksi' onChange={handleInput} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Nama Pelanggan</FormLabel>
                    <SelectReact options={dataPelanggan} value={defaultValuePelanggan} name='idPelanggan' onChange={(selected) => handleChangePelanggan(selected)} />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Barang</FormLabel>
                    <SelectReact options={dataBarang} value={defaultValueBarang} name='idBarang' onChange={(selected) => handleChangeBarang(selected)} />
                  </FormControl>
                  
                  <Flex gap={3} mt={4}>
                    <FormControl>
                      <FormLabel>Harga Barang</FormLabel>
                      <Input size='md' value={defaultValueBarang.hargaBarang === undefined ? 0 : defaultValueBarang.hargaBarang.toLocaleString('id-ID')} type='text' readOnly />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Quantity</FormLabel>
                      <Input size='md' value={data.quantity} type='number' name='quantity' onChange={handleQuantity} readOnly={defaultValueBarang.idBarang == '' ? true : false} />
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

export default FormEditTransaksi