import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../store/slices/authSlice";
import { signin, signup } from "../../store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import { LockOutlined } from "@material-ui/icons";
import Input from "./Input";
import Icon from "./Icon";

import useStyles from "./styles";
import User from "../../interfaces/User";

const initialUserState: User = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Auth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<User>(initialUserState);
  let errorMessage = useAppSelector((state) => state.auth.errors);

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId:
          "1078745035342-taj9r7kf39bjtl7dql1kqkso6v2lqrjk.apps.googleusercontent.com",
        scope: "email",
      });
    };
    gapi.load("client:auth2", start);
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isSignup) {
      dispatch(signup({ user: formData, navigate }));
    } else {
      dispatch(signin({ user: formData, navigate }));
    }
  };
  const handleChange = (event: InputEvent) => {
    const { name, value } = event.currentTarget as HTMLInputElement;
    setFormData({ ...formData, [name]: value });
  };

  const switchMode = () => {
    setIsSignup((prevState) => !prevState);
    errorMessage = "";
  };

  const handleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const googleSuccess = async (res: any) => {
    const result = res?.profileObj;
    const token = res?.tokenId;
    try {
      dispatch(setUser({ result, token }));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  const googleFailure = (error: Error) => {
    console.log(error);
    console.log("Google Sign in unsuccessful");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography variant="h5">{isSignup ? "Sign up" : "Sign In"}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Typography
              color="secondary"
              style={{ paddingLeft: 8, fontSize: 13 }}
            >
              {errorMessage === "User doesn't exist." ||
              errorMessage === "User already exists."
                ? errorMessage
                : ""}
            </Typography>
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            <Typography
              color="secondary"
              style={{ paddingLeft: 8, fontSize: 13 }}
            >
              {errorMessage === "Invalid password" && !isSignup
                ? errorMessage
                : ""}
            </Typography>
            {isSignup && (
              <>
                <Input
                  name="confirmPassword"
                  label="Confirm Password"
                  handleChange={handleChange}
                  type="password"
                />
                <Typography
                  color="secondary"
                  style={{ paddingLeft: 8, fontSize: 13 }}
                >
                  {errorMessage === "Password don't match" ? errorMessage : ""}
                </Typography>
              </>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>
          <GoogleLogin
            clientId="1078745035342-taj9r7kf39bjtl7dql1kqkso6v2lqrjk.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button
                className={classes.googleButton}
                color="primary"
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
                variant="contained"
              >
                Google sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
