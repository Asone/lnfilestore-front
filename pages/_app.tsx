import '../styles/globals.css';
import '../styles/bootstrap/bootstrap.scss';
import '../styles/fontello.scss';
import '../styles/animation.scss';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { client } from '../client';
import { Layout } from '../components/layout/layout.component';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>

            <Layout>
                <>
                    <Component {...pageProps} />
                </>
            </Layout>

        </ApolloProvider>
    )
}

export default MyApp
