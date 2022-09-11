import { Button, ThemeProvider } from "@material-ui/core";
import "./NavBar.scss";
import { theme } from "../../styles/muiStyles";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";
import logo from "../../images/logo.png";
import profileEmptyImg from "../../images/profile-empty-image.png";

import IUserGoogle from "../../interfaces/UserGoogle";

interface MyToken {
  name: string;
  exp: number;
}

const NavBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authData } = useAppSelector((state) => state.auth);
  const [user, setUser] = useState<IUserGoogle | null>(null);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    setUser(null);
    navigate("/");
  }, [dispatch, navigate]);

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode<MyToken>(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) {
        handleLogout();
      }
    }

    const loggedUser = localStorage.getItem("profile");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, [setUser, authData, navigate, handleLogout, user?.token]);

  return (
    <header className="navbar">
      <div className="navbar__logo">
        <div className="navbar__logo__title">
          <Link to="/">Whereabouts</Link>
        </div>
        <img
          src={logo}
          alt="memories"
          height="60"
          onClick={() => navigate("/")}
        />
      </div>
      <nav className="navbar__auth">
        {user ? (
          <>
            <img
              className="navbar__auth__avatar"
              src={user?.result?.imageUrl || profileEmptyImg}
              alt="profile"
            />

            <div className="navbar__auth__username">{`${user.result?.name} ${
              user.result?.lastName || ""
            }`}</div>
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </ThemeProvider>
          </>
        ) : (
          <ThemeProvider theme={theme}>
            <Button
              component={Link}
              to="/auth"
              variant="contained"
              color="primary"
            >
              Sign in
            </Button>
          </ThemeProvider>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
