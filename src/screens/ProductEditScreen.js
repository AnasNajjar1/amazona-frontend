import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../node_modules/axios/index';
import { detailsProduct, updateProduct } from '../actions/product';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import { API } from '../urlConfig';
import { storage } from '../firebase';
import { listCategories } from '../actions/category';

const ProductEditScreen = (props) => {

    const productId = props.match.params.id;

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [fileImage, setFileImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');

    const [category, setCategory] = useState(null);

    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;

    console.log(product._id);

    const categoryList = useSelector(state => state.categoryList);
    const { loading: loadingCategory, error: errorCategory, categories } = categoryList;

    const productUpdate = useSelector(state => state.productUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    const dispatch = useDispatch();

    console.log(product);

    useEffect(() => {
        if(successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            props.history.push('/productlist');
        }
        if(!product || (product._id !== productId) || successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            dispatch(detailsProduct(productId));
        } else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category._id);
            setCountInStock(product.countInStock);
            setBrand(product.brand);
            setDescription(product.description);
        }

        dispatch(listCategories());
    }, [product, dispatch, productId, successUpdate]);

    const submitHandler = async (e) => {
        e.preventDefault();

        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            category,
            brand,
            countInStock,
            description 
        }));
        
    };

    const uploadHandler = async (e) => {
        e.preventDefault();

        const uploadTask = storage.ref(`images/${String(fileImage.lastModified)}`).put(fileImage);
        uploadTask.on("state_changed", snapshot => {
            const progress = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(progress);
        }, error => { console.log("error image : ", error) }, () => {
            storage.ref("images").child(String(fileImage.lastModified)).getDownloadURL().then(
                url => {
                    console.log('url ', String(url));
                    setImage(String(url));
                }
            )
            .catch(console.log(error));
        });
    }

    



    const uploadFileHandler = async (e) => {


        if(e.target.files[0]) {
            setFileImage(e.target.files[0]);
        }

        // const file = e.target.files[0];
        // const bodyFormData = new FormData();
        // bodyFormData.append('image', file);
        // setLoadingUpload(true);

        // try {
        //     const { data } = await axios.post(`${API}/api/uploads`, bodyFormData, {
        //         headers: { 
        //             'Content-Type' :  'multipart/form-data',
        //             Authorization: `Bearer ${userInfo.token}`
        //         }
        //     });
        //     setImage(data);
        //     setLoadingUpload(false);
        // } catch (error) {
        //     setErrorUpload(error.message);
        //     setLoadingUpload(false);
        // }
        
    };

    console.log(category);

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Edit Product {productId}</h1>
                </div>
                {loadingUpdate && <LoadingBox />}
                {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                {
                    loading? <LoadingBox /> :
                    error? <MessageBox variant="danger">{error}</MessageBox> :
                    <>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input id="name" type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="price">Price</label>
                            <input id="price" type="text" placeholder="Enter Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="image">Image</label>
                            <img src={product.image} alt="image" />
                        </div>
                        <div>
                            <label htmlFor="imageFile">Image File</label>
                            <input type="file" id="imageFile" label="Choose Image" onChange={uploadFileHandler} />
                            <button className="buttonIn" onClick={uploadHandler}>Upload</button>
                            <progress value={progress} max="100" />
                            { loadingUpload && <LoadingBox /> }
                            { errorUpload && <MessageBox variant="danger">{errorUpload}</MessageBox> }
                        </div>
                        <div>
                            <label htmlFor="category">Category</label>
                            {/* <input id="category" type="text" placeholder="Enter Category" value={category} onChange={(e) => setCategory(e.target.value)} /> */}
                            <select className="form-control" value={category} onChange={(e) => { setCategory(e.target.value) }}>
                                <option value={product?.category?._id}>Select Category</option>
                                {
                                    categories.map((category) => 
                                        <option key={category._id} value={category._id}>{category.name}</option>
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            <label htmlFor="brand">Brand</label>
                            <input id="brand" type="text" placeholder="Enter Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="countInStock">Count In Stock</label>
                            <input id="countInStock" type="text" placeholder="Enter Count In Stock" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea id="description" type="text" rows="3" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <div>
                            <label/>
                            <button className="primary" type="submit">Update</button>
                        </div>
                    </>
                }
            </form>
        </div>
    )
}

export default ProductEditScreen
