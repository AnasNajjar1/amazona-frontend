import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/product';
import { detailsUser } from '../actions/user';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import Rating from '../components/Rating';

const SellerScreen = (props) => {

    const dispatch = useDispatch();

    const sellerId = props.match.params.id;

    const userDetails = useSelector(state => state.userDetails);
    const { loading, error, user } = userDetails;

    const productList = useSelector(state => state.productList);
    const { loading: loadingProducts, error: errorProducts, products } = productList;

    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;



    useEffect(() => {
        dispatch(detailsUser(sellerId));
        dispatch(listProducts({ seller: sellerId }));
    }, [dispatch, sellerId]);

    return (
        <div className="row top">
            <div className="col-1">
                {
                    loading ? <LoadingBox /> :
                        error ? <MessageBox variant="danger">{error}</MessageBox> :
                            user.seller && (
                                <ul className="card card-body">
                                    <li>
                                        <div className="row start">
                                            <div className="p-1">
                                                <img className="small" src={user.seller.logo} alt={user.name} />
                                            </div>
                                            <div className="p-1">
                                                <h1>{user.seller.name}</h1>
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <Rating rating={user.seller.rating} numReviews={user.seller.numReviews} ></Rating>
                                    </li>
                                   { userInfo && !userInfo.isSeller && (<li>
                                        <a href={`mailto:${user.email}`}>Contact Seller</a>
                                    </li>) }
                                    <li>
                                        {user.seller.description}
                                    </li>
                                </ul>
                            )
                }
            </div>
            <div className="col-3">
                {
                    loadingProducts ? <LoadingBox /> :
                        errorProducts ? <MessageBox variant="danger">{errorProducts}</MessageBox> :
                            (
                                <>
                                    {
                                        products.length === 0 && (
                                            <MessageBox>No Product Found</MessageBox>
                                        )
                                    }
                                    <div className="row center">
                                        {
                                            products.map(product => (
                                                <Product key={product._id} product={product}></Product>
                                            ))
                                        }
                                    </div>
                                </>
                            )

                }
            </div>
        </div>
    )
}

export default SellerScreen
