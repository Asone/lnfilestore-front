import { PostInterface } from '../interfaces/post';
import { gql } from '@apollo/client';

export const postsList = gql`
        query getPostsListQuery{
            getPostsList{
                uuid
                title
                excerpt
                createdAt
                price
            }
        }
`;

export interface GetPostsListResults {
    getPostsList: Array<PostInterface>
}