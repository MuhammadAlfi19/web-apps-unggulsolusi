import React, { useEffect, useState } from 'react'
import {
    IconButton,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Select,
    useToast
  } from '@chakra-ui/react'
import { PencilSimpleLine } from '@phosphor-icons/react'
import { dataDomisili, dataJenisKelamin } from '@/libs/dummyData'
import { fetchData, updateData } from '@/libs/api'

const FormEdit = ({idPelanggan,callback}) => {

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [dummyDomisili,setdummyDomisili] = useState([]);
  const [dummJenisKelamin,setDummyJenisKelamin]  = useState([]);
  const [selectedValueDomisili, setSelectedValueDomisili] = useState('');
  const [selectedValueJenisKelamin, setSelectedValueJenisKelamin] = useState('');

  const [data,setData] = useState({nama: ''});

  const getData = async (id) => {

    try {

        const result = await fetchData(`/pelanggan/pelangganById/${id}`);
             setData({
                nama: result[0].NAMA,
            });
            setdummyDomisili(dataDomisili);
            setDummyJenisKelamin(dataJenisKelamin);
            filterDomisili(result[0].DOMISILI);
            setSelectedValueJenisKelamin(result[0].JENIS_KELAMIN);
            
    } catch (error) {
        console.log(error);
    }
    
  }

  useEffect(() => {
    if (isOpen) {
        getData(idPelanggan);
    }
    
  },[isOpen])

  const handleInput = (e) => {
    e.persist();

    setData({...data,[e.target.name] : e.target.value.toUpperCase()})
 }

 const handleChangeDomisili = (e) => {
    e.persist();

    setSelectedValueDomisili(e.target.value);
 }

 const handleChangeJenisKelamin = (e) => {
    e.persist();

    setSelectedValueJenisKelamin(e.target.value);
 }

 const filterDomisili = (namaDomisili) => {
   
    dataDomisili.map(value => {
        const splitDomisili = value.split(' ');
        const domsili = splitDomisili[0].slice(0,3) + "-" + splitDomisili[1].slice(0,3)

        if (domsili.toUpperCase() === namaDomisili) {
            setSelectedValueDomisili(splitDomisili.join(' '));
        }

    })
 }

 const editData = async (e) => {

    e.preventDefault();

    try {
        const splitDomisili = selectedValueDomisili.split(' ');
        const domsili = splitDomisili[0].slice(0,3) + "-" + splitDomisili[1].slice(0,3)

        const dataInput = {
            NAMA: data.nama,
            DOMISILI: domsili.toUpperCase(),
            JENIS_KELAMIN: selectedValueJenisKelamin,
        }

        if (data.nama === '' ) {
            toast({
                title: `Field harus diisi semua`,
                status: 'warning',
                isClosable: true,
                position: 'top',
            })
        }else {

            const result = await updateData(`/pelanggan/edit/${idPelanggan}`,dataInput);
            if (result === 200) {
                onClose();
                callback(true);
                toast({
                    title: 'Berhasil.',
                    description: "Ubah Pelanggan Berhasil",
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
                                <Input type='text' name='nama' onChange={handleInput} value={data.nama} />
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Domisili</FormLabel>
                                <Select name='domisili' value={selectedValueDomisili} onChange={handleChangeDomisili}>
                                    {
                                        dummyDomisili.map(item => {
                                            return <option key={item} value={item}>{item}</option>
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FormControl mt={4}>
                                <FormLabel>Jenis Kelamin</FormLabel>
                                <Select name='jenisKelamin' value={selectedValueJenisKelamin}  onChange={handleChangeJenisKelamin}>
                                    {
                                        dummJenisKelamin.map(item => {
                                            return <option key={item} value={item.toUpperCase()}>{item}</option>
                                        })
                                    }
                                </Select>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                      Batal
                    </Button>
                    <Button colorScheme='green' mr={3} onClick={editData}>
                      Edit
                    </Button>
                </ModalFooter>
                </ModalContent>
        </Modal>
    </div>
  )
}

export default FormEdit