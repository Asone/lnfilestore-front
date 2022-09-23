import { Modal } from 'react-bootstrap';

interface Props {
    show: boolean,
    handleClose?: () => void
}
export const CacheDataHelpModal: React.FC<Props> = ( props: Props ) => {

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>About Cached data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                LN Filestore does not store any information related to the user in its database.
                <br /><br />
                Therefore, all the payments are stored on the browser side inside the localstorage through the cache system provided by Apollo client<br />
                <br />
                This means that if you want to ensure you will keep an access to the previously paid files on your computer or 
                retrieve those accesses to another device you will need to back-up your data by downloading a file containing your cached data.
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary" type="button" onClick={props.handleClose}>Close</button>
            </Modal.Footer>
        </Modal>
    )
}