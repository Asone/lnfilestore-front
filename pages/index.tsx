import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { ApolloProvider, gql, QueryResult, useQuery } from "@apollo/client";
import { Query, Mutation, Subscription } from '@apollo/client/react/components';
import { client } from '../client';
import { postsList, GetPostsListResults } from '../graphql/getPostsList.gql';
import { PostInterface } from '../interfaces';
import { PostsListComponent } from '../components/postsList/postLists.component';
import { BitcoinLoaderComponent } from '../components/loader';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useState, useEffect } from 'react';
const Home: NextPage = () => {
    const [hasMounted, setHasMounted] = useState( false );

    useEffect( () => {
        setHasMounted( true );
    }, [] );

    const { loading, data, error } = useQuery( postsList, {
        client: client
    } );

    if ( !hasMounted ) {
        return null;
    }

    return (
        <>
            <div className="col-12 text-center">
                <h2>Lightning <img src="/lightning.svg" className="logo-ribbon" alt='Lightning Network logo'></img> filestore</h2>
            </div>
            <div className="col-6 offset-3 mt-2 text-center">
                Buy data and files over the lightning network !
            </div>
            <Query query={postsList} client={client}>
                {
                    ( result: QueryResult<GetPostsListResults> ): JSX.Element | null => {
                        if ( result.loading ) {
                            return (
                                <div className="text-center">
                                    <div className="col-6 offset-3 text-center">
                                        <BitcoinLoaderComponent />
                                        <h3>Loading posts</h3>
                                    </div>
                                </div>
                            );
                        } else if ( !result.loading && result.error ) {
                            return (
                                <div>Error loading data</div>
                            );
                        } else if ( !result.data || !result.data.getPostsList ) {
                            return (
                                <div>No data found</div>
                            );
                        }
                        return ( <PostsListComponent posts={result.data.getPostsList} /> );
                    }

                }
            </Query>

        </>
  )
}

export default Home
