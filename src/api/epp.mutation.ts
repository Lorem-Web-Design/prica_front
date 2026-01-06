import { gql } from "@apollo/client";

export const EDIT_EPP_BY_ID = gql`
  mutation Mutation($eppId: ID!, $info: EppInput!) {
    editEppById(eppId: $eppId, info: $info) {
      code
      success
      message
      epp {
        name
        classificationName
        classification {
          name
          amount
          id
        }
        _id
      }
    }
  }
`;

export const DELETE_EPP_BY_ID = gql`
  mutation Mutation($eppId: String!) {
    deleteEppById(eppId: $eppId) {
      code
      success
      message
      epp {
        name
        classificationName
        classification {
          name
          amount
          id
        }
        _id
      }
    }
  }
`;
