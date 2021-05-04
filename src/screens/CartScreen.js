import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cart';

const CartScreen = (props) => {

    const productId = props.match.params.id;
    const qty = props.location.search? Number(props.location.search.split('=')[1]) : 0;

    const dispatch = useDispatch();

    useEffect(() => {
        if(productId) {
            dispatch(addToCart(productId, qty));
        }
    }, [dispatch, productId, qty]);

    return (
        <div>
            <h1>Cart Screen</h1>
            <p>
                ADD TO CART : Product ID : {productId} Quantity : {qty} 
            </p>
        </div>
    )
}

export default CartScreen