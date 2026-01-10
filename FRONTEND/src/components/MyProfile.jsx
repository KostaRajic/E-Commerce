/* eslint-disable react/jsx-key */
import { useNavigate } from "react-router-dom"
import { useContextAuth } from "../context/Context";

export const MyProfile = () => {
    const navigate = useNavigate()
    
    const { state } = useContextAuth()

    const allowedKeys = [ 'image', 'username', 'firstName', 'lastName', 'email']

    return <div className="myProfileClass">
                     {state.user ? Object.entries(state.user)
                    .filter(([key]) => allowedKeys.includes(key))
                    .map(([key, value]) => (
                        <p key={key}>
                            { key === 'image' ? <img src={value} alt="User Image" /> : <div><strong>{key}:</strong> {value}</div>}
                        </p>
                    )) : ''}
            <button onClick={() => navigate(-1)}>Back</button>
    </div>
}