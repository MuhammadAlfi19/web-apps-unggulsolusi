import axios from "axios";
import { url } from "./config";
import { useToast } from "@chakra-ui/react";

export const fetchData = async (endpoint) => {
    try {
        const response = await axios.get(`${url}${endpoint}`);
        return response.data[0].payload;
    } catch (error) {
        console.error('Error fetching data:',error);
        throw error;
    }
};

export const saveData = async (endpoint,data) => {
    try {
        const response = await axios.post(`${url}${endpoint}`,data);
        return response.data[0].status;
    } catch (error) {
        const toast = useToast()
        toast({
            title: 'Gagal',
            description: error,
            status: 'error',
            duration: 3000,
            position: 'top',
            isClosable: true,
        })
        throw error;
    }
}

export const updateData = async (endpoint,data) => {
    try {
        const response = await axios.put(`${url}${endpoint}`,data);
        return response.data[0].status;
    } catch (error) {
        const toast = useToast()
        toast({
            title: 'Gagal',
            description: error,
            status: 'error',
            duration: 3000,
            position: 'top',
            isClosable: true,
        })
        throw error;
    }
}

export const deleteData = async (endpoint) => {
    try {
        const response = await axios.delete(`${url}${endpoint}`);
        return response.data[0].status;
    } catch (error) {
        const toast = useToast()
        toast({
            title: 'Gagal',
            description: error,
            status: 'error',
            duration: 3000,
            position: 'top',
            isClosable: true,
        })
        throw error;
    }
}