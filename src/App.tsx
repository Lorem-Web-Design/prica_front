import { Link, Route, Routes } from "react-router-dom";
import Start from "./routes/start";
import Folder from "./routes/folder";
import GestionUsuarios from "./routes/gestionUsuarios";
import CreateUser from "./routes/createUser";
import Elementos from "./routes/elements";
import UserPanel from "./routes/userPanel";
import CreateElement from "./routes/createElement";
import Subfolder from "./routes/subfolder";
import Login from "./routes/login";
import { AuthProvider } from "./customHooks/centers/auth/useAuth";
import { ProtectedRoute } from "./routes/protectedRoute";
import { loremEaster } from "./utils/lorem";
import ElementInformation from "./routes/element";
import BodegaInfo from "./routes/bodegaInfo";
import RQEditor from "./routes/rqEditor";
import RQStart from "./routes/rqStart";
import RQViewer from "./routes/rqViewer";
import RQViewList from "./routes/rqView";
import OCViewer from "./routes/ordenViewer";
import OCEditor from "./routes/ordenEditor";
import ConstructionPage from "./routes/404";
import OCStart from "./routes/ocStart";
import OCViewList from "./routes/ocList";
import AUTHORIZATION from "./settings/authorized.json"
import Unauthorized from "./routes/unauthorized";

//PAGES

function App() {
  // console.log(`%c${loremEaster}`, "color: beige");

  return (
    <div className="App">
      <AuthProvider>
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute roles={AUTHORIZATION.INICIO}><Start /></ProtectedRoute>} />
        <Route path="/bodega" element={<ProtectedRoute roles={AUTHORIZATION.BODEGA_PANEL}><Folder/></ProtectedRoute>} />
        <Route path="/requisicion" element={<ProtectedRoute  roles={AUTHORIZATION.RQ_PANEL}><RQStart/></ProtectedRoute>} />
        <Route path="/oc" element={<ProtectedRoute roles={AUTHORIZATION.OC_PANEL}><OCStart/></ProtectedRoute>} />
        <Route path="/requisicion/editor" element={<ProtectedRoute roles={AUTHORIZATION.RQ_EDITOR}><RQEditor/></ProtectedRoute>} />
        <Route path="/requisicion/list" element={<ProtectedRoute roles={AUTHORIZATION.RQ_LIST}><RQViewList/></ProtectedRoute>} />
        <Route path="/oc/list" element={<ProtectedRoute roles={AUTHORIZATION.OC_LIST}><OCViewList/></ProtectedRoute>} />
        <Route path="/requisicion/viewer/:rqId" element={<ProtectedRoute roles={AUTHORIZATION.RQ_VIEWER}><RQViewer/></ProtectedRoute>} />
        <Route path="/bodega/:parentId" element={<ProtectedRoute roles={AUTHORIZATION.BODEGA_CHILDREN}><Subfolder /></ProtectedRoute>} />
        <Route path="/bodega/info/:folderId" element={<ProtectedRoute roles={AUTHORIZATION.BODEGA_VIEWER}><BodegaInfo /></ProtectedRoute>} />
        <Route path="/worker" element={<ProtectedRoute roles={AUTHORIZATION.WORKER_LIST}><GestionUsuarios /></ProtectedRoute>} />
        <Route path="/create/user" element={<CreateUser />} />
        <Route path="/oc/editor/rq/:rqId" element={<ProtectedRoute roles={AUTHORIZATION.OC_EDITOR}><OCEditor /></ProtectedRoute>} />
        <Route path="/oc/viewer/:ocId" element={<ProtectedRoute roles={AUTHORIZATION.OC_VIEWER}><OCViewer /></ProtectedRoute>} />
        <Route path="/oc/editor" element={<ProtectedRoute roles={["admin", "compras"]}><ConstructionPage /></ProtectedRoute>} />
        <Route path="/create/element" element={<ProtectedRoute roles={AUTHORIZATION.CREATE_ELEMENT}><CreateElement /></ProtectedRoute>} />
        <Route path="/elementos" element={<ProtectedRoute roles={AUTHORIZATION.ELEMENT_LIST}><Elementos /></ProtectedRoute>} />
        <Route path="/elemento/:id" element={<ProtectedRoute roles={AUTHORIZATION.ELEMENT_DETAILS}><ElementInformation /></ProtectedRoute>} />
        <Route path="/worker/:workerId" element={<ProtectedRoute roles={AUTHORIZATION.WORKER_DETAILS}><UserPanel /></ProtectedRoute>} />
        <Route path="*" element={<ConstructionPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
