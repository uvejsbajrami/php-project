import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import UserLogin from "./pages/UserLogin";
import Discord from "./pages/Discord";
import ServerChat from "./pages/ServerChat";
import JoinServer from "./pages/JoinServer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/discord" element={<Discord />} />
          <Route path="/server/:id" element={<ServerChat />} />
          <Route path="/joinserver" element={<JoinServer />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
