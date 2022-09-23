import { gql, ObservableQuery, useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { client } from '../../client';
import { GetInvoiceForMediaResponse, getInvoiceForMediaQuery } from '../../graphql/queries/invoiceForMedia.gql';
import { MediaInterface } from '../../interfaces/Media.interface';
import { PaymentTypeInterface } from '../../interfaces/PaymentType.interface';
import { MediaPaymentService } from '../../services/payment.service';
import getConfig from 'next/config';
import { saveAs } from 'file-saver';
import { Subscription } from '@apollo/client/react/components';
import { Toast, ToastContainer } from 'react-bootstrap';
import InvoiceRestoreModal from '../invoice-restore-modal';
import { BitcoinLoaderComponent } from '../loader/loader.component';
import styles from './index.module.scss';
import { AnimatePresence, motion, Variants } from 'framer-motion';
interface Props {
    uuid: string;
}
const config = getConfig();

const Payment: React.FC<Props> = ( props: Props ) => {

    const variants: Variants = {
        out: {
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.15,
                ease: 'easeOut'
            }
        },
        in: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.15,
                ease: 'easeIn'
            }
        }
    };
    const mediaPaymentService: MediaPaymentService = new MediaPaymentService( client );
    const router = useRouter();
    let [loading, updateLoading] = useState<boolean>( true );
    let [isSettled, UpdateSettlement] = useState<boolean>( false );
    let [uuid, updateUuid] = useState<string>( props.uuid );
    let [paymentRequest, updatePaymentRequest] = useState<string>();
    let [mediaInvoice, updateMediaInvoice] = useState<PaymentTypeInterface>();
    let [showCopyPasteToast, updateCopyPasteToast] = useState<boolean>( false );
    let [showInvoiceRestoreModal, updateShowInvoiceRestoreModal] = useState<boolean>( false );

    let [getMediaInvoice, { data, error }] = useLazyQuery<GetInvoiceForMediaResponse>( getInvoiceForMediaQuery, {
        variables: {
            uuid,
            paymentRequest: paymentRequest
        },
        onCompleted: ( invoice ) => {

            if ( loading ) updateLoading( false );
            updatePaymentRequest( invoice.requestInvoiceForMedia.paymentRequest );

            if ( invoice.requestInvoiceForMedia.state === 'settled' ) {

                UpdateSettlement( true );
            }
        },
        onError: ( error ) => {
            console.error( "An error happened while fetching media invoice" );
            console.trace( error );
            setTimeout( () => {
                updatePaymentRequest( undefined )
            }, 15000 );
        },
        fetchPolicy: 'cache-and-network',
        pollInterval: 30000,
        returnPartialData: true
    } );


    useEffect( () => {
        if ( data && data.requestInvoiceForMedia.paymentRequest ) {
            updatePaymentRequest( data.requestInvoiceForMedia.paymentRequest );
        }
    }, [data] );

    const closeInvoiceRestoreModal = ( invoice: string | null ): void => {

        if ( invoice ) updatePaymentRequest( invoice );
        updateShowInvoiceRestoreModal( false );
    }
    const copyToClipboard = () => {
        if ( !paymentRequest ) return;
        navigator.clipboard.writeText( paymentRequest );
        updateCopyPasteToast( true );
    }
    // Wait for query to be loaded with a uuid to handle the rest of the process
    useEffect( () => {
        if ( router.query.uuid && !Array.isArray( router.query.uuid ) ) updateUuid( router.query.uuid );
    }, [router.query] );


    useEffect( () => {
        // If there's no uuid, we should go any further. This also means there's a problem here
        if ( !uuid ) return;

        mediaPaymentService.readCachedPaymentRequest( uuid ).then( ( invoice ) => {
            if ( invoice && invoice.paymentRequest ) {
                updatePaymentRequest( invoice.paymentRequest );
            }
            return getMediaInvoice();
        } );
    }, [uuid] );

    useEffect( () => {
        if ( mediaInvoice && mediaInvoice.state === 'settled' ) {
            UpdateSettlement( true );
        }
    }, [paymentRequest] );

    useEffect( () => {
        if ( isSettled ) {
            setTimeout( () => {
                router.push( `${ config.publicRuntimeConfig.api_host }/file/${ uuid }${ paymentRequest ? "?invoice=" + paymentRequest : '' }` );
                // saveAs( `${ config.publicRuntimeConfig.api_host }/file/${ uuid }${ paymentRequest ? "?invoice=" + paymentRequest : '' }`, undefined,  );

            }, 3000 );
        }
    }, [isSettled] )

    useEffect( () => {
        if ( showCopyPasteToast ) {
            setTimeout( () => {
                updateCopyPasteToast( false );
            }, 2500 );
        }
    }, [showCopyPasteToast] );

    const cardContent = () => {

        if ( loading && !paymentRequest ) {
            return (
                <>
                    <BitcoinLoaderComponent />
                    Loading...
                </>
            );
        }

        if ( isSettled ) {
            return (
                <>
                    <i className={`text-success icon-ok-circled ${ styles.filePaymentSuccess }`}></i>
                    <div>File paid.</div>
                    <br />
                    <div>Your download will begin shortly...</div>
                </>

            );
        }

        if ( paymentRequest ) {

            return (
                <>

                    <div className="col-12 mb-3"><b>Scan the QR code below</b></div>
                    <div className="col-12">
                        <QRCodeCanvas value={paymentRequest} width="200" height="200" onClick={copyToClipboard} aria-label={paymentRequest} className="clickable"></QRCodeCanvas>
                    </div>
                    <div className="col-12 mt-3">or copy and paste its value by clicking onto the qr code</div>
                </>
            );

        }

        return ( <></> );
    }

        return (
            <>
                <InvoiceRestoreModal show={showInvoiceRestoreModal} updateInvoice={closeInvoiceRestoreModal} />
                <AnimatePresence
                    initial={false}
                    exitBeforeEnter
                >
                    <motion.div
                        variants={variants}
                        animate="in"
                        initial="out"
                        exit="out"
                        className="col-12 col-md-8 col-lg-8 text-center"
                    >
                        <div>
                            <div className="card bg-transparent">
                                <h5 className={`card-header bg-secondary text-light bg-opacity-50 ${ styles.paymentFormHeader }`}> File payment
                                    <span className="float-end bg-light text-dark badge clickable"><i className="icon-back-in-time cursor-pointer" onClick={() => updateShowInvoiceRestoreModal( true )}></i></span>
                        </h5>
                                <div className={`card-body bg-light bg-opacity-25 ${ styles.paymentFormBody }`}>

                                    <div className="card col-12 col-md-6 offset-0 offset-md-3">
                                        <div className="card-body text-center">
                                            {cardContent()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
                <ToastContainer position="bottom-end">
                            <Toast bg="success" show={showCopyPasteToast}>
                                <Toast.Header closeButton={false}>
                            <strong className="me-auto">Copied in clipboard !</strong>
                                </Toast.Header>
                            </Toast>
                </ToastContainer>
            </>

        )

}

export default Payment;