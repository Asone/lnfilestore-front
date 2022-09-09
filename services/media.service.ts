import { ApolloClient, NormalizedCacheObject, gql, FetchPolicy } from '@apollo/client';
import { MediaInterface } from '../interfaces/Media.interface';
import { GetMediaResponse, getMediaQuery } from '../graphql/queries/getMedia.gql';
export class MediaService {
    protected client: ApolloClient<NormalizedCacheObject>;

    protected mediaFragment = gql`
        fragment media on Media{
            uuid
            description
            createdAt
            fileType
            title
            mediaInvoice @client
        }
    `

    constructor( client: ApolloClient<NormalizedCacheObject> ) {
        this.client = client;
    }

    getMedia = ( uuid: string, paymentRequest?: string, fetchPolicy: FetchPolicy = 'cache-first' ) => {
        return this.client.query<GetMediaResponse>( {
            variables: {
                uuid,
                paymentRequest
            },
            query: getMediaQuery,
            fetchPolicy
        } )
    }

}