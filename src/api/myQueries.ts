import { gql } from "@apollo/client";

export const GET_PARENTFOLDERS = gql`
  query ParentFolders {
    parentFolders {
      name
      _id
      isParent
      parentId
      image
    }
  }
`;

export const GET_CHILDRENFOLDERS = gql`
  query ParentFolders($parentId: String!) {
    folderByParentId(parentId: $parentId) {
      name
      _id
      isParent
      parentId
      image
    }
  }
`;

export const LOGIN = gql`
  query ParentFolders($login: LoginInput!) {
    login(login: $login) {
      name
      role
      token
    }
  }
`;

export const GET_WORKERS = gql`
  query GetWorkers {
    getWorkers {
      name
      cc
      occupation
      image
      _id
    }
  }
`;

export const GET_FOLDERS = gql`
  query Folders {
    folders {
      name
      _id
      isParent
      parentId
      image
    }
  }
`;

export const GET_ELEMENTS = gql`
  query GetElements {
    getElements {
      name
      description
      code
      serial
      image
      history {
        giverFolder {
          name
          _id
        }
        takerFolder {
          name
          _id
        }
        giver {
          name
          _id
        }
        taker {
          name
          _id
        }
      }
      currentOwner
      giverFolder {
          name
          _id
        }
      takerFolder {
        name
        _id
      }
      onDelivery
      _id
    }
  }
`;

export const GET_ELEMENT_BY_ID = gql`query GetElementById($getElementById: String!) {
  getElementById(id: $getElementById) {
    _id
    name
    description
    code
    serial
    image
    history {
      giverFolder {
        name
        _id
      }
      giver {
        name
        _id
      }
      taker {
        name
        _id
      }
      takerFolder {
        name
        _id
      }
    }
    remision {
      amount
      giverFolder {
        name
        _id
      }
      giver {
        name
        _id
      }
      taker {
        name
        _id
      }
      takerFolder {
        name
        _id
      }
    }
    currentOwner
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
  }
}
`;

export const EDIT_ELEMENT = gql`
  mutation EditElement($editElementId: String!, $info: ElementInput!) {
    editElement(id: $editElementId, info: $info) {
      code
      success
      message
      element {
        name
        description
        code
        serial
        image
        history {
          giverFolder {
            name
            _id
          }
          takerFolder {
            name
            _id
          }
          giver {
            name
            _id
          }
          taker {
            name
            _id
          }
        }
        currentOwner
        giverFolder {
          name
          _id
        }
        takerFolder {
          name
          _id
        }
        onDelivery
        _id
      }
    }
  }
`;

export const GET_ELEMENTS_BY_ID_AND_CATEGORY = gql`
  query GetElementsByWorkerAndCategory($workerId: String!, $categoryId: String!) {
    getElementsByWorkerAndCategory(workerId: $workerId, categoryId: $categoryId) {
      name
      description
      code
      serial
      image
      history {
        giverFolder {
          name
          _id
        }
        takerFolder {
          name
          _id
        }
        giver {
          name
          _id
        }
        taker {
          name
          _id
        }
      }
      currentOwner
      giverFolder{
          name
          _id
        }
      takerFolder {
        name
        _id
      }
      onDelivery
      _id
    }
  }
`;

export const GET_ELEMENTS_BY_FOLDER_ID = gql`
  query GetElementsByFolder($folderId: String) {
    getElementsByFolder(folderId: $folderId) {
      _id
      name
      description
      code
      serial
      image
      history {
        giverFolder {
          name
          _id
        }
        takerFolder {
          name
          _id
        }
        giver {
          name
          _id
        }
        taker {
          name
          _id
        }
      }
      currentOwner
      giverFolder{
          name
          _id
        }
      takerFolder {
        name
        _id
      }
      onDelivery
      category
    }
  }
`;

export const GET_ELEMENTS_BY_FOLDER_AND_CATEGORY = gql`
  query GetElementsByFolderAndCategory($folderId: String!, $categoryId: String!) {
    getElementsByFolderAndCategory(folderId: $folderId, categoryId: $categoryId) {
      _id
      name
      description
      code
      serial
      image
      history {
        giverFolder {
          name
          _id
        }
        takerFolder {
          name
          _id
        }
        giver {
          name
          _id
        }
        taker {
          name
          _id
        }
      }
      currentOwner
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
    }
  }
`;

export const GET_RQS = gql`
  query GetRqs {
    getRqs {
      date
      project {
        name
        _id
      }
      rq
      ppto
      rqItems {
        requiredAmount
        authorizedAmount
        receivedAmount
        pendingAmount
        observation
        materialId
        material {
          name
          unit
          type
          _id
        }
      }
      petitioner {
        name
        _id
      }
      isApproved
      haveOC
      _id
    }
  }
`;

export const GET_RQ_BY_ID = gql`
  query GetRqById($rqId: String!) {
    getRqById(rqId: $rqId) {
      date
      haveOC
      project {
        name
        _id
      }
      rq
      ppto
      rqItems {
        requiredAmount
        authorizedAmount
        receivedAmount
        pendingAmount
        observation
        materialId
        material {
          name
          unit
          type
          _id
          amount
        }
      }
      petitioner {
        name
        _id
      }
      isApproved
      _id
    }
  }
`;

export const GET_PROVIDERS = gql`
  query GetProviders {
    getProviders {
      name
      nit
      address
      city
      contact
      contactNumber
      email
      _id
    }
  }
`;

export const GET_OCS = gql`
  query GetOcs {
    getOcs {
      provider {
        name
        nit
        address
        city
        contact
        contactNumber
        email
        _id
      }
      receiver {
        name
        nit
        address
        city
        contact
        contactNumber
        email
        _id
      }
      date
      observation
      paymentMethod
      deliverMethod
      deliverDate
      deliverConditions
      deliverAddress
      ocNumber
      items {
        amount
        id
      }
      _id
    }
  }
`;

export const GET_OC_BY_ID = gql`query GetOcById($ocId: ID!) {
  getOcById(ocId: $ocId) {
    provider {
      name
      nit
      address
      city
      contact
      contactNumber
      email
      _id
    }
    receiver {
      name
      nit
      address
      city
      contact
      contactNumber
      email
      _id
    }
    date
    observation
    paymentMethod
    deliverMethod
    deliverDate
    deliverConditions
    deliverAddress
    ocNumber
    isAlive
    items {
      name
      amount
      id
    }
    _id
  }
}
`;

export const GET_IMAGES = gql`
query Query {
  getImages
}`

export const GET_MATERIALS = gql`
  query GetElements {
  getElements {
    _id
    unit
    name
    category
  }
}
`;

export const GET_COUNTER = gql`
  query GetOcCount {
    getOcCount {
      counter
    }
  }
`;
export const GET_WORKER_BY_ID = gql`query GetWorkerById($workerId: ID!) {
  getWorkerById(workerId: $workerId) {
    name
    cc
    occupation
    image
    _id
  }
}`

export const CREATE_ADMIN = gql`mutation AddUser($userData: UserInput!) {
  addUser(userData: $userData) {
    code
    message
    success
  }
}`
