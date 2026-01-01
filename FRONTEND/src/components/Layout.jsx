/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */

import { Outlet, useNavigate } from "react-router-dom";
import { LuUser } from "react-icons/lu";
import logo from "../assets/images/logo.png";
import { useContextAuth } from "../context/Context";
import { Fragment, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faArrowRightFromBracket,
  faShoppingCart
} from "@fortawesome/free-solid-svg-icons";
import { ScrollToTop } from "./ScrollToTop";


export const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { logout, theme, setTheme, setShowAuth, isAuthenticated, state, role } = useContextAuth();
  const [dropdown, setDropdown] = useState(false);

  const refMethod = useRef()

  const handleClickOutside = (e) => {
    if (refMethod.current && !refMethod.current.contains(e.target)) {
      setDropdown(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return (() => {
      document.removeEventListener('mousedown', handleClickOutside);
    })
  }, [dropdown])


  const handleChangeTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };


  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdown(false);
    setShowAuth(false)
  };

  const handleProfile = () => {
    navigate("profile");
    setDropdown(false);
  };

  const handleLoginButton = () => {
    if (isAuthenticated) {
      setDropdown(true)

    } else if (!isAuthenticated) {
      setShowAuth(true)
    }
  }

  const sumOfProducts = state?.cart?.reduce(
    (accumulator, currentValue) => accumulator + (currentValue?.quantity || 0),
    0
  ) || 0;


  return (
    <div>
      <header>
        <nav>

          <div className="img-box">
            <img src={logo} alt="" style={{ cursor: 'pointer' }} onClick={() => {
              if (role === 'admin') {
                navigate('/admin');
              } else {
                navigate('/');
              }; setShowAuth(false)
            }} />
            <Fragment>
              <div className={dropdown ? "menu active" : "menu"} ref={refMethod}>
                <ul>
                  <li onClick={handleProfile}>
                    <FontAwesomeIcon icon={faUser} />
                    My Profile
                  </li>
                  <li onClick={handleLogout}>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    Log Out
                  </li>
                </ul>
              </div>
            </Fragment>
          </div>

          <div
            className="reactSwitch"
          >
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            <svg
              className="light-dark-mode"
              aria-hidden="true"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              onClick={handleChangeTheme}
              checked={theme === "dark"}
            >
              <circle
                cx="12"
                cy="12"
                r="6"
                mask="url(#moon-mask)"
                fill="currentColor"
              />
              <g stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </g>
            </svg>
          </div>

          <div style={{ display: 'flex' }}>
            {isAuthenticated ? (
              <button className="cartBtn" >
                <FontAwesomeIcon icon={faShoppingCart} onClick={() => { setShowAuth(false); navigate('/cart', { state: { product: state?.cart } },) }} />
                {sumOfProducts > 0 && (
                  <div>
                    <span style={{ right: sumOfProducts == 1 && '7px' }}>{sumOfProducts}</span>
                  </div>
                )}
              </button>
            ) : null}
            <button className="loginBtnClass" onClick={handleLoginButton}>
              <LuUser />
            </button>
          </div>


          {/* <div className="loginBtnClass">
            {!isAuthenticated && (
              <button onClick={handleLoginButton}>Log In</button>
            )}
          </div>
          <div className="loginBtnClass">
            {!isAuthenticated && (
              <button onClick={handleLoginButton}>Sign</button>
            )}
          </div> */}
        </nav>
      </header>
      {/* {landingImage ?
              <img src={onlineShopping} alt="Online Shopping" className='landingImageClass'/>
            :
            ''} */}
      <ScrollToTop/>
      <Outlet />
    </div>
  );
};