import type { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { getPostQuery, getPostResponse } from '../../../graphql/getPost.gql';
import { Query } from '@apollo/client/react/components';
import { ApolloError, ApolloProvider, ApolloQueryResult, gql, QueryResult, useQuery } from "@apollo/client";
import { GraphQLError } from 'graphql';
// import QRCode from 'react-qr-code';
import { BitcoinLoaderComponent } from '../../../components/loader/loader.component';
import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import { PostInterface } from '../../../interfaces/post';
import { QRCodeSVG } from 'qrcode.react';
import { client } from '../../../client';
const displayQrCode = ( payment_request: string ): JSX.Element => {
    return (
        <div className="col-12 mt-5 text-center">
            <div className="col-4 offset-4">
                <QRCodeSVG value={payment_request}></QRCodeSVG>
            </div>
            <div className={'col-4 offset-4 mt-4 mb-4 ' + styles.paymentRequestText}>
                {payment_request}
            </div>
        </div>
    )
}

const initialQuery = () => { }

const getInvoiceForPostQuery = gql`query requestPaymentForPostQuery($postId: Uuid!){
  requestInvoiceForPost(postId: $postId){
    paymentRequest
    expiresAt
  }
}`;

interface GetInvoiceForPostQueryResponse {
    requestInvoiceForPost: {
        paymentRequest: string,
        expiresAt: number
    }
}

const Post: NextPage = () => {

    const router = useRouter();
    const uuid = router.query.uuid;

    let [payment_request, updatePaymentRequest] = useState<string | null>();
    let [has_payment_request, toggleHasPaymentRequest] = useState<boolean>( false );
    let [payment_state, updatePaymentState] = useState<string>();
    let [post, updatePost] = useState<PostInterface>();


    const getPostInvoiceProcessResponse = ( data: GetInvoiceForPostQueryResponse ): void => {

        if ( data.requestInvoiceForPost
            && data.requestInvoiceForPost.paymentRequest
            && new Date().getTime() < ( data.requestInvoiceForPost.expiresAt * 1000 )
        ) {
            updatePaymentRequest( data.requestInvoiceForPost.paymentRequest );
        } else {
            getPostInvoice.refetch();
        }
        // updatePaymentRequest(data.requestInvoiceForPost.paymentRequest);

    }
    const getPostInvoiceProcessError = ( error: ApolloError ) => {

    }

    const getPostResponseHandler = ( data: getPostResponse ) => {

    }

    /**
     * 
     * @param error The error returned through the API
     */
    const getPostErrorHandler = ( error: ApolloError ) => {
        const gqlErrors = error.graphQLErrors;

        /**
         * Iterates trough the errors returned by API
         */
        gqlErrors.forEach( ( error: GraphQLError ) => {
            if ( error.extensions ) {

                /**
                 * as documented in the API repo,
                 * The request will return a payment_request value if 
                 * theres no payment_request provided initially or if 
                 * the provided request is not opened anymore (canceled or expired).
                 * Thus, the below lines will update the payment_request displayed to user and 
                 * stored in cache. 
                 */
                if ( error.extensions.payment_request ) {
                    updatePaymentRequest( error.extensions.payment_request as string );
                }
            }
        } );
    }

    const skipGetPost = (): boolean => {
        if ( payment_request === undefined ) return true;
        if ( router.isReady && payment_request !== undefined ) return false;
        return true;
        // return !router.isReady && !has_payment_request && payment_request === undefined;
    }


    /**
    * Requests the post
    */
    // const getPost: QueryResult<getPostResponse> = useQuery( getPostQuery, {
    //     variables: {
    //         post: {
    //             paymentRequest: payment_request,
    //             uuid: router.query.uuid
    //         }
    //     },
    //     onCompleted: getPostResponseHandler,
    //     onError: getPostErrorHandler,
    //     notifyOnNetworkStatusChange: true,
    //     skip: skipGetPost(),
    //     pollInterval: 15000
    // } );

    /**
     * calls the query to get an invoice for a specific post.
     * Pay attention to the fetchPolicy as it avoids requesting new invoice as long
     * as we have a persisted query response in localStorage. 
     */
    const getPostInvoice: QueryResult<GetInvoiceForPostQueryResponse, { postId: string | string[] | undefined }> = useQuery( getInvoiceForPostQuery, {
        variables: {
            postId: router.query.uuid
        },
        notifyOnNetworkStatusChange: true,
        skip: !router.isReady && !router.query.uuid,
        onCompleted: getPostInvoiceProcessResponse,
        onError: getPostInvoiceProcessError,
        fetchPolicy: 'cache-first',
    } );

    /**
     * Called when we get a data response for getPostInvoice query. 
     * The response can come from both the cache and/or the API.
     * As the potential cached invoice can be expired, we checks its expiry
     * and refetch a new invoice if needed.
     */
    // useEffect( () => {

    //     if ( router.isReady && getPostInvoice.data && getPostInvoice.data.requestInvoiceForPost ) {
    //         if ( new Date().getTime() > getPostInvoice.data.requestInvoiceForPost.expiresAt * 1000 ) {
    //             getPostInvoice.refetch();
    //         } else {
    //             updatePaymentRequest( getPostInvoice.data.requestInvoiceForPost.paymentRequest );
    //         }

    //     }
    // }, [getPostInvoice.data] );

    useEffect( () => {
        if ( payment_request !== null && payment_request !== undefined ) {
            toggleHasPaymentRequest( true );
        }
    }, [payment_request] );


    if ( payment_request ) {
        return displayQrCode( payment_request );
    }

    if ( post ) {
        return (
            <div className="container">
                <div className="col-12">
                    <div className="col-6 offset-3">
                        {post.content}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Head>
                <title>GraphQLN API Demo</title>
                <meta name="description" content="A demo app using the GraphQLN API" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container">
                <div className="col-12">
                    <div className="col-6 offset-3">
                        <BitcoinLoaderComponent />
                    </div>
                    {/* <Query query={getPost} variables={queryVars} client={client} pollInterval={10000}>
                        {
                            ( result: QueryResult<getPostResponse> ): JSX.Element | null => {
                                if ( result.loading ) {
                                    return (
                                        <div className="col-6 offset-3">
                                            <BitcoinLoaderComponent />
                                        </div>
                                    );
                                }

                                if ( !result.loading
                                    && result.error
                                    && result.error.graphQLErrors.length
                                    && result.error.graphQLErrors[0].extensions
                                    && result.error.graphQLErrors[0].extensions.payment_request
                                ) {
                                    queryVars.post.paymentRequest = result.error.graphQLErrors[0].extensions.payment_request as string;
                                    return displayQrCode( queryVars.post.paymentRequest );
                                } else if ( !result.loading
                                    && result.error
                                    && result.error.graphQLErrors.length
                                    && result.error.graphQLErrors[0].extensions
                                    && !result.error.graphQLErrors[0].extensions.payment_request
                                    && result.error.graphQLErrors[0].extensions.state
                                    && queryVars.post.paymentRequest
                                ) {

                                    return displayQrCode( queryVars.post.paymentRequest );
                                } else if ( !result.loading
                                    && result.error
                                ) {
                                    return ( <div>Error loading data</div> )
                                } else if ( !result.loading
                                    && !result.error
                                    && result.data
                                ) {
                                    return (
                                        <div className="col-6 offset-3">
                                            {result.data.getPost.content}
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div>Nothing to return</div>
                                    );
                                }

                            }
                        }
                    </Query> */}
                </div>
            </div>
        </div>
    )
}

export default Post