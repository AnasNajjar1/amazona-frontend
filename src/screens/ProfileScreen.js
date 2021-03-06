import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/user';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

const ProfileScreen = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sellerLogo, setSellerLogo] = useState('');
    const [sellerDescription, setSellerDescription] = useState('');

    const dispatch = useDispatch();
   

    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;
    const userDetails = useSelector(state => state.userDetails);
    const { loading, error, user } = userDetails;
    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const { success: successUpdate, error: errorUpdate, loading: loadingUpdate } = userUpdateProfile;

    const userId = userInfo._id? userInfo._id : userInfo.id;

    console.log(userInfo);
    useEffect(() => {
        if(JSON.stringify(user) === '{}' || (userInfo.name !== user.name) || (userInfo.email !== user.email) || successUpdate) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET });
            dispatch(detailsUser(userId));
        } else {
            setName(user.name);
            setEmail(user.email);
            if(user.seller) {
                console.log(user.seller);
                setSellerLogo(user.seller.logo);
                setSellerDescription(user.seller.description);
            }
        }
    }, [dispatch, user, userInfo, successUpdate]);
    const submitHandler = (e) => {
        e.preventDefault();

        if(password!==confirmPassword) {
            alert('Password and Confirmed Password are not matched');
        } else {
            dispatch(updateUserProfile({ userId: userInfo.id, name, email, password, sellerLogo, sellerDescription }));
        }
    };


    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>{userInfo.isAdmin && 'Admin' || userInfo.isSeller && !userInfo.isAdmin && 'Seller' || userInfo && 'User' } Profile</h1>
                </div>
                {
                    loading? <LoadingBox /> :
                    error? <MessageBox variant="danger">{error}</MessageBox>
                    : 
                    <>
                        {loadingUpdate && <LoadingBox />}
                        {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                        {successUpdate && <MessageBox variant="success">Profile Updated Successfully</MessageBox>}
                        <div>
                            <label htmlFor="name">Name</label>
                            <input id="name" type="text" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input id="password" type="text" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input id="confirmPassword" type="text" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>
                        {
                            user.isSeller && (
                                <>
                                    <div>
                                        <label htmlFor="sellerLogo">Seller Logo</label>
                                        <input id="sellerLogo" type="text" placeholder="Enter Seller Logo" value={sellerLogo} onChange={(e) => setSellerLogo(e.target.value)} />
                                    </div>
                                    <div>
                                        <label htmlFor="sellerDescription">Seller Description</label>
                                        <input id="sellerDescription" type="text" placeholder="Enter Seller Description" value={sellerDescription} onChange={(e) => setSellerDescription(e.target.value)} />
                                    </div>
                                </>
                            )
                        }
                        <div>
                            <label/>
                            <button className="primary" type="submit">
                                Update
                            </button>
                        </div>
                    </>
                }
            </form>
        </div>
    )
}

export default ProfileScreen
