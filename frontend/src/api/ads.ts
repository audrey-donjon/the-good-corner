import { gql } from '@apollo/client';

export const queryAds = gql`
    query ads{
        ads {
            id
            title
            picture
            price
            description
            owner
            location
            tags {
                id
                name
            }
        }
    }
`;