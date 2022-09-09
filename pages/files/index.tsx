import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { filesList, GetFilesListResults } from '../../graphql/queries/filesList.gql';
import { BitcoinLoaderComponent } from '../../components/loader/loader.component';
import { FilesListComponent } from '../../components/filesList/filesLists.component';
import { ApolloError, ApolloProvider, ApolloQueryResult, gql, QueryResult, useQuery } from "@apollo/client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getInvoiceForMediaQuery, GetInvoiceForMediaResponse } from '../../graphql/queries/invoiceForMedia.gql';
import { client } from '../../client';
import { isValidJSValue } from '@apollo/graphql';
import { MediaPaymentService } from '../../services/payment.service';
import { IconService } from '../../services/icon.service';
import { PaymentTypeInterface } from '../../interfaces/PaymentType.interface';
import { MediaInterface } from '../../interfaces/Media.interface';

const Files: NextPage = () => {
    const iconService = new IconService();
    const router = useRouter();
    const mediaPaymentService: MediaPaymentService = new MediaPaymentService( client );

    let [files, updateFilesList] = useState<Array<MediaInterface>>( [] );
    let [isLoading, updateIsLoadingState] = useState<boolean>( true );
    const getFilesListResponseHandler = ( data: GetFilesListResults ) => {
        updateFilesList( data.getFilesList );
        updateIsLoadingState( false );
    }

    const { loading, error, data, previousData, }: QueryResult<GetFilesListResults> = useQuery(
        filesList,
        {
            onCompleted: getFilesListResponseHandler,
            // onError: getPostErrorHandler,
            notifyOnNetworkStatusChange: true,
            fetchPolicy: 'cache-and-network',
            returnPartialData: true,
        }
    );


    useEffect( () => {
        if ( data ) updateFilesList( data.getFilesList );
    }, [data] );

    const getFile = ( file: MediaInterface ) => {
        if ( !file.uuid ) return;

        mediaPaymentService
            .readCachedPaymentRequest( file.uuid )
            .then( ( result ) => {
                if ( result ) {
                    return;
                } else if ( file.uuid ) {
                    return mediaPaymentService.requestMediaInvoice( file.uuid, 'network-only', null )
                }
            } ).then( ( result: PaymentTypeInterface | null | void ) => {
                if ( result && file.uuid ) {
                    // mediaPaymentService.writeCachedPaymentRequest( file.uuid, result )
                }
            } );

    }

    const conditionalButton = ( file: MediaInterface ) => {
        if ( file.mediaInvoice !== null && file.mediaInvoice !== undefined ) {
            return (
                <div className="btn btn-secondary" title="Download">
                    <i className="icon-download-cloud"></i>
                </div>
            )
        } else {
            return (
                <div className="btn btn-primary me-2" title="Pay and download" onClick={( event ) => {
                    getFile( file )
                }}>
                    <i className="icon-cloud-flash"></i>
                </div>
            )
        }
    }



    if ( isLoading && files.length === 0 ) {
        return ( <div>Loading</div> )
    }

    if ( files.length === 0 && !isLoading ) {
        return ( <div>No data found</div> )
    }


    return (
        <div className="card col-8 offset-2">
            <h5 className="card-header bg-secondary text-light">
                Files list
            </h5>
            <div className="card-body bg-light">
                <ul className="list-group">
                    {
                        files.map( ( file: MediaInterface ): JSX.Element => {
                            return (
                                <li
                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                                    key={file.uuid}>
                                    <Link href={`/files/${ file.uuid }/`} passHref>
                                        <a className="text-reset m-1 clearfix fw-bold">
                                            <i className={'icon-' + iconService.getFileTypeIcon( file.fileType )}></i>

                                            {file.title}
                                        </a>
                                    </Link>
                                    <div className="actions">
                                        {/* <div className="btn btn-primary me-2" title="Pay and download" onClick={( event ) => {
                                            getFile( file )
                                        }}>
                                            <i className="icon-cloud-flash"></i>
                                        </div>
                                        <div className="btn btn-secondary" title="Download">
                                            <i className="icon-download-cloud"></i>
                                        </div> */}
                                        {conditionalButton( file )}
                                    </div>
                                </li>
                            )
                        } )
                    }
                </ul>
            </div>
        </div>
    )
}

export default Files;