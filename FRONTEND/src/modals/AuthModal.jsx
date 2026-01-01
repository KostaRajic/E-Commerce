import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'

export default function AuthModal({ children, closeModal }) {
    const refMethod = useRef()

    const handleClickOutside = (e) => {
        if (refMethod.current && !refMethod.current.contains(e.target)) {
            closeModal()
        }
    }
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return (() => {
            document.removeEventListener('mousedown', handleClickOutside);
        })
    }, [closeModal])



    return createPortal(
        <div className='notSubmitMainContainer' >
            <div className="signInContainer" ref={refMethod}>
               {children}
            </div >
        </div >

        , document.getElementById('signin'))
}