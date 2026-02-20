import axios from "axios"

export const axiosInstance = axios.create({
    baseURL:"https://gicc-server.onrender.com/api/",
    //baseURL:"http://localhost:7777/api/",

    withCredentials:true,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
) 
