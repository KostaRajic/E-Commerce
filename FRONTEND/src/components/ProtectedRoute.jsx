/* eslint-disable react/prop-types */
import { Spinner } from "./Spinner";
import { useContextAuth } from "../context/Context";
import { Navigate } from "react-router-dom";
import Login from "../logincomponents/Login";

export const ProtectedRoute = ({ children, role }) => {

    const { isAuthenticated, role: userRole, isLoading, } = useContextAuth();

    
    if (isLoading) return <Spinner />

    if (!isAuthenticated) {
        return <Login/>
    }
    if (role && userRole !== role) {
        return <Navigate to="/" />
    }
    return children
};