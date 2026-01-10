import ReactDOM, { createPortal } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation, faX } from '@fortawesome/free-solid-svg-icons'

export const NotSubmitModal = ({closeModal}) => {

    return ReactDOM.createPortal(<div className='notSubmitMainContainer'>
        <div className='notSubmitContainer'>
            <FontAwesomeIcon 
                icon={faX} 
                className='closeBtn'
                onClick={() => closeModal(false)}
                />
            <FontAwesomeIcon icon={faTriangleExclamation} className='errorClass'/>
            <p>Username or password are incorrect!</p>
        </div>
    </div>, document.getElementById('notSubmitModal'))
}