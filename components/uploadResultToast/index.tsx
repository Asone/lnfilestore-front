import { FormEvent, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

interface Props {
    show: boolean,
    status: string,
    closeAction?: () => void
}

const UploadResultToast: React.FC<Props> = ( props: Props ) => {
    return (
        <ToastContainer position="top-end">
            <Toast bg={props.status} show={props.show} onClose={props.closeAction} >
                <Toast.Header closeButton={true}>

                    <strong className="me-auto">Test</strong>

                </Toast.Header>
            </Toast>
        </ToastContainer>
    )
}

export default UploadResultToast;