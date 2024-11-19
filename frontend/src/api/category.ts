import { gql } from "@apollo/client";

export const queryCategory = gql`
    query category($id: ID!) {
        category(id: $id){
            id
            name
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
    }
`;
