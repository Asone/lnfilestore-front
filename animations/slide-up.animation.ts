import { Variants } from 'framer-motion';

export const SlideUpVariants: Variants = {
    outInitial: {
        position: 'absolute',
        opacity: 0.3,
        y: -40,
        scale: 0.6,
        transition: {
            duration: 0.4,
            ease: 'easeIn',
            // delay: 0.5

        }
    },
    outExit: {
        position: 'absolute',
        opacity: 0.3,
        y: 40,
        scale: 0.6,
        transition: {
            duration: 0.15,
            ease: 'easeOut'
        }
    },
    in: {
        position: 'relative',
        scale: 1,
        opacity: 1,
        y: 0,
        transition: {
            // delay: 0.5
        }
    }
};