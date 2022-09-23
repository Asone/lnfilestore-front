import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { filesList, GetFilesListResults } from '../../graphql/queries/filesList.gql';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { client } from '../../client';
import { MediaPaymentService } from '../../services/payment.service';
import { MediaInterface } from '../../interfaces/Media.interface';
import { Nav } from 'react-bootstrap';
import styles from './index.module.scss';
import { QueryResult, useQuery } from '@apollo/client';

const Files: NextPage = () => {
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

    if ( isLoading && files.length === 0 ) {
        return ( <div>Loading</div> )
    }

    if ( files.length === 0 && !isLoading ) {
        return ( <div>No data found</div> )
    }

    return (
        <div className={`card col-md-8 col-12 offset-md-2 bg-transparent`}>
            <h5 className={`card-header bg-secondary text-light bg-opacity-50 ${ styles.filelistHeader }`}>
                Files list
            </h5>
            <div className={`card-body bg-light bg-opacity-25 ${ styles.filelistBody }`}>
                <Nav className="flex-column list-group">
                    {
                        files.map( ( file: MediaInterface ): JSX.Element => {
                            return (
                                <Link href={`/files/${ file.uuid }/`} passHref key={file.uuid}>
                                    <Nav.Link className="list-group-item py-3">
                                        {file.title}
                                        <div className="actions float-end"></div>
                                    </Nav.Link>
                                </Link>
                            )
                        } )
                    }
                </Nav>
            </div>
        </div>
    )
}

export default Files;