/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useContextAuth } from "../context/Context"
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { setMode, login, formErrors, setFormErrors } = useContextAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    // const [formErrors, setFormErrors] = useState({});

    // const [usersFromBD, setUsersFromDB] = useState([])
    // const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // useEffect(() => {

    //     const getUsers = async () => {
    //         setLoading(true);

    //         const token = sessionStorage.getItem('token');

    //         try {
    //             const res = await fetch('http://localhost:2010/api/users', {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             })

    //             const usersFromDB = await res.json()
    //             if (!res.ok) throw new Error(usersFromDB.error || "Fetch error");
    //             setUsersFromDB(usersFromDB);

    //             setLoading(false);
    //         } catch (e) {
    //             dispatch({ type: "ERROR", payload: true });
    //             setLoading(false);
    //         }

    //     }
    //     getUsers()
    // }, [])

    const validate = (values) => {
        const errors = {};

        if (!values.email) {
            errors.email = 'Email is required.'
        } if (!values.password) {
            errors.password = 'Password is required.';
        }

        return errors;
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate(formData)
        setFormErrors(errors)

        if (Object.keys(errors).length > 0) return;

        const user = await login(formData.email, formData.password);

        if (user?.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/');
        }

    }

    return (
        <>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>


                <div>
                    <label htmlFor='email'>Email</label>
                    <input type="email" id='email' name='email' value={formData.email} onChange={handleChange} placeholder="E-mail address" />
                </div>
                {formErrors.email && <p className='errorMsg'>{formErrors.email}</p>}
                {formErrors?.general && (
                    <p className="errorMsg">{formErrors.general}</p>
                )}
                <div>
                    <label htmlFor='password'>Password</label>
                    <input type="password" id='password' name='password' value={formData.password} onChange={handleChange} placeholder="Password" />
                </div>
                {formErrors.password && <p className='errorMsg'>{formErrors.password}</p>}
                {formErrors?.general && (
                    <p className="errorMsg">{formErrors.general}</p>
                )}
                <br />

                <button type="submit">Sign In</button>

                <p>
                    Don't have an account? <br />
                    <span className="createAccount" onClick={() => setMode('register')}>Create one</span>
                </p>
            </form>
        </>
    )
}