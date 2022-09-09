import { gql } from '@apollo/client';

export const fileUploadMutation = gql`
mutation uploadMutation($file: FileInput!){
  uploadFile(fileInput: $file){
    uuid
    description
    price
  }
}
` 