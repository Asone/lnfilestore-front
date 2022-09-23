import { NextPage } from 'next';
import { useState } from 'react';
import { LocalStorageService } from '../../services/localstorage.service';
import { client } from '../../client';
import { NormalizedCacheObject } from '@apollo/client';
import { saveAs } from 'file-saver';
import styles from './index.module.scss';
import RestoreCacheModal from '../../components/restore-cache-modal/index';
import DeleteCacheModal from '../../components/delete-cache-modal/index';
import { CacheDataHelpModal } from '../../components/cache-data-help-modal';

const ParametersPage: NextPage = () => {

    // const localStorageService = new LocalStorageService();

    const [showRestoreCacheModal, UpdateShowRestoreCacheModal] = useState<boolean>( false );
    const [showDeleteCacheModal, UpdateShowDeleteCacheModal] = useState<boolean>( false );
    const [showCacheHelpModal, UpdateShowCacheHelpModal] = useState<boolean>( false );

    // Builds cache back-up file and saves on user download folder
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
                        </div>
                    </div>
                </div>
            </div>
        </> )
}

export default ParametersPage;