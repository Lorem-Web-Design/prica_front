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
      image
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
      isActive
      eppHistory {
      eppId {
        name
        classificationName
        classification {
          name
          amount
          id
        }
        category
        _id
      }
      amount
      date
    }
    }
  }
`;

export const GET_ADMINS = gql`
  query GetUsers {
  getUsers {
    name
    cc
    role
    image
    _id
  }
}
`;

export const DELETE_ADMINS = gql`mutation DeleteUserById($userId: String!) {
  deleteUserById(userId: $userId) {
    code
    message
    success
    user {
      name
      role
    }
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
      amount
      unit
      category
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
      _id
    }
  }
`;

export const GET_RQ_ELEMENTS = gql`
query GetRqElements {
  getElementsForRq {
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
  }
}
`

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
      currentOwner {
      name
      _id
    }
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
      category
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
      currentOwner {
      name
      _id
    }
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

export const GET_RQ_BY_ID = gql`query GetRqById($rqId: String!) {
  getRqById(rqId: $rqId) {
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
        amount
        _id
        serial
        classification {
          amount
          id
          name
        }
      }
      classificationId
      materialCategory
    }
    petitioner {
      name
      _id
    }
    isApproved
    _id
    haveOC
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
      project
      date
      observation
      paymentMethod
      deliverMethod
      deliverDate
      deliverConditions
      deliverAddress
      isAlive
      ocNumber
      state
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
    discount {
      name
      value
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
    taker {
      name
      cc
      occupation
      image
      _id
      isActive
      eppHistory {
        eppId {
          name
          classificationName
          classification {
            name
            amount
            id
          }
          category
          _id
        }
        amount
        date
        folder {
          name
          _id
          isParent
          parentId
          image
        }
      }
    }
    request
    state
    project
    date
    observation
    paymentMethod
    deliverMethod
    deliverDate
    deliverConditions
    deliverAddress
    ocNumber
    isAlive
    rq {
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
          amount
          _id
          serial
        }
        classificationId
        materialCategory
      }
      petitioner {
        name
        _id
      }
      isApproved
      _id
      haveOC
    }
    items {
      name
      amount
      unitaryPrice
      id
      classificationId
      category
    }
    _id
  }
}
`;

export const GET_IMAGES = gql`
query GetImages {
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
      remision
      oc
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
    isActive
    eppHistory {
      eppId {
        name
        classificationName
        classification {
          name
          amount
          id
        }
        category
        _id
      }
      amount
      date
      folder {
        name
        _id
        isParent
        parentId
        image
      }
    }
  }
}`

export const CREATE_ADMIN = gql`mutation AddUser($userData: UserInput!) {
  addUser(userData: $userData) {
    code
    message
    success
  }
}`

export const GET_PENDING_RQS = gql`query GetPendingRqs {
  getPendingRq
}`

export const GET_REMISIONS = gql`query GetRemision {
  getRemision {
    remitent {
      name
      role
      _id
    }
    observation
    remitentProject {
      name
      _id
    }
    receiverProject {
      name
      _id
    }
    receiver {
      name
      cc
      _id
      occupation
    }
    elementsList {
      amount
      element {
        _id
        name
        unit
      }
    }
    _id
    date
    number
  }
}`

export const GET_REMISION_BY_ID = gql`query GetRemision($remisionId: ID!) {
  getRemisionById(remisionId: $remisionId) {
    date
    number
    observation
    remitent {
      name
      cc
      role
      _id
    }
    remitentProject {
      name
      _id
    }
    receiverProject {
      name
      _id
    }
    receiver {
      name
      cc
      _id
      occupation
    }
    _id
    elementsList {
      element {
        _id
        name
        unit
      }
      amount
    }
  }
}`

export const GET_ELEMENTS_BY_CATEGORY = gql`query GetElementByCategory($category: String!) {
  getElementByCategory(category: $category) {
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
      name
      amount
      id
    }
    classificationName
  }
}`