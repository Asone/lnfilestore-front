import { gql } from '@apollo/client';
import { PostInterface } from '../interfaces/post';
export const getPostQuery = gql`
query getPostQuery($post: PayablePostInput!){
  getPost(post: $post){
    uuid
    title
    content
    price
  }
}
`;

export interface getPostResponse {
    getPost: PostInterface
}