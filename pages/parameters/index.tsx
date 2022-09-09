import { NextPage } from 'next';
import { Button, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { LocalStorageService } from '../../services/localstorage.service';
import { client } from '../../client';
import { NormalizedCacheObject, gql } from '@apollo/client';
import { PaymentTypeInterface } from '../../interfaces/PaymentType.interface';
import { saveAs } from 'file-saver';
import { FileUploader } from 'react-drag-drop-files';
import { getInvoiceForMediaQuery } from '../../graphql/queries/invoiceForMedia.gql';

const ParametersPage: NextPage = () => {

    const localStorageService = new LocalStorageService();

    const [show, setShow] = useState( false );

    const [file, setFile] = useState<File>();

    const handleClose = () => setShow( false );
    const handleShow = () => setShow( true );
    const handleChange = ( file: File ) => {
        setFile( file );
    };

    useEffect( () => {
        if ( !file ) return;

        const reader = new FileReader();

        file.text().then( ( content: string ) => {
            try {
                const data = JSON.parse( content );
                let r = client.cache.restore( data );

                console.log( r );
            } catch ( e ) {
                console.error( "An error while parsing the file happened" );
            }
        } )
            ;
    }, [file] )
    const downloadBackup = () => {
        let cache: NormalizedCacheObject = client.cache.extract();
        let payments: PaymentTypeInterface[] = [];
        let paymentKeys = Object.keys( cache ).filter( ( key => /Payment/.test( key ) ) );

        const data = JSON.stringify( cache );
        const blob = new Blob( [data], { type: "application/json" } );
        saveAs( blob, "payments-backup.json" );
    }

    const clearCache = () => {

        console.log( 'empty local storage entry for cache' );
    }

    const restoreCache = () => {

    }

    return (
        <>
            <h2>Parameters</h2>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Clear cache</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to clear your local cache ?
                    <div className="alert alert-warning">
                        Deleting the cache will also erase the payment keys locally stored.
                        <br />
                        You should ensure that you have a backup of those if you intend
                        to download again some files without having to repay for it.
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={downloadBackup}>
                        Backup payments
                    </Button>
                    <Button variant="warning" onClick={clearCache}>
                        Clear Cache
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="container">
                <div className="col-4">
                    <div className="card">
                        <div className="card-header">
                            Cache management
                        </div>
                        <div className="card-body">
                            {/* <form>
                            <label htmlFor="password" className="label">Change password : </label>
                            <input type="password" name="password" className="form-control" />
                        </form> */}
                            <div className="alert alert-info">
                                Ad lorem ipsum

                            </div>
                            <FileUploader name="file" handleChange={handleChange} />
                            <button type="button" className="btn btn-primary" onClick={restoreCache}>Restore</button>

                            <hr />
                            <button className="btn btn-primary" type="button" onClick={handleShow}>Back-up cache</button>
                            <button className="btn btn-warning" type="button" onClick={handleShow}>Clear local cache</button>
                        </div>
                    </div>
                </div>
            </div>
        </> )
}

export default ParametersPage;