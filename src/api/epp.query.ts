import { gql } from "@apollo/client";

export const GET_EPP_LIST  = gql`query GetEpps {
  getEpps {
    _id
    name
    description
    code
    serial
    image
    history {
      giver {
        name
        _id
      }
      taker {
        name
        _id
      }
      amount
    }
    remision {
      amount
    }
    currentOwner {
      name
      _id
    }
    giverFolder {
      name
      _id
    }
    takerFolder {
      name
      _id
    }
    onDelivery
    category
    amount
    size
    price
    provider
    lastMovement
    unit
    classification {
      amount
      id
      name
    }
    classificationName
    stock {
      location
      owner
      amount
      classificationId
      stockId
    }
  }
}`

export const GET_EPP_BY_ID = gql`query GetEppById($eppId: ID!) {
    getEppById(eppId: $eppId) {
      name
      classificationName
      category
      classification {
        name
        amount
        id
      }
      _id
    }
  }`