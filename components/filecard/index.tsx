import { MediaInterface } from '../../interfaces/Media.interface';
import styles from './index.module.scss';
import { formatBytes } from '../../helpers/bytes';
interface Props {
    uuid: string,
    media: MediaInterface
}

const FileCard: React.FC<Props> = ( props: Props ) => {


    return ( <>

        <div className="col-12 col-md-4 col-lg-4">
            <div className="card bg-transparent">
                <h5 className={`card-header bg-secondary text-light bg-opacity-50 ${ styles.fileCardHeader }`}>
                    File information
                </h5>
                <div className={`card-body bg-light bg-opacity-50 ${ styles.fileCardBody }`}>
                    <ul>
                        <li><b>Title:</b> {props.media.title}</li>
                        <li><b>Format:</b> {props.media.fileType || 'Unknown'}</li>
                        <li><b>Size:</b> {formatBytes( props.media.fileSize || 0 )}</li>
                        <li><b>Price:</b> {props.media.price} sats</li>
                        <li><b>Description:</b> {props.media.description}</li>
                    </ul>
                </div>
            </div>
        </div>
    </> )
}

export default FileCard;