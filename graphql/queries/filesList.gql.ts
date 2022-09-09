
import { gql } from '@apollo/client';
import { FileInterface } from '../../interfaces';

export const filesList = gql`
        query getFilesListQuery{
            getFilesList{
                uuid
                title
                description
                price
                fileSize
                createdAt
                publicUrl
                fileType
                mediaInvoice @client
            }
        }
`;

export interface GetFilesListResults {
    getFilesList: Array<FileInterface>
}