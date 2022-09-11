import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import IUserGoogle from "../../interfaces/UserGoogle";
import User from "../../interfaces/User";
import * as api from "../../api/index";
import { AppDispatch } from "../store";
import { NavigateFunction } from "react-router-dom";
interface AuthState {
  authData: IUserGoogle | null | User;
  isLoggedIn: boolean;
  errors: string;
}

const initialState: AuthState = {
  authData: null,
  isLoggedIn: localStorage.getItem("profile") ? true : false,
  errors: "",
};

export const signin = createAsyncThunk<
  Object,
  { user: User; navigate: NavigateFunction },
  { dispatch: AppDispatch }
>("/user/signin", async (params, thunkApi) => {
  try {
    const { data } = await api.signIn(params.user);
    if (data.result) {
      thunkApi.dispatch(setUser(data));
      thunkApi.dispatch(setErrors(""));
      params.navigate("/");
    }
    if (data.message) {
      thunkApi.dispatch(setErrors(data.message));
    }
  } catch (error) {
    console.log(error);
    return thunkApi.rejectWithValue(error);
  }
});

export const signup = createAsyncThunk<
  Object,
  { user: User; navigate: NavigateFunction },
  { dispatch: AppDispatch }
>("/user/signup", async (params, thunkApi) => {
  try {
    const { data } = await api.signUp(params.user);
    if (data.result) {
      thunkApi.dispatch(setUser(data));
      thunkApi.dispatch(setErrors(""));
      params.navigate("/");
    }
    if (data.message) {
      thunkApi.dispatch(setErrors(data.message));
    }
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserGoogle | User>) => {
      state.authData = action?.payload;
      localStorage.setItem("profile", JSON.stringify({ ...action?.payload }));
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.authData = null;
      state.isLoggedIn = false;
      localStorage.clear();
    },
    setErrors: (state, action: PayloadAction<string>) => {
      state.errors = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { setUser, logout, setErrors } = authSlice.actions;
