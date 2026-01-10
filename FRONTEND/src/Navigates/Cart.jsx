import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircle,
    faCircleCheck,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import StarRating from "../components/StarRating";
import { Products } from "./Products";
import { useContextAuth } from "../context/Context";
import { useIsMobile } from "../components/useIsMobile";


const CartProduct = ({ }) => {
    // const location = useLocation()
    // const [products, setProducts] = useState(location?.state?.product);
    const { removeFromCart, state, dispatch } = useContextAuth()
    const [checkedItems, setCheckedItems] = useState([])
    const products = state.cart;
    const isMobile = useIsMobile();

    useEffect(() => {
        if (products?.length > 0) {
            const allItems = products?.map(item => item.id)
            setCheckedItems(allItems)
        }
    }, [products])

    const toggleChecked = (id) => {
        setCheckedItems(prev =>
            prev.includes(id)
                ?
                prev.filter(itemID => itemID !== id)
                :
                [...prev, id]
        )
    }

    const handleSellectAll = () => {
        const allIds = products.map(item => item.id)
        if (checkedItems.length === products.length) {
            setCheckedItems([])
        } else setCheckedItems(allIds)

    }

    const handleDeleteProduct = (id) => {
        removeFromCart(id)
    }


    const updateQuantity = (id, type) => {
        const findItem = state?.cart?.find(item => item.id == id)

        const newQuantity =
            type === 'inc' ? findItem.quantity + 1 : findItem.quantity - 1;

        dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity: newQuantity } })

    }

    const checkedProducts = products.filter(item => checkedItems.includes(item.id))
    const itemsTotal = checkedProducts?.reduce(
        (accumulator, item) => accumulator + (item.price * (item?.quantity || 1)),
        0
    ) || 0;

    return (
        <div>
            <div className="cartItems">
                <div className="productsList">
                    {products.length === 0 ?
                        <>
                            <div className="emptyCart">
                                <h3 style={{ marginBottom: '10px' }}>Your shopping cart is empty</h3>
                                <p>Add your favorite items in it.</p>
                            </div>

                        </>
                        :
                        <>
                            <div className="selectAll">

                                <div>
                                    <FontAwesomeIcon icon={checkedItems.length > 0 ? faCircleCheck : faCircle} onClick={handleSellectAll} />
                                </div>
                                <span>Sellect all</span>
                            </div>
                            {products?.map((item, index) => (
                                <div key={index} className="cartItem">
                                    <div onClick={() => toggleChecked(item.id)} className='checkedClass' >
                                        <FontAwesomeIcon icon={checkedItems.includes(item.id) ? faCircleCheck : faCircle} />
                                    </div>

                                    <img src={`http://localhost:2010${item.img}`} alt="" />

                                    <div style={{ textAlign: 'left' }}>

                                        <h3 style={{ margin: '15px 0' }}>{item?.name}</h3>

                                        <p>{item?.description}</p>

                                        <div className='starRatingClass' style={{ display: 'flex', marginTop: '10px' }}>
                                            <StarRating rating={item?.rating} />
                                            <p style={{ marginLeft: '10px' }}>{item?.rating}</p>
                                        </div>

                                        <div className='priceAndQuantity' >
                                            <p >{item?.price || 0}$</p>
                                            <div className='qunatityClassCart' >
                                                <span onClick={() => updateQuantity(item.id, 'dec')}>-</span>
                                                <p >{item?.quantity}</p>
                                                <span onClick={() => updateQuantity(item.id, 'inc')} style={{ marginBottom: '5px' }}>+</span>
                                            </div>

                                        </div>

                                    </div>
                                    <FontAwesomeIcon icon={faTrash} onClick={() => handleDeleteProduct(item.id)} className="trashClass" />
                                </div>
                            ))}
                            {isMobile ? (
                                <>
                                    <div className="orderSummary">
                                        <h3>Order Summary</h3>
                                        <p>Item(s) total: <span>{itemsTotal} $</span></p>
                                         <button onClick={() => { products.length > 0 ? alert('Your order has been successfully placed.') : alert('Your shopping cart is empty')}}>Buy now</button>
                                    </div>
                                    <Products/>
                                </>

                            )
                                :
                                (
                                    <Products />
                                )
                            }

                        </>
                    }
                </div>

                {!isMobile &&
                    <div className="orderSummary">
                        <h3>Order Summary</h3>
                        <p>Item(s) total: <span>{itemsTotal} $</span></p>
                             <button onClick={() => { products.length > 0 ? alert('Your order has been successfully placed.') : alert('Your shopping cart is empty')}}>Buy now</button>
                    </div>
                }
            </div>

        </div>
    )
}

export default CartProduct 