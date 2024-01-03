import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import UserLogin from "./pages/UserLogin";
import Discord from "./pages/Discord";
import ServerChat from "./pages/ServerChat";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/discord" element={<Discord />} />
          <Route path="/server/:id" element={<ServerChat />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
