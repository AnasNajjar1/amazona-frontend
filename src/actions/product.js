import axios from "axios";
import { PRODUCT_CREATE_FAILURE, PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_SUCCESS, PRODUCT_DELETE_FAILURE, PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DETAILS_FAILURE, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_LIST_FAILURE, PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_UPDATE_FAILURE, PRODUCT_UPDATE_REQUEST, PRODUCT_UPDATE_SUCCESS } from "../constants/productConstants"
import { API } from "../urlConfig";

export const listProducts = ({ seller = '' }) => async (dispatch) => {
    dispatch({
        type: PRODUCT_LIST_REQUEST
    });
    try {
        const { data } = await axios.get(`${API}/api/products?seller=${seller}`);
        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAILURE,
            payload: error.message
        });
    }
};

export const detailsProduct = (productId) => async (dispatch) => {
    dispatch({ type: PRODUCT_DETAILS_REQUEST, payload: productId });
    try {
        const { data } = await axios.get(`${API}/api/products/${productId}`);
        dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ 
            type: PRODUCT_DETAILS_FAILURE,
            payload: error.response && error.response.data.message ?
                     error.response.data.message : error.message
        });
    }
};

export const createProduct = () => async (dispatch, getState) =>  {
    dispatch({ type: PRODUCT_CREATE_REQUEST });
    const { userSignin: { userInfo } } = getState();

    try {
        const { data } = await axios.post(`${API}/api/products`, {}, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        });
        dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data.product });
    } catch (error) {
        const message = error.response && error.response.data.message ?
                        error.response.data.message : error.message;
        dispatch({ type: PRODUCT_CREATE_FAILURE, payload: message });
    }
};

export const updateProduct = (product) => async (dispatch, getState) => {
    dispatch({ type: PRODUCT_UPDATE_REQUEST, payload: product });
    const { userSignin: { userInfo } } = getState();

    try {
        const { data }  = await axios.put(`${API}/api/products/${product._id}`, product, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        });
        dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ?
                        error.response.data.message : error.message;
        dispatch({ type: PRODUCT_UPDATE_FAILURE, payload: message });
    }
};

export const deleteProduct = (productId) => async (dispatch, getState) => {
    dispatch({ type: PRODUCT_DELETE_REQUEST, payload: productId });
    const { userSignin: { userInfo } } = getState();

    try {
        const { data } = await axios.delete(`${API}/api/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        });
        dispatch({ type: PRODUCT_DELETE_SUCCESS });
    } catch (error) {
        const message = error.response && error.response.data.message ?
                        error.response.data.message : error.message;
        dispatch({ type: PRODUCT_DELETE_FAILURE, payload: message });
    }
}