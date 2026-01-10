
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-undef */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContextAuth } from "../context/Context";
import { Spinner } from "../components/Spinner";
import { Pagination } from "../components/Pagination";
import { SearchComponent } from "../components/SearchComponent";
// import SignInModal from "../modals/SignIngModal";
import AuthModal from "../modals/AuthModal";
import SignInModal from "../modals/SignIngModal";
import products from "../data/products";
import { SuccessfullyCreated } from "../modals/SuccessfullyCreated";


export const Products = () => {
  const { state, dispatch, showAuth, setShowAuth, isAuthenticated, showConfirmation, setShowConfirmation } = useContextAuth();
  const [productsDB, setProductsDB] = useState(products);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [currentPage, setCurrentPage] = useState(1);
  const [productID, setProductID] = useState(null)
  const postsPerPage = 10;
  const navigate = useNavigate()


  // useEffect(() => {
  //   async function getProducts() {
  //     let url = searchQuery
  //       ? "https://dummyjson.com/products/search"
  //       : `https://dummyjson.com/products`;
  //     const params = new URLSearchParams();
  //     if (skip) params.append("skip", skip.toString());
  //     if (searchQuery) params.append("q", searchQuery.toString());
  //     const queryString = params.toString();
  //     if (queryString) {
  //       url += `?${queryString}`;
  //     }
  //     try {
  //       setIsLoading(true)
  //       setIsError(false)
  //       const response = await fetch(`${url}`);
  //       const res = await response.json();
  //       setData(res);
  //     } catch (e) {
  //       setIsError(true)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //   getProducts();
  // }, [skip, searchQuery]);

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
        setProductsDB(productsFromDB);
        setFilteredProducts(productsFromDB);

        dispatch({ type: "LOADING", payload: false });
      } catch (e) {
        dispatch({ type: "ERROR", payload: true });
        dispatch({ type: "LOADING", payload: false });
      }

    }
    getProducts()
  }, [])

  useEffect(() => {
    if (isAuthenticated && productID && showAuth) {
      navigate(`/products/${productID}`);
      setShowAuth(false);
      setProductID(null);
    }
  }, [isAuthenticated, productID, showAuth])

  const handleClickProduct = (productId) => {
    if (!isAuthenticated) {
      setProductID(productId);
      setShowAuth(true);
      return
    }

    navigate(`/products/${productId}`);
  };

  if (state.isLoading) {
    return <Spinner />;
  }

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = filteredProducts.slice(firstPostIndex, lastPostIndex)


  const handleSearch = (query) => {

    const lowerQuery = query.toLowerCase();
    const filtered = productsDB.filter(product =>
      product.name.toLowerCase().includes(lowerQuery)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }

  return (
    <div className="productsContainer">
      <SearchComponent onSearch={handleSearch} />
      <div className="productsContent">
        {currentPosts?.map((product) =>
          <div onClick={() => handleClickProduct(product.id)} key={product.id}>
            <img src={`http://localhost:2010${product.img}`} alt={product.name} />
            <p>{product.name}</p>
            <p style={{ paddingBottom: "12px", height: '100%', color: '#7ca982' }}>{product.price}</p>

          </div>
        )}
      </div>

      <Pagination
        total={filteredProducts.length}
        limit={postsPerPage}
        currentPage={currentPage}
        onChange={setCurrentPage}
      />
      {showAuth &&
        <AuthModal closeModal={() => setShowAuth(false)} >
          <SignInModal />
        </AuthModal>
      }
      {showConfirmation && <SuccessfullyCreated showConfirmation={() => setShowConfirmation()} />}
    </div>
  );
};
