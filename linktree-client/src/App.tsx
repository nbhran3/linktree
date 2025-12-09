import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserPage from "./pages/UserPage";
import LinktreePage from "./pages/LinktreePage";
import PublicLinktree from "./pages/PublicLinktree";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userPage" element={<UserPage />} />
        <Route path="/linktrees/:id" element={<LinktreePage />} />
        <Route path="/linktree/:suffix" element={<PublicLinktree />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
