import { gql, ObservableQuery, useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';
import { client } from '../../client';
import { GetInvoiceForMediaResponse, getInvoiceForMediaQuery } from '../../graphql/queries/invoiceForMedia.gql';
import { MediaInterface } from '../../interfaces/Media.interface';
import { PaymentTypeInterface } from '../../interfaces/PaymentType.interface';
import { MediaPaymentService } from '../../services/payment.service';
import getConfig from 'next/config';
import { saveAs } from 'file-saver';
import { Subscription } from '@apollo/client/react/components';
import { Toast } from 'react-bootstrap';
import InvoiceRestoreModal from '../invoice-restore-modal';

interface Props {
    uuid: string;
}
const config = getConfig();

const Payment: React.FC<Props> = ( props: Props ) => {

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
            updatePaymentRequest( undefined );
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

    if ( loading && !paymentRequest ) {
        return ( <div className="text-center">Loading...</div> )
    }

    if ( isSettled ) {
        return (
            <>
                <div>File paid.</div>
                <br />
                <div>Your download will begin shortly...</div>
            </>
        )
    }


    if ( paymentRequest ) {
        return (
            <>
                <InvoiceRestoreModal show={showInvoiceRestoreModal} updateInvoice={closeInvoiceRestoreModal} />
                <div className="col-8 text-center">
                    <div className="card">
                        <h5 className="card-header bg-secondary text-light">File payment
                            <span className="float-end bg-light text-dark badge"><i className="icon-back-in-time cursor-pointer" onClick={() => updateShowInvoiceRestoreModal( true )}></i></span>
                        </h5>
                        <div className="card-body bg-light">
                            <div>Scan the QR code below :</div>
                            <QRCodeSVG value={paymentRequest} size={256} onClick={copyToClipboard} aria-label={paymentRequest}></QRCodeSVG>
                            <div>or copy and paste its value by clicking onto the qr code</div>
                            <Toast bg="success" show={showCopyPasteToast}>
                                <Toast.Header closeButton={false}>

                                    <strong className="me-auto">Invoice saved to clipboard</strong>

                                </Toast.Header>
                            </Toast>
                        </div>
                    </div>
                </div>
            </>

        )
    }
    return (
        <div>{paymentRequest}</div>
    )
}

export default Payment;