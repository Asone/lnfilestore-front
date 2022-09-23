import type { NextPage } from 'next';
import Head from 'next/head';
import * as React from 'react';
import styles from '../../styles/Home.module.css';
import { Header } from '../header/header.component';
import TransitionPage from '../transition-page/index';
export const Layout: NextPage = ( { children } ) => {
    return (
        <div className={styles.container + ' px-0'}>

            <Head>
                <title>LN Filestore</title>
                <meta name="description" content="LN Filestore : Buy and sell files through Lightning network" />
                <link rel="icon" href="/lightning.svg" />
            </Head>
            <Header />
            <div className="container">
                <div className="row">
                    <main className="col-12 mt-5">
                        <TransitionPage>
                        {children}
                        </TransitionPage>
                    </main>
                </div>
            </div>
            <footer>
                toto
            </footer>
        </div>

    );
}