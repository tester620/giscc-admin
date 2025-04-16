import axios from "axios"

export const axiosInstance = axios.create({
    // baseURL:"https://gicc-server.onrender.com/api/",
    baseURL:"http://localhost:7777/api/",

    withCredentials:true,
}) 