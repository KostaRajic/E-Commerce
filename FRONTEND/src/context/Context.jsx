/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";


export const Context = createContext();

const initialState = {
  formData: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  cart: [],
  isLoggedIn: false,
  isLoading: false,
  isError: false,
  user: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FROM_CHANGE":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.name]: action.value
        }
      };
    case "LOGIN":
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true,
        user: action.payload,
      };
    case "LOGOUT":
      return initialState;
    case "ADD_TO_CART":
      {
        const existingProduct = state.cart.find(item => item.id === action.payload.id)

        if (existingProduct) {
          return {
            ...state,
            cart: state.cart.map(item => (
              item.id === action.payload.id ?
                { ...item, quantity: item.quantity + action.payload.quantity }
                :
                item
            ))
          }
        }
        return {
          ...state,
          cart: [...state.cart, action.payload]
        }
      }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter(prev => prev.id !== action.payload)
      }
    case "UPDATE_QUANTITY": {
      return {
        ...state,
        cart: state.cart.map(prev => prev.id === action.payload.id
          ?
          { ...prev, quantity: action.payload.quantity }
          :
          prev
        )
      }
    }
    case "LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "ERROR":
      return {
        ...state,
        isError: action.payload,
      };
    case "SET_ADMIN":
      return {
        ...state,
        isAdmin: action.payload
      }
    default:
      return state;
  }
};

export const useContextAuth = () => {
  return useContext(Context);
};

export const UseContextProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem("token");
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = sessionStorage.getItem("isAuth");
    return saved === "true";
  });

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "dark";
  });
  const [showAuth, setShowAuth] = useState(false)
  const [mode, setMode] = useState('login');
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [product, setProduct] = useState([]);
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState({});

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    document.body.className = theme + "-theme";
  }, [theme]);


  // const loggedUser = useMemo(() => state?.isLoggedIn, [state?.isLoggedIn]);
  const role = useMemo(() => state?.user?.role, [state.user]);

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id })
  }

  const login = async (email, password) => {
    dispatch({ type: "LOADING", payload: true });
    try {
      const response = await fetch('http://localhost:2010/api/login', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!data?.user?.auth) {
        dispatch({ type: "LOADING", payload: false });
        setFormErrors((prev) => ({ ...prev, general: 'Invalid email or password' }))
        return { error: data?.user?.auth };
      }

      if (!response.ok) {
        dispatch({ type: "ERROR", payload: data.error });
        dispatch({ type: "LOADING", payload: false });
        return { error: data.error || data.msg || "Login failed" };
      }

      dispatch({ type: "LOGIN", payload: data.user });

      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem("isAuth", true);

      setIsAuthenticated(true);

      dispatch({ type: "LOADING", payload: false });
      return data.user;
    } catch (e) {
      dispatch({ type: "ERROR", payload: "Server error" });
      return { error: 'Server error' };
    }
  };


  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("isAuth");
    sessionStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div>
      <Context.Provider
        value={{
          login,
          logout,
          state,
          dispatch,
          isAuthenticated,
          setIsAuthenticated,
          theme,
          setTheme,
          showAuth,
          setShowAuth,
          mode,
          setMode,
          showConfirmation,
          setShowConfirmation,
          product,
          setProduct,
          removeFromCart,
          role,
          setFormErrors,
          formErrors
        }}
      >
        {children}
      </Context.Provider>
    </div>
  );
};
