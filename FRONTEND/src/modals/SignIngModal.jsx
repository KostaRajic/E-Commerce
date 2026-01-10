/* eslint-disable no-undef */

import { useContextAuth } from '../context/Context';
import { Registration } from '../logincomponents/Register';
import Login from '../logincomponents/Login';


export default function SignInModal({ }) {
    const { mode } = useContextAuth()

    return (
        <>
            {mode === 'login' ? <Login /> : <Registration />}
        </>
    )

}