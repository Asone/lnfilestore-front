import { AnimatePresence, motion, Variants } from 'framer-motion';
import * as React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import styles from './index.module.scss';
interface Props {
    children: React.ReactNode
}
const TransitionComponent: React.FC<Props> = ( props: Props ) => {

    return (
        <div className={styles.effectContainer}>
            <AnimatePresence
                initial={false}

            >
                {props.children}
            </AnimatePresence>
        </div>
    );
};

export default TransitionComponent;