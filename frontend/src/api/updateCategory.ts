import { gql } from '@apollo/client';

export const mutationUpdateCategory = gql`
mutation UpdateCategory($data: CategoryUpdateInput!, $id: ID!) {
    UpdateCategory(data: $data, $id: ID!) {
        id
    }
}
`;