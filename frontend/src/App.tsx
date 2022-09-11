import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./store/store";
import NavBar from "./components/NavBar/NavBar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import PostDetails from "./components/PostDetails/PostDetails";

const App = () => {
  const isUserLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate replace to="/posts" />} />
        <Route path="/posts" element={<Home />} />
        <Route path="/posts/search" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <Route
          path="/auth"
          element={
            !isUserLoggedIn ? <Auth /> : <Navigate replace to="/posts" />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
