import { Button, Modal } from 'react-bootstrap';
import styles from './index.module.scss';
import FileUploadComponent from '../file-upload/index';
import { useState } from 'react';

interface Props {
    show: boolean,
    handleClose?: () => void
};

export const RestoreCacheModal: React.FC<Props> = ( props: Props ) => {
    const [file, setFile] = useState<File | null>( null );

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Restore cache</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Provide a back-up of your data cache to restore previously paid access for your files
                <FileUploadComponent file={file}></FileUploadComponent>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-primary"><i className="icon-back-in-time"></i>Restore</button>
            </Modal.Footer>
        </Modal> )
}

export default RestoreCacheModal;