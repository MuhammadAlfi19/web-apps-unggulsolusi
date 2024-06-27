import React, { useState } from 'react'
import {
    IconButton,
    Modal,
    ModalContent,
    ModalOverlay,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Text,
    Flex,
    Button,
    useToast
  } from '@chakra-ui/react'
  import { Trash } from '@phosphor-icons/react'
import { deleteData } from '@/libs/api'

const HapusPelanggan = ({idPelanggan,namaPelanggan,callback}) => {

    const OverlayOne = () => (
        <ModalOverlay
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = useState(<OverlayOne />)

  const toast = useToast();

  const handleHapus = async (e) => {
    e.preventDefault();

    try {
        const result = await deleteData(`/pelanggan/hapus/${idPelanggan}`);
        if (result === 200) {
              onClose();
              callback(true);
              toast({
                  title: 'Berhasil.',
                  description: "Hapus Pelanggan Berhasil",
                  status: 'success',
                  duration: 3000,
                  position: 'top',
                  isClosable: true,
              })
        }
    } catch (error) {
      console.log(error);
    }

    
  }
    
  return (
    <div>

         <IconButton variant='outline' colorScheme='red' aria-label='edit' icon={<Trash size={17} />} onClick={onOpen}/>

         <Modal isCentered isOpen={isOpen} onClose={onClose}>
                {overlay}
            <ModalContent p='5'>
            <ModalBody>
                <Text textAlign='center' fontWeight='bold'>Apakah anda yakin ingin menghapus ?</Text>
                <Text textAlign='center' fontWeight='bold'>Dengan Nama Pelanggan :</Text>
                <Text textAlign='center'>{namaPelanggan}</Text>
                <Flex justifyContent='center' gap='3' mt='5'>
                  <Button onClick={onClose} colorScheme='blue'>Kembali</Button>    
                  <Button onClick={handleHapus} colorScheme='red'>Hapus</Button>    
                </Flex>
            </ModalBody>
            </ModalContent>
        </Modal>
    </div>
  )
}

export default HapusPelanggan