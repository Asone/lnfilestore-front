import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Home: NextPage = () => {
    const [hasMounted, setHasMounted] = useState( false );

    useEffect( () => {
        setHasMounted( true );
    }, [] );

    if ( !hasMounted ) {
        return null;
    }

    return (
        <>
            <div className={`card col-6 offset-3 bg-light pt-3 pb-4 border-3 border-light bg-opacity-25 rounded-3 bg-gradient ${ styles.ribbon }`}>

                <div className="card-body  text-center">
                    <h2 className={`mb-0 ${ styles.ribbonText }`} >Lightning <img src="/lightning.svg" className="logo-ribbon" alt='Lightning Network logo'></img> Filestore</h2>
                </div>
                <div className="col-10 offset-1 text-center">
                    Buy data and files over the lightning network !
                </div>
                <div className="col-12 col-md-10 offset-md-1 text-center mt-3">
                    <Link href={'/files'}><button type="button" className="btn btn-light">
                        View files
                    </button>
                    </Link>
                </div>
            </div>

        </>
  )
}

export default Home
