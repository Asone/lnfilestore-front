import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { client } from '../../client';

interface Props {
    show: boolean,
    handleClose?: () => void
}

export const DeleteCacheModal = ( props: Props ) => {

    const clearCache = () => {
        client.cache.reset().then( () => { if ( props.handleClose ) props.handleClose() } );
    }


    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Restore cache</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to clear your local data cache ?
                <div className="alert alert-warning mt-3">
                    Deleting the cache will also <b>erase</b> the payment keys locally stored.
                    <br />
                    You should ensure that you have a backup of those if you intend
                    to download again previously paid files.
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-warning"><i className="icon-trash-empty" onClick={clearCache}></i>Clear</button>
                <button className="btn btn-primary">Close</button>
            </Modal.Footer>
        </Modal> )

}

export default DeleteCacheModal;