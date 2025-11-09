import axios from "axios";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://backend-tnestjscompunetiii.onrender.com/api",
    headers: {
        "Content-Type": "application/json"
    }
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if(token) config.headers.Authorization = `Bearer ${token}`
        return config;
    },
    (error) =>{
        return Promise.reject(error);
    }
)

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // if(error.response.status === 401) {
        //     //redirect
        //     //modal con el error
        // }
        return Promise.reject(error);
    }
)

export default instance;