import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./customHooks/centers/auth/useAuth";
import ConstructionPage from "./routes/404";
import BodegaInfo from "./routes/bodegaInfo";
import CreateElement from "./routes/createElement";
import CreateUser from "./routes/createUser";
import ElementInformation from "./routes/element";
import Elementos from "./routes/elements";
import EppPage from "./routes/epps";
import Folder from "./routes/folder";
import GestionAdmins from "./routes/gestionAdmins";
import GestionUsuarios from "./routes/gestionUsuarios";
import Login from "./routes/login";
import OCViewList from "./routes/ocList";
import OCStart from "./routes/ocStart";
import OCEditor from "./routes/ordenEditor";
import OCViewer from "./routes/ordenViewer";
import { ProtectedRoute } from "./routes/protectedRoute";
import RemisionStart from "./routes/remisionStart";
import RemisionViewer from "./routes/remisionViewer";
import RQEditor from "./routes/rqEditor";
import RQStart from "./routes/rqStart";
import RQViewList from "./routes/rqView";
import RQViewer from "./routes/rqViewer";
import Start from "./routes/start";
import Subfolder from "./routes/subfolder";
import Unauthorized from "./routes/unauthorized";
import UserPanel from "./routes/userPanel";
import AUTHORIZATION from "./settings/authorized.json";
import { loremEaster } from "./utils/lorem";

//PAGES

function App() {
  // console.log(`%c${loremEaster}`, "color: beige");
  return (
    <div className="App">
      <AuthProvider>
      <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute roles={AUTHORIZATION.INICIO}><Start /></ProtectedRoute>} />
        <Route path="/centro_costo" element={<ProtectedRoute roles={AUTHORIZATION.BODEGA_PANEL}><Folder/></ProtectedRoute>} />
        <Route path="/requisicion" element={<ProtectedRoute  roles={AUTHORIZATION.RQ_PANEL}><RQStart/></ProtectedRoute>} />
        <Route path="/oc" element={<ProtectedRoute roles={AUTHORIZATION.OC_PANEL}><OCStart/></ProtectedRoute>} />
        <Route path="/remision" element={<ProtectedRoute roles={AUTHORIZATION.OC_LIST}><RemisionStart/></ProtectedRoute>} />
        <Route path="/remision/viewer/:remisionId" element={<ProtectedRoute roles={AUTHORIZATION.OC_VIEWER}><RemisionViewer /></ProtectedRoute>} />
        <Route path="/requisicion/editor" element={<ProtectedRoute roles={AUTHORIZATION.RQ_EDITOR}><RQEditor/></ProtectedRoute>} />
        <Route path="/requisicion/list" element={<ProtectedRoute roles={AUTHORIZATION.RQ_LIST}><RQViewList/></ProtectedRoute>} />
        <Route path="/oc/list" element={<ProtectedRoute roles={AUTHORIZATION.OC_LIST}><OCViewList/></ProtectedRoute>} />
        <Route path="/oc/editor/rq/:rqId" element={<ProtectedRoute roles={AUTHORIZATION.OC_EDITOR}><OCEditor /></ProtectedRoute>} />
        <Route path="/oc/viewer/:ocId" element={<ProtectedRoute roles={AUTHORIZATION.OC_VIEWER}><OCViewer /></ProtectedRoute>} />
        <Route path="/oc/editor" element={<ProtectedRoute roles={["admin", "compras"]}><ConstructionPage /></ProtectedRoute>} />
        <Route path="/requisicion/viewer/:rqId" element={<ProtectedRoute roles={AUTHORIZATION.RQ_VIEWER}><RQViewer/></ProtectedRoute>} />
        <Route path="/centro_costo/:parentId" element={<ProtectedRoute roles={AUTHORIZATION.BODEGA_CHILDREN}><Subfolder /></ProtectedRoute>} />
        <Route path="/centro_costo/info/:folderId" element={<ProtectedRoute roles={AUTHORIZATION.BODEGA_VIEWER}><BodegaInfo /></ProtectedRoute>} />
        <Route path="/admins" element={<ProtectedRoute roles={AUTHORIZATION.WORKER_LIST}><GestionAdmins /></ProtectedRoute>} />
        <Route path="/create/user" element={<CreateUser />} />
        <Route path="/create/element" element={<ProtectedRoute roles={AUTHORIZATION.CREATE_ELEMENT}><CreateElement /></ProtectedRoute>} />
        <Route path="/elementos" element={<ProtectedRoute roles={AUTHORIZATION.ELEMENT_LIST}><Elementos /></ProtectedRoute>} />
        <Route path="/elemento/:id" element={<ProtectedRoute roles={AUTHORIZATION.ELEMENT_DETAILS}><ElementInformation /></ProtectedRoute>} />
        <Route path="/worker" element={<ProtectedRoute roles={AUTHORIZATION.WORKER_LIST}><GestionUsuarios /></ProtectedRoute>} />
        <Route path="/worker/:workerId/:tab" element={<ProtectedRoute roles={AUTHORIZATION.WORKER_DETAILS}><UserPanel /></ProtectedRoute>} />
        <Route path="/epp" element={<ProtectedRoute roles={AUTHORIZATION.EPP}><EppPage /></ProtectedRoute>} />
        <Route path="*" element={<ConstructionPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
