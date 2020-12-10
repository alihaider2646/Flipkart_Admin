import axios from 'axios';
import { api } from '../urlConfig';
import store from '../store';
import { authConstants } from '../actions/constants';


const token = window.localStorage.getItem('token');
const axiosInstance = axios.create({
    baseURL: api,
    headers: {
        // 'Authorization': token ? `Bearer ${token}` : ''
        'Authorization': token ? `Bearer ${token}` : ''
    }
});

// ya below line of code hum na jwt token jab expire ho jae to error through karna ka bajae user ko logout karwa dena ka lia kai hai 
axiosInstance.interceptors.request.use((req) => {
    const { auth } = store.getState();
    if (auth.token) {
        req.headers.Authorization = `Bearer ${auth.token}`;
    }
    return req;
})

axiosInstance.interceptors.response.use((res) => {
    return res;
}, (error) => {
    console.log(error.response);
    const status = error.response ? error.response.status : 500;
    if (status && status === 500 || status === 400) {
        localStorage.clear();
        store.dispatch({ type: authConstants.LOGOUT_SUCCESS });
    }
    return Promise.reject(error)
})

export default axiosInstance;