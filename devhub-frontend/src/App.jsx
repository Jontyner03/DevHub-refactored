import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateProject from "./pages/CreateProject";
import Explore from "./pages/Explore";
import PublicProfile from "./pages/PublicProfile";
import RequireAuth from "./components/requireAuth";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/u/:id" element={<PublicProfile />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>}/>
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/create-project" element={<RequireAuth><CreateProject /></RequireAuth>} />
        
      </Routes>
    </Router>
  );
}

export default App;