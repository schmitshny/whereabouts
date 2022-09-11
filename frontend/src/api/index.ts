import axios from "axios";
import { Post } from "../interfaces/Post";
import User from "../interfaces/User";
import searchQuery from "../interfaces/searchQuery";

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers!.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")!).token
    }`;
  }
  return req;
});

//posts
export const fetchPosts = (page: string) => API.get(`/posts?page=${page}`);
export const fetchSinglePost = (id: string) => API.get(`/posts/${id}`);
export const fetchPostsBySearch = (searchQuery: searchQuery) =>
  API.get(
    `/posts/search?searchQuery=${searchQuery.search || "none"}&tags=${
      searchQuery.tags
    }`
  );
export const createPost = (newPost: Post) => API.post("/posts", newPost);
export const updatePost = (id: string, updatedPost: Post) =>
  API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id: string) => API.delete(`/posts/${id}`);
export const likePost = (id: string) => API.patch(`/posts/${id}/likePost`);
export const comment = (comment: string, id: string) =>
  API.post(`/posts/${id}/commentPost`, { comment });

//user

export const signIn = (FormData: User) => API.post("/user/signin", FormData);
export const signUp = (FormData: User) => API.post("/user/signup", FormData);
