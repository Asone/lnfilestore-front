import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useState, useEffect, FormEvent } from 'react';
import * as React from 'react';
// import { ApolloError, gql, ApolloQueryResult, useLazyQuery } from '@apollo/client';
import { ApolloQueryResult, gql, makeReference, QueryResult, useLazyQuery, useQuery } from '@apollo/client';
import { GetInvoiceForMediaResponse, getInvoiceForMediaQuery } from '../../../graphql/queries/invoiceForMedia.gql';
import { client } from '../../../client';
import { MediaInterface } from '../../../interfaces/Media.interface';
import { MediaPaymentService } from '../../../services/payment.service';
import { QRCodeSVG } from 'qrcode.react';
import { PaymentTypeInterface } from '../../../interfaces/PaymentType.interface';
import Payment from '../../../components/payment/index';
import { MediaService } from '../../../services/media.service';
import { GetMediaResponse, getMediaQuery } from '../../../graphql/queries/getMedia.gql';
import FileCard from '../../../components/filecard';


export interface GetInvoiceForMediaVariables {
    uuid: string | string[] | undefined,
    payment_request: string | undefined
}


const File: NextPage = () => {
    const mediaService = new MediaService( client );
    // const [file, updateFile] = useState<MediaInterface>();

    const router = useRouter();
    const [uuid, updateUuid] = useState<string>();

    useEffect( () => {
        if ( router.query.uuid && !Array.isArray( router.query.uuid ) ) updateUuid( router.query.uuid );
    }, [router.query] );

    let [getMedia, { error, data: fileData, loading }] = useLazyQuery<GetMediaResponse>( getMediaQuery,
        {
            variables: {
                uuid,
                paymentRequest: null
            },
            // onCompleted: ( data ) => {
            //     updateFile( data.getMedia );
            // },
            fetchPolicy: 'cache-and-network',
            returnPartialData: true
        }
    );

    useEffect( () => {
        if ( !uuid ) return;
        getMedia();
    }, [uuid] );


    const handleInvoiceRestore = ( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();

        const formData = new FormData( e.currentTarget );
        const invoice = formData.get( "invoice" );

    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <div className="card">
                            <h5 className="card-header text-light bg-secondary">
                                File information
                            </h5>
                            <div className="card-body bg-light">
                                {uuid && fileData?.getMedia && <FileCard uuid={uuid} media={fileData.getMedia} />}
                            </div>
                        </div>
                    </div>
                    {uuid && <Payment uuid={uuid} />}
                </div>
            </div>
        </>

    )
}
export default File;