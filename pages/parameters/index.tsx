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
import styles from './index.module.scss';
import RestoreCacheModal from '../../components/restore-cache-modal/index';
import DeleteCacheModal from '../../components/delete-cache-modal/index';
import { CacheDataHelpModal } from '../../components/cache-data-help-modal';

const ParametersPage: NextPage = () => {

    const localStorageService = new LocalStorageService();

    const [show, setShow] = useState( false );

    const [file, setFile] = useState<File>();
    const [showRestoreCacheModal, UpdateShowRestoreCacheModal] = useState<boolean>( false );
    const [showDeleteCacheModal, UpdateShowDeleteCacheModal] = useState<boolean>( false );
    const [showCacheHelpModal, UpdateShowCacheHelpModal] = useState<boolean>( false );

    useEffect( () => {
        if ( !file ) return;

        const reader = new FileReader();

        file.text().then( ( content: string ) => {
            try {
                const data = JSON.parse( content );
                let r = client.cache.restore( data );

            } catch ( e ) {
                console.error( "An error while parsing the file happened" );
            }
        } )
            ;
    }, [file] )

    const downloadBackup = () => {
        try {
            let cache: NormalizedCacheObject = client.cache.extract();
            const data = JSON.stringify( cache );
            const blob = new Blob( [data], { type: "application/json" } );
            saveAs( blob, "lnfilestore-cache-backup.json" );
        } catch ( e ) {

        }
    }

    const displayCacheClearModal = () => null
    const displayRestoreCacheModal = () => UpdateShowRestoreCacheModal( true );
    const closeRestoreCacheModal = () => UpdateShowRestoreCacheModal( false );
    const displayDeleteCacheModal = () => UpdateShowDeleteCacheModal( true );
    const closeDeleteModal = () => UpdateShowDeleteCacheModal( false );
    const displayCacheHelpModal = () => UpdateShowCacheHelpModal( true );
    const closeCacheHelpModal = () => UpdateShowCacheHelpModal( false );
    return (
        <>
            <RestoreCacheModal show={showRestoreCacheModal} handleClose={closeRestoreCacheModal} />
            <DeleteCacheModal show={showDeleteCacheModal} handleClose={closeDeleteModal}></DeleteCacheModal>
            <CacheDataHelpModal show={showCacheHelpModal} handleClose={closeCacheHelpModal}></CacheDataHelpModal>
            <div className="container">
                <div className="col-4 offset-4">
                    <div className="card bg-transparent">
                        <div className={`card-header bg-secondary text-light bg-opacity-50 ${ styles.parametersFormHeader }`}>
                            <i className="icon-lifebuoy float-end clickable" onClick={displayCacheHelpModal}></i>
                            Data back-up
                        </div>
                        <div className={`card-body bg-light bg-opacity-25 ${ styles.parametersFormBody }`}>
                            <button type="button" className="btn btn-primary col-12 mb-2" onClick={downloadBackup}>
                                <i className="icon-download-cloud"></i> &nbsp;
                                Download back-up
                            </button>
                            <button type="button" className="btn btn-warning col-12 mb-2" onClick={displayDeleteCacheModal}>
                                <i className="icon-trash-empty"></i> &nbsp;
                                Clear cache
                            </button>
                            <button type="button" className="btn btn-light col-12 mb-2" onClick={displayRestoreCacheModal}>
                                <i className="icon-back-in-time"></i> &nbsp;
                                Restore back-up
                            </button>


                            {/*
                            <FileUploader name="file" handleChange={handleChange} />
                            <button type="button" className="btn btn-primary" onClick={restoreCache}>Restore</button>

                            <hr />
                            <button className="btn btn-primary" type="button" onClick={handleShow}>Back-up cache</button>
                            <button className="btn btn-warning" type="button" onClick={handleShow}>Clear local cache</button> */}
                        </div>
                    </div>
                </div>
            </div>
        </> )
}

export default ParametersPage;