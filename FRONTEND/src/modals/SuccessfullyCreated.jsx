import { createPortal } from 'react-dom'
import { useContextAuth } from '../context/Context'

export const SuccessfullyCreated = ({ showConfirmation }) => {
    const { setMode, setShowAuth } = useContextAuth()

    const handleConfirmation = () => {
        setMode('login');          
        showConfirmation(false);
        setShowAuth(true);
    }

    return createPortal(
        <div className='notSubmitMainContainer' style={{ zIndex: '1000000000', background: 'black' }}>
            <div className='successfullyCreatedContainer' >
                <h2>Successfully Created!</h2>
                <p>Your account has been created successfully.</p>
                <button onClick={handleConfirmation}>Confirm</button>
            </div>
        </div>,
        document.getElementById('notSubmitModal'))
}