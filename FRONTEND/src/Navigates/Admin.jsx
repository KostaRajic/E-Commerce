import { useEffect, useState } from "react";
import { useContextAuth } from "../context/Context"
import { useNavigate } from "react-router-dom";

export const Admin = () => {
    const { dispatch, setIsAuthenticated } = useContextAuth();
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {

        const getProducts = async () => {
            dispatch({ type: "LOADING", payload: true });

            const token = sessionStorage.getItem('token');

            try {
                const res = await fetch('http://localhost:2010/api/products', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

                const productsFromDB = await res.json()
                if (!res.ok) throw new Error(productsFromDB.error || "Fetch error");
                setProducts(productsFromDB);

                dispatch({ type: "LOADING", payload: false });
            } catch (e) {
                dispatch({ type: "ERROR", payload: true });
                dispatch({ type: "LOADING", payload: false });
            }

        }
        getProducts()
    }, [])

    const handleDelete = (id) => {
        setProducts(prev => prev.filter(item => item.id !== id))
    }

    const changePrice = (id, type) => {
        setProducts(prev =>
            prev.map(item =>
                item.id === id
                    ?
                    {
                        ...item,
                        price: type === 'inc' ? item.price + 1 : item.price - 1
                    }
                    :
                    item
            )
        )
    }

    return (
        <div className="productsContainer">
            <div style={{ marginTop: '100px' }} className="adminPageHeading ">
                <h2>Admin Page</h2>
                <div>
                    <button onClick={() => {navigate('/admin/add-product'); setIsAuthenticated(true)  }}>+ Add Product</button>
                    <button onClick={() => alert("Changes saved successfully (demo mode — no real data changed)")}>Save Changes</button>
                </div>

            </div>

            <div className="productsContent">
                {products?.map((product) =>
                    <div key={product.id}>
                        <img src={`http://localhost:2010${product.img}`} alt={product.name} />
                        <p>{product.name}</p>
                        <p style={{ paddingBottom: "12px", color: '#7ca982' }}>{product.price}</p>
                        <div className="adminControls">
                            <button onClick={() => handleDelete(product.id)}>🗑</button>
                            <button onClick={() => changePrice(product.id, "inc")}>⬆</button>
                            <button onClick={() => changePrice(product.id, "dec")}>⬇</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Admin;