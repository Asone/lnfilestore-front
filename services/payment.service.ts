import { client } from '../client'
import { ApolloClient, NormalizedCache, NormalizedCacheObject, gql, ApolloQueryResult, FetchPolicy, ObservableQuery, WatchQueryFetchPolicy } from '@apollo/client';
import { DocumentNode } from '@apollo/graphql';
import { GetInvoiceForMediaResponse, getInvoiceForMediaQuery } from '../graphql/queries/invoiceForMedia.gql';
import { PaymentTypeInterface } from '../interfaces/PaymentType.interface';
import { MediaInterface } from '../interfaces/Media.interface';
export class MediaPaymentService {
    protected client: ApolloClient<NormalizedCacheObject>;

    public mediaFragment = gql`    
        fragment mediaFragment on Media {
            uuid
            mediaInvoice @client
        }`;


    constructor( client: ApolloClient<NormalizedCacheObject> ) {
        this.client = client;
    }

    public readCachedPaymentRequest = ( uuid: string ): Promise<PaymentTypeInterface | null> => {
        const fragment = gql`
            fragment paymentFragment on Payment{
                paymentRequest
                state
            }`;

        const object: PaymentTypeInterface | null = this.client.readFragment<PaymentTypeInterface>( {
            fragment,
            id: `Payment:${ uuid }`
        } );
        return Promise.resolve( object );
    };

    // public readCachedPaymentRequest = ( uuid: string ): Promise<MediaInterface | null> => {
    //     const fragment = this.mediaFragment;
    //     const object: MediaInterface | null = this.client.readFragment<MediaInterface>( {
    //         fragment,
    //         id: `Media:${ uuid } `
    //     } );

    //     return Promise.resolve( object );
    // };

    // public writeCachedPaymentRequest = ( uuid: string, payment: PaymentTypeInterface ): Promise<PaymentTypeInterface> => {

    //     const object = this.client.writeFragment<MediaInterface>( {
    //         id: `Media:${ uuid } `,
    //         data: {
    //             uuid,
    //             mediaInvoice: payment
    //         },
    //         fragment: this.mediaFragment
    //     } );

    //     return Promise.resolve( payment );
    // };

    requestMediaInvoice = ( uuid: string, fetchPolicy: FetchPolicy = 'cache-first', cache: PaymentTypeInterface | null = null ): Promise<PaymentTypeInterface> => {
        const paymentRequest: string | null = cache && cache.paymentRequest ? cache.paymentRequest : null;

        return this.client.query<GetInvoiceForMediaResponse>( {
            query: getInvoiceForMediaQuery,
            variables: {
                uuid,
                paymentRequest
            },
            fetchPolicy,
            notifyOnNetworkStatusChange: true,
        } ).then( ( result: ApolloQueryResult<GetInvoiceForMediaResponse> ) => {
            return result.data.requestInvoiceForMedia ? Promise.resolve( result.data.requestInvoiceForMedia ) : Promise.reject();
        } ).catch( ( e ) => Promise.reject() )
    }

    // public mediaInvoiceProvider = ( uuid: string ): Promise<ObservableQuery<GetInvoiceForMediaResponse>> => {
    //     return this.readCachedPaymentRequest( uuid )
    //         .then( ( media: MediaInterface | null ) => {
    //             const mediaInvoice: PaymentTypeInterface | null = media && media.mediaInvoice ? media.mediaInvoice : null;
    //             let fetchPolicy: FetchPolicy;

    //             if ( mediaInvoice
    //                 && ( mediaInvoice.state === 'settled' || (
    //                     mediaInvoice.expiresAt
    //                     && mediaInvoice.expiresAt > ( new Date() ).getTime() )
    //                 )
    //             ) {
    //                 fetchPolicy = 'cache-only'
    //             } else {
    //                 fetchPolicy = 'network-only'
    //             }

    //             return this.requestMediaInvoice( uuid, fetchPolicy, mediaInvoice )
    //         } ).then( ( result: PaymentTypeInterface ) => {
    //             return this.writeCachedPaymentRequest( uuid, result );
    //         } ).then( ( result: PaymentTypeInterface ) => {
    //             return this.watchMediaInvoice( uuid, result );
    //         } );
    // }

    public watchMediaInvoice = ( uuid: string, payment: PaymentTypeInterface, fetchPolicy: WatchQueryFetchPolicy = 'cache-and-network', ): ObservableQuery<GetInvoiceForMediaResponse> => {
        return this.client.watchQuery<GetInvoiceForMediaResponse>( {
            query: getInvoiceForMediaQuery,
            variables: {
                uuid: uuid,
                paymentRequest: payment.paymentRequest
            },
            pollInterval: 10000,
            fetchPolicy,
            refetchWritePolicy: 'overwrite',
        } )
    }

}