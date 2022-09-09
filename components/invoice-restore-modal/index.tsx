import { Modal, Button } from 'react-bootstrap';
import { FormEvent, useState } from 'react';


interface Props {
    show: boolean
    updateInvoice: ( invoice: string | null ) => void
}
const InvoiceRestoreModal: React.FC<Props> = ( props: Props ) => {
    const handleSubmit = ( event: FormEvent<HTMLFormElement> ) => {
        event.preventDefault();

        const formData = new FormData( event.currentTarget );
        const invoice = formData.get( "invoice" );
        props.updateInvoice( invoice ? invoice.toString() : null );
    }

    return (
        <Modal show={props.show} onHide={() => props.updateInvoice( null )}>
            <Modal.Header closeButton>
                <Modal.Title>Restore invoice</Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <p>
                        You can restore a previous provided invoice related to the file you requested
                        by pasting it in the below area. <br />
                        If the previous invoice has been paid you will be able to access directly to the file.
                    </p>

                    <div className="form-group">
                        <label htmlFor="invoice">Invoice : </label>
                        <textarea name="invoice" id="invoice" cols={30} rows={10} className="form-control"></textarea>
                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" type="button">Close</Button>
                    <Button variant="primary" type="submit"><i className="icon-back-in-time"></i>Restore</Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

export default InvoiceRestoreModal;