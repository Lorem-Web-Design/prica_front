import { gql } from "@apollo/client";

export const GET_ELEMENTS_BY_FOLDER_STOCK = gql`query GetElementsByStockFolder($stockFolderId: ID!) {
    getElementsByStockFolder(stockFolderId: $stockFolderId) {
      _id
      name
      description
      code
      serial
      image
      onDelivery
      category
      amount
      size
      price
      provider
      lastMovement
      unit
      classificationName
      hide
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
      classification {
        name
        amount
        id
      }
      stock {
        location
        owner
        amount
        classificationId
      }
    }
  }`