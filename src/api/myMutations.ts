import { gql } from "@apollo/client";

export const CREATE_USER = gql`mutation AddUser($userData: UserInput!) {
  addUser(userData: $userData) {
    code
    success
    message
    user {
      name
      cc
      role
      image
      password
      _id
    }
  }
}`

export const CREATE_WORKER = gql`mutation AddWorker($workerInfo: WorkerInput!) {
    addWorker(workerInfo: $workerInfo) {
      code
      success
      message
      worker {
        name
        cc
        occupation
        image
        _id
      }
    }
  }`

  export const CREATE_ELEMENT = gql`mutation Mutation($elementData: ElementInput!) {
    createElement(elementData: $elementData) {
      code
      element {
        _id
        name
      }
      message
      success
    }
  }`

  export const DELETE_ELEMENT = gql`mutation DeleteElementById($deleteElementById: String!) {
    deleteElementById(id: $deleteElementById) {
      _id
    }
  }`

  export const CREATE_RQ = gql`mutation AddRQ($rqData: RQInputData!) {
    addRQ(rqData: $rqData) {
      code
      message
      success
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
            _id
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
  }
  `

  export const APPROVE_RQ = gql`mutation Mutation($approveState: String!, $rqId: String!) {
    approveRq(approveState: $approveState, rqId: $rqId) {
      code
      success
      message
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
            _id
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
  }`

  export const ADD_FOLDER = gql`mutation AddFolder($folderData: FolderInput!) {
    addFolder(folderData: $folderData) {
      code
      success
      message
      folder {
        name
        _id
        isParent
        parentId
        image
      }
    }
  }`

  //Deprecated 
  export const ADD_MATERIAL = gql`mutation AddMaterial($materialData: MaterialInput!) {
    addMaterial(materialData: $materialData) {
      code
      success
      message
      material {
        name
        unit
        type
        _id
      }
    }
  }`

  export const ADD_OC = gql`mutation Mutation($ocData: OCInput!) {
    addOC(ocData: $ocData) {
      code
      success
      message
      oc {
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
        items {
          name
          amount
          id
        }
        _id
      }
    }
  }`

  export const INCREMENT_OC_COUNTER = gql`mutation IncrementOCCounter {
    incrementOCCounter {
      code
      success
      message
      oc {
        oc
        _id
      }
    }
  }`

export const INCREMENT_REMISION_COUNTER = gql`mutation IncrementRemisionCounter {
  incrementRemisionCounter {
    code
    success
    message
    oc {
      oc
      remision
      counter
      _id
    }
  }
}`

  export const TRIGGER_HAVE_OC = gql`mutation HaveOcTrigger($approveState: String!, $rqId: String!) {
    haveOcTrigger(approveState: $approveState, rqId: $rqId) {
      code
      success
      message
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
            _id
          }
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
  }`

  export const DELETE_FOLDER_BY_ID = gql`mutation DeleteFolderById($folderId: String!) {
    deleteFolderById(folderId: $folderId) {
      code
      success
      message
      folder {
        name
        _id
        isParent
        parentId
        image
      }
    }
  }`

  export const EDIT_FOLDER_BY_ID = gql`mutation EditFolder($folderId: String!, $folderData: FolderInput!) {
    editFolder(folderId: $folderId, folderData: $folderData) {
      code
      success
      message
      folder {
        name
        _id
        isParent
        parentId
        image
      }
    }
  }`

  
export const DELETE_RQ_BY_ID = gql`mutation DeleteRQbyId($rqId: String!) {
  deleteRQbyId(rqId: $rqId) {
    code
    success
    message
  }
}`

export const DELETE_OC_BY_ID = gql`mutation DeleteRQbyId($ocId: String!) {
  deleteOCbyId(ocId: $ocId) {
    code
    message
    success
  }
}`

export const DELETE_WORKER_BY_ID = gql`mutation DeleteRQbyId($workerId: String!) {
  deleteWorkerById(workerId: $workerId) {
    code
    message
    success
  }
}`

export const UPDATE_RQ_BY_ID = gql`mutation UpdateRQById($info: RQInputData!, $rqId: ID!) {
  updateRQById(info: $info, rqId: $rqId) {
    code
    message
    success
    rq {
      rq
      _id
    }
  }
}`

export const KILL_OC_BY_ID = gql`mutation KillOrder($ocId: ID!) {
  killOrder(ocId: $ocId) {
    code
    message
    success
    oc {
      _id
      ocNumber
    }
  }
}`

export const APPROVE_ORDER = gql`mutation Mutation($ocData: OCInput!, $ocId: ID!) {
  approveOrder( ocData: $ocData, ocId: $ocId) {
    code
    success
    message
    oc {
      _id
    }
  }
}`

export const CREATE_PROVIDER = gql`mutation CreateProvider($providerData: ProviderInputData!) {
  createProvider(providerData: $providerData) {
    code
    message
    success
    provider {
      name
    }
  }
}`

export const DELETE_PROVIDER = gql`mutation DeleteProviderById($providerId: ID!) {
  deleteProviderById(providerId: $providerId) {
    code
    message
    success
    provider {
      _id
      name
    }
  }
}`

export const EDIT_PROVIDER_BY_ID = gql`mutation UpdateProviderById($providerId: ID!, $providerData: ProviderInputData!) {
  updateProviderById(providerId: $providerId, providerData: $providerData) {
    code
    message
    success
    provider {
      _id
      name
    }
  }
}`

export const EDIT_WORKER_BY_ID = gql`mutation Mutation($workerId: ID!, $info: WorkerInput!) {
  editWorkerById(workerId: $workerId, info: $info) {
    code
    message
    success
    worker {
      name
      image
    }
  }
}`

export const EDIT_USER = gql`mutation DeleteUserById($userId: String!, $info: UserInput) {
  editUserById(userId: $userId, info: $info) {
    code
    message
    user {
      _id
      role
      name
    }
  }
}`

export const DELETE_IMAGE = gql`mutation DeleteImages($imageName: ID!) {
  deleteImages(imageName: $imageName) {
    code
    image
    message
    success
  }
}`

export const UPDATE_USER_STATUS =gql`mutation ChangeWorkerStatus($workerId: ID!, $action: String!) {
  activateWorkerById(workerId: $workerId, action: $action) {
    code
    message
    success
    worker {
      _id
      name
    }
  }
}`

export const CREATE_EPP = gql`mutation Mutation($eppInfo: EppInput!) {
  addEpp(eppInfo: $eppInfo) {
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
}`

export const ASSIGN_EPP = gql`mutation AssignEpp($movementInfo: MovementInfo!) {
  assignEpp(movementInfo: $movementInfo) {
    code
    epp {
      _id
      classification {
        name
        amount
        id
      }
      name
      classificationName
    }
    success
    message
  }
}`

export const CREATE_REMISION = gql`mutation CreateRemision($remisionData: RemisionInput!) {
  createRemision(remisionData: $remisionData) {
    code
    success
    message
    remision {
      _id
      date
    }
  }
}`

export const DELETE_REMISION_BY_ID = gql`mutation DeleteRemisionById($remisionId: String!) {
  deleteRemisionById(remisionId: $remisionId) {
    code
    success
    message
    remision {
      _id
    }
  }
}`