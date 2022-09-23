import { ApolloClient, defaultDataIdFromObject, InMemoryCache } from "@apollo/client";
import { AsyncStorageWrapper, LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';
import { AsyncLocalStorage } from 'async_hooks';
import { createUploadLink } from 'apollo-upload-client';
import getConfig from 'next/config';

const config = getConfig();

const cache = new InMemoryCache( {
    dataIdFromObject( responseObject ) {
        switch ( responseObject.__typename ) {
            case 'Media': return `Media:${ responseObject.uuid }`;
            case 'Payment':
            case 'AvailablePayment':
            case 'SettledPayment':
            case 'ReplacementPayment':
                return `Payment:${ responseObject.mediaUuid }`;
            default: return defaultDataIdFromObject( responseObject );
        }
    },
    possibleTypes: {
        Payment: ["AvailablePayment", "SettledPayment", "ReplacementPayment"]
    }
} );

if ( typeof window !== 'undefined' ) {
    try {
        await persistCache( {
            cache,
            storage: window.localStorage,

        } );
    } catch ( error ) {
        console.error( 'Error restoring Apollo cache', error );
    }
}

export const client = new ApolloClient( {
    link: createUploadLink( { uri: `${ config.publicRuntimeConfig.api_host }/graphql`, credentials: 'include' } ),
    cache
} );
