import { gql } from '@apollo/client';

export const queryWhoami = gql`
query whoami{
    whoami {
        id
        email
    }
}
`;