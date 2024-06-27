import React, { useEffect, useState } from 'react';
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
  import { UserPlus } from '@phosphor-icons/react'
import { dataDomisili, dataJenisKelamin } from '@/libs/dummyData';
import { saveData } from '@/libs/api';

const FormTambah = ({callback}) => {

    const toast = useToast()

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [dummyDomisili,setdummyDomisili] = useState([]);
    const [dummJenisKelamin,setDummyJenisKelamin]  = useState([]);

    const [data,setData] = useState({
        nama: '',
        domisili: '',
        jenisKelamin :'',
    });

    useEffect(() => {
        if (isOpen) {
            setdummyDomisili(dataDomisili);
            setDummyJenisKelamin(dataJenisKelamin);
        }
    }, [isOpen])

    const handleInput = (e) => {
        e.persist();

        setData({...data,[e.target.name] : e.target.value})
    }

    const simpanData = async (e) => {

        e.preventDefault();

        try {
            const splitDomisili = data.domisili.split(' ');
            const domsili = splitDomisili[0].slice(0,3) + "-" + splitDomisili[1].slice(0,3)

            const dataInput = {
                NAMA: data.nama,
                DOMISILI: domsili.toUpperCase(),
                JENIS_KELAMIN: data.jenisKelamin.toUpperCase(),
            }
        
            if (data.nama === '' || data.domisili === '' || data.jenisKelamin === '') {
                toast({
                    title: `Field harus diisi semua`,
                    status: 'warning',
                    isClosable: true,
                    position: 'top',
                })
            }else {

                const result = await saveData('/pelanggan/simpan',dataInput);
                if (result === 200) {
                    onClose();
                    callback(true);
                    toast({
                        title: 'Berhasil.',
                        description: "Tambah Pelanggan Berhasil",
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
                <UserPlus size={30} />
                <Text>Tambah pelanggan</Text>
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
                            <FormLabel>Domisili</FormLabel>
                            <Select placeholder='Select option' name='domisili' onChange={handleInput}>
                                {
                                    dummyDomisili.map(item => {
                                        return <option key={item} value={item}>{item}</option>
                                    })
                                }
                            </Select>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Jenis Kelamin</FormLabel>
                            <Select placeholder='Select option' name='jenisKelamin' onChange={handleInput}>
                                {
                                    dummJenisKelamin.map(item => {
                                        return <option key={item} value={item}>{item}</option>
                                    })
                                }
                            </Select>
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

export default FormTambah