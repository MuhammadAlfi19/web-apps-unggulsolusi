import React, { useEffect, useState } from 'react'
import {
    IconButton,
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
import { PencilSimpleLine } from '@phosphor-icons/react'
import { formatRupiah } from '@/libs/function'
import { dataKateogri } from '@/libs/dummyData'
import { fetchData, updateData } from '@/libs/api'

const FormEditBarang = ({id,callback}) => {

  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dummyKateogri,setdummyKateogri] = useState([]);
  const [inputHarga, setInputHarga] = useState('');
  const [selectedKateogri, setSelectedKateogri] = useState('');

  const [data,setData] = useState({nama: ''});

  const getData = async (id) => {
    
    try {
        const result = await fetchData(`/barang/barangById/${id}`)
         setData({
            nama: result[0].NAMA
        });
        setdummyKateogri(dataKateogri);
        setInputHarga(result[0].HARGA.toLocaleString('id-ID'));
        setSelectedKateogri(result[0].KATEOGRI);
    } catch (error) {
        
    }
  }

  useEffect(() => {
    if (isOpen) {
        getData(id);
    }
  },[isOpen]);

  const handleInput = (e) => {
    e.persist();

    setData({...data,[e.target.name] : e.target.value.toUpperCase()})
 }

 const handleHarga = (e) => {
    e.persist();

    const hargaBarang = e.target.value;
    setInputHarga(formatRupiah(hargaBarang));
}

const handleKateogri = (e) => {
    
    setSelectedKateogri(e.target.value);
}

const simpanData = async (e) => {

    e.preventDefault();

    try {
        const inputData = {
            NAMA : data.nama.toUpperCase(),
            KATEOGRI: selectedKateogri,
            HARGA : inputHarga.replace(/,/g, "")
        }
    
        if (data.nama === "" || inputHarga === "") {
            toast({
                title: `Field harus diisi semua`,
                status: 'warning',
                isClosable: true,
                position: 'top',
            })
        }else {

            const result = await updateData(`/barang/edit/${id}`,inputData);
            if (result === 200) {
                onClose();
                callback(true);
                toast({
                    title: 'Berhasil.',
                    description: "Ubah Barang Berhasil",
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
                <ModalHeader>Edit Pelanggan</ModalHeader>
                <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Nama</FormLabel>
                            <Input type='text' name='nama' value={data.nama} onChange={handleInput} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Kateogri</FormLabel>
                            <Select value={selectedKateogri} name='kateogri' onChange={handleKateogri}>
                                {
                                    dummyKateogri.map(item => {
                                        return <option key={item} value={item}>{item}</option>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Harga</FormLabel>
                            <Input type='text' value={inputHarga} onChange={handleHarga} textAlign='right' />
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

export default FormEditBarang