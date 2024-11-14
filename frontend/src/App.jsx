import { Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "./Guard/PrivateRoute";
import PublicRoute from "./Guard/PublicRoute";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";

function App() {

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><Chat /></PrivateRoute>} />
      <Route path="/signin" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}


export default App;
