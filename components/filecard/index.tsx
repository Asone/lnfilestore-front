import { MediaInterface } from '../../interfaces/Media.interface';

interface Props {
    uuid: string,
    media: MediaInterface
}

const FileCard: React.FC<Props> = ( props: Props ) => {


    return ( <>
        <ul>
            <li><b>Title:</b> {props.media.title}</li>
            <li><b>Format:</b> {props.media.fileType}</li>
            <li><b>Size:</b> {props.media.fileSize} bytes</li>
            <li><b>Price:</b> {props.media.price} sats</li>
            <li><b>Description:</b> {props.media.description}</li>
        </ul>
    </> )
}

export default FileCard;