/* eslint-disable no-unreachable */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

import { useContext, useEffect, useState } from 'react';
import { useContextAuth } from '../context/Context';
import { SuccessfullyCreated } from '../modals/SuccessfullyCreated';


export const Registration = () => {

    const [confirmEmail, setConfirmEmail] = useState(false);
    const [showLogin, setShowLogin] = useState(false)
    const [formErrors, setFormErrors] = useState({});
    const { setMode, state, dispatch, mode, setShowConfirmation } = useContextAuth();


    const validate = (values) => {
        const errors = {};

        if (!values.firstName) {
            errors.name = 'Name is required.'
        } else if (values.firstName.length > 20) {
            errors.name = 'Name must contain a maximum of 20 alphabetic characters.'
        }
        else if (!values.lastName) {
            errors.lastName = 'Last name is required.'
        } else if (values.lastName.length > 20) {
            errors.lastName = 'Prezime mora da sadrži najviše 20 znakova alfabeta.'
        }
        else if (!values.email) {
            errors.email = 'E-mail is required.'
        }
        else if (!values.password) {
            errors.password = 'Password is required.'
        } else if (values.password.split('').every((e => !/[A-Z]/.test(e)))) {
            errors.password = "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, and one number."
        } else if (values.password.split('').every((e => !/[a-z]/.test(e)))) {
            errors.password = "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, and one number."
        } else if (values.password.split('').map(e => Number(e)).every(e => isNaN(e))) {
            errors.password = "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, and one number."
        } else if (values.password.length < 6) {
            errors.password = "Password must contain at least 6 characters, one uppercase letter, one lowercase letter, and one number."
        }
        else if (!values.confirmPassword) {
            errors.confirmPassword = "Password confirmation is required."
        } else if (values.password !== values.confirmPassword) {
            errors.confirmPassword = "Passwords do not match."
        }

        return errors
    }

    const handleChange = (e) => {
        dispatch({ type: "FROM_CHANGE", name: e.target.name, value: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = validate(state.formData);
        setFormErrors(errors)

        if (Object.keys(errors).length !== 0) return;

        dispatch({ type: "LOADING", isLoading: true })

        try {
            const res = await fetch('http://localhost:2010/api/user', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state.formData)
            })

            const data = await res.json()

            if (!res.ok) {
                dispatch({ type: "LOADING", isLoading: false })
                dispatch({ type: "ERROR", isError: data.error })
                console.error('Backend error:', data.error);
            } else {
                dispatch({ type: "LOADING", isLoading: false })
                dispatch({ type: "LOGIN", payload: data })
                console.log('User successfully registered');
                setShowConfirmation(true);
            }

        }
        catch (e) {
            dispatch({ type: "LOADING", isLoading: false })
            dispatch({ type: "ERROR", isError: e.message })
        }
    }


    return <div className='registerStyle'>

        <h2>Sign Up</h2>

        <form onSubmit={handleSubmit}>
            <label htmlFor="firstName">
                <h5>FirstName *</h5>
                <input type='text' name='firstName' onChange={handleChange} placeholder="FirstName" id='firstName' value={state.formData.firstName} />
            </label>
            {formErrors.name && <p className='errorMsg'>{formErrors.name}</p>}
            <label htmlFor="lastName">
                <h5>LastName *</h5>
                <input type='text' name='lastName' onChange={handleChange} placeholder="LastName" id='lastName' value={state.formData.lastName} />
            </label>
            {formErrors.lastName && <p className='errorMsg'>{formErrors.lastName}</p>}
            <label htmlFor="e-mail">
                <h5>E-mail *</h5>
                <input type='email' name='email' onChange={handleChange} placeholder="E-mail address" id='e-mail' value={state.formData.email} />
            </label>
            {formErrors.email && <p className='errorMsg'>{formErrors.email}</p>}
            <label htmlFor="password">
                <h5>Password *</h5>
                <input type='text' name='password' onChange={handleChange} placeholder="Password" id='password' value={state.formData.password} />
            </label>
            {formErrors.password && <p className='errorMsg'>{formErrors.password}</p>}
            <label htmlFor="confirmPassword">
                <h5>Confirm Password *</h5>
                <input type='text' name='confirmPassword' onChange={handleChange} placeholder="Confirm Password" id='confirmPassword' value={state.formData.confirmPassword} />
            </label>
            {formErrors.confirmPassword && <p className='errorMsg'>{formErrors.confirmPassword}</p>}

            <button type='submit'>Sign Up</button>

        </form>

        <p>
            Already have an account? <span onClick={() => setMode('login')}> Log in </span>
        </p>
    </div>

}