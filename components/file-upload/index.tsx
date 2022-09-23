import TransitionComponent from '../transition-component'
import { SlideUpVariants } from '../../animations/slide-up.animation';
import styles from './index.module.scss';
import { motion, Variants } from 'framer-motion';

interface Props {
    file: File | null
    removeFile?: () => void
}
export const FileUploadComponent = ( props: Props ): JSX.Element => {

    if ( props.file !== null ) {
        return (
            <TransitionComponent>

                <motion.div
                    key="no-file"
                    variants={SlideUpVariants}
                    animate="in"
                    initial="outInitial"
                    exit="outExit"

                    className="card col-12 col-md-10 col-lg-8 offset-0 offset-md-1 offset-lg-2 rounded-3 rounded-pill border-light bg-light bg-opacity-50 shadow-sm border position-relative">
                    <i onClick={props.removeFile} className={`icon-cancel-circled clickable float-end position-absolute ${ styles.removeFileIcon }`}></i>
                    <div className="card-body text-center text-dark clickable rounded-pill">
                        <h6 className={`pr-3 col-12 ${ styles.fileName }`}>{props.file.name}</h6>
                    </div>

                </motion.div>
            </TransitionComponent>
        )
    }

    return (
        <TransitionComponent>
            <motion.div
                key="has-file"
                variants={SlideUpVariants}
                animate="in"
                initial="outInitial"
                exit="outExit"
                className="card col-8 offset-2 rounded-3 rounded-pill border-light bg-light bg-opacity-50 rounded-3 shadow-sm border ">
                <div className="card-body  text-center text-dark clickable rounded-pill">
                    <h6 className="">Drag and drop your file here</h6>
                    <i className="text-secondary fs-1icon-upload-cloud"></i>
                </div>
            </motion.div>
        </TransitionComponent>
    )

}

export default FileUploadComponent;