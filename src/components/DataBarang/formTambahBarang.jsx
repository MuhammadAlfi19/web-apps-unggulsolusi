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
  import { StackPlus } from '@phosphor-icons/react'
import { dataKateogri } from '@/libs/dummyData'
import { formatRupiah } from '@/libs/function'
import { saveData } from '@/libs/api'

const FormTambahBarang = ({callback}) => {

  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dummyKateogri,setdummyKateogri] = useState([]);
  const [inputHarga, setInputHarga] = useState('');

  const [data,setData] = useState({
    nama: '',
    kateogri: '',
   });

   useEffect(() => {
    if (isOpen) {
        setdummyKateogri(dataKateogri);
    }
   },[isOpen])

const handleInput = (e) => {
    e.persist();

    setData({...data,[e.target.name] : e.target.value})
}

const handleHarga = (e) => {
    e.persist();

    const hargaBarang = e.target.value;
    setInputHarga(formatRupiah(hargaBarang));
}

const simpanData = async (e) => {

    e.preventDefault();

    try {
        const dataInput = {
            NAMA : data.nama.toUpperCase(),
            KATEOGRI: data.kateogri,
            HARGA : inputHarga.replace(/,/g, "")
        }
    
    
        if (data.nama === "" || data.kateogri === "" || inputHarga === "") {
            toast({
                title: `Field harus diisi semua`,
                status: 'warning',
                isClosable: true,
                position: 'top',
            })
        }else {

            const result = await saveData('/barang/simpan',dataInput);
            if (result === 200) {
                        onClose();
                        callback(true);
                        toast({
                            title: 'Berhasil.',
                            description: "Tambah Barang Berhasil",
                            status: 'success',
                            duration: 3000,
                            position: 'top',
                            isClosable: true,
                        })
                        setInputHarga('');
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
                <StackPlus size={30} />
                <Text>Tambah Barang</Text>
            </Flex>
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
            <ModalOverlay />
                <ModalContent>
                <ModalHeader>Tambah Pelanggan</ModalHeader>
                <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Nama</FormLabel>
                            <Input type='text' name='nama' onChange={handleInput} />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Kateogri</FormLabel>
                            <Select placeholder='Select option' name='kateogri' onChange={handleInput}>
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

export default FormTambahBarang