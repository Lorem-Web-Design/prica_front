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

  export const INCREMENT_COUNTER = gql`mutation IncrementCounter {
    incrementCounter {
      code
      success
      message
      oc {
        _id
        counter
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