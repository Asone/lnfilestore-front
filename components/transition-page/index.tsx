import { AnimatePresence, motion, Variants } from 'framer-motion';
import * as React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';

const TransitionPage: NextPage = ( { children } ) => {
    const { asPath } = useRouter();
    const variants: Variants = {
        out: {
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.15,
                ease: 'easeOut'
            }
        },
        in: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.15,
                ease: 'easeIn'
            }
        }
    };

    return (
        <div className="effect-1">
            <AnimatePresence
                initial={false}
                exitBeforeEnter
            >
                <motion.div
                    key={asPath}
                    variants={variants}
                    animate="in"
                    initial="out"
                    exit="out"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TransitionPage;