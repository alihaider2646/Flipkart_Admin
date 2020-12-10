import axios from "../helpers/axios";
import { categoryConstants, intialDataConstants, orderConstants, productConstants } from "./constants"

export const getInitialData = () => {
    return async dispatch => {
        // dispatch({ type: intialDataConstants.GET_ALL_INITIAL_DATA_REQUEST });
        const res = await axios.post(`/initialData`)
        if (res.status === 200) {
            const { categories, products, orders } = res.data;
            dispatch({
                type: categoryConstants.GET_ALL_CATEGORY_SUCCESS,
                payload: { categories }
            })
            dispatch({
                type: productConstants.GET_ALL_PRODUCT_SUCCESS,
                payload: { products }
            })
            dispatch({
                type: orderConstants.GET_CUSTOMER_ORDER_SUCCESS,
                payload: { orders }
            })
        }
        console.log(res);
    }
}