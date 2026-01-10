/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useContextAuth } from "../context/Context";
import { Spinner } from "../components/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useIsMobile } from "../components/useIsMobile";


export const SingleProducts = () => {
    const { state, dispatch, setShowAuth } = useContextAuth()
    const [product, setProduct] = useState(null)
    const { productId } = useParams()
    const navigate = useNavigate();
    const [mainImage, setMainImage] = useState(null);
    const [quantity, setQuantity] = useState(1)
    const isMobile = useIsMobile();

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        if (product) {
            setMainImage(product.img);
        }
    }, [product]);

    useEffect(() => {
        async function getProducts() {
            try {
                dispatch({ type: 'LOADING', payload: true })
                dispatch({ type: 'ERROR', payload: false })
                const res = await fetch(`http://localhost:2010/api/products/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                setProduct(data[0])
            } catch (e) {
                dispatch({ type: 'ERROR', payload: true })
            } finally {
                dispatch({ type: 'LOADING', payload: false })
            }
        }

        getProducts()
    }, [productId])


    if (state.isLoading) {
        return <Spinner />;
    }

    if (!product) {
        return <Spinner />;
    }

    const images = [
        product.img,
        "/uploads/test1.jpg",
        "/uploads/test2.jpg",
        "/uploads/test3.jpg",
    ];

    const handleBack = () => {
        setShowAuth(false)
        navigate(-1)
    }

    const handleCartObj = () => {
        dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity } })
    }

    return <div className="singleProductClass">

        <div className="singleProductClassLeft">
            {isMobile ? (
                <Swiper
                    spaceBetween={20}
                    slidesPerView={1}
                    grabCursor={true}
                    freeMode={true}
                >
                    {images.map((img, index) => (
                        <SwiperSlide>
                            <img
                                className='thumbnail'
                                src={`http://localhost:2010${img}`}
                                alt=""
                                key={index}
                                onClick={() => setMainImage(img)}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )
                :
                (
                    <>
                        {product.img ? <img src={`http://localhost:2010${mainImage}`} className="mainImage" /> : null}
                        <div className="thumbnailWrapper">
                            {images.map((img, index) => (

                                <img
                                    className='thumbnail'
                                    src={`http://localhost:2010${img}`}
                                    alt=""
                                    key={index}
                                    onClick={() => setMainImage(img)}
                                />
                            ))}
                        </div>
                    </>
                )
            }

            {/* {product.img ? <img src={`http://localhost:2010${mainImage}`} className="mainImage" /> : null}
            <div className="thumbnailWrapper">
                {images.map((img, index) => (

                    <img
                        className='thumbnail'
                        src={`http://localhost:2010${img}`}
                        alt=""
                        key={index}
                        onClick={() => setMainImage(img)}
                    />

                ))}
            </div> */}

        </div>
        <div className="singleProductClassRight ">
            <h2>{product.name}</h2>
            <div className='starRatingClass' style={{ display: 'flex' }}>
                <StarRating rating={product?.rating} />
                <p style={{ marginLeft: '10px' }}>{product?.rating}</p>
            </div>
            <p>{product?.description}</p>
            <p>Category: <span>{product?.category}</span></p>
            <p>Price: <span>{product?.price}</span>$</p>
            <div className='qunatityClass' >
                <span onClick={() => setQuantity(prev => prev > 1 ? prev - 1 : 1)}>-</span>
                <p>{quantity}</p>
                <span style={{ marginBottom: '5px' }} onClick={() => setQuantity(prev => prev + 1)}>+</span>
            </div>
            <div style={{ display: 'flex', marginLeft: '-15px' }}>
                <button onClick={handleBack}>Back</button>
                <button onClick={handleCartObj}>Add to cart</button>
            </div>

        </div>
    </div >
}