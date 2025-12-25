import { gql } from "@apollo/client";

export const GET_USER_BY_ID = gql`query GetUserById($userId: String!) {
    getUserById(userId: $userId) {
      name
      cc
      role
      image
      password
      position
      _id
      folderId
    }
  }`