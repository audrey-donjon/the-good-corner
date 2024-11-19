import { gql } from '@apollo/client';

export const mutationUpdateTag = gql`
mutation UpdateTag($data: TagUpdateInput!, $id: ID!) {
    UpdateTag(data: $data, $id: ID!) {
        id
    }
}
`;