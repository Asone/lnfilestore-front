import { gql } from '@apollo/client';
import { MediaInterface } from '../../interfaces/Media.interface';

export const getMediaQuery = gql`
 query  getMediaQuery($uuid: Uuid!, $paymentRequest: String){
        getMedia(uuid: $uuid, paymentRequest: $paymentRequest){
                uuid,
                title,
                description,
                price,
                fileSize,
                fileType,
                mediaInvoice @client
        }
    }
`

export interface GetMediaResponse {
    getMedia?: MediaInterface
}