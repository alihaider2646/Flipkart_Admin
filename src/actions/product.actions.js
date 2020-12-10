import axios from '../helpers/axios'
export const addProduct = (form) => {
    return async dispatch => {
        // dispatch({ type: categoryConstants.ADD_NEW_CATEGORY_REQUEST })
        const res = await axios.post('/product/create', form)
        console.log(res);
        // if (res.status === 201) {
        //     dispatch({
        //         type: categoryConstants.ADD_NEW_CATEGORY_SUCCESS,
        //         payload: { category: res.data.category }
        //     });
        // } else {
        //     dispatch({
        //         type: categoryConstants.ADD_NEW_CATEGORY_FAILURE,
        //         payload: res.data.error
        //     });
        // }
    }
} 