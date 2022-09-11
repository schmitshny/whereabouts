import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../../interfaces/Post";
import searchQuery from "../../interfaces/searchQuery";
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  fetchPostsBySearch,
  fetchSinglePost,
  comment,
} from "../../api/index";
import { AppDispatch } from "../store";
import { NavigateFunction } from "react-router-dom";

interface PostState {
  posts: Post[];
  loading: boolean;
  currentPage: number;
  singlePost: Post;
  errors: any;
  searchedPosts: Post[];
  numberOfPages: number;
}

interface fetchedPosts {
  data: Post[];
  numberOfPages: number;
  currentPage: number;
}

const initialState: PostState = {
  posts: [],
  singlePost: {
    _id: "",
    title: "",
    message: "",
    tags: [],
    selectedFile: "",
    likes: [],
  },
  loading: false,
  errors: [],
  searchedPosts: [],
  currentPage: 1,
  numberOfPages: 0,
};

export const getPosts = createAsyncThunk<
  Object,
  string,
  { dispatch: AppDispatch }
>("posts/getPosts", async (page, thunkApi) => {
  try {
    const { data } = await fetchPosts(page);

    thunkApi.dispatch(setPosts(data));
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const getSinglePost = createAsyncThunk<
  Object,
  string,
  { dispatch: AppDispatch }
>("posts/:id", async (id, thunkApi) => {
  try {
    const { data } = await fetchSinglePost(id);
    thunkApi.dispatch(setSinglePost(data));
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const getPostsBySearch = createAsyncThunk<
  Object,
  searchQuery,
  { dispatch: AppDispatch }
>("posts/search", async (searchQuery, thunkApi) => {
  try {
    const {
      data: { data },
    } = await fetchPostsBySearch(searchQuery);
    thunkApi.dispatch(fetchBySearch(data));
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const createNewPost = createAsyncThunk<
  Object,
  { post: Post; navigate: NavigateFunction },
  { dispatch: AppDispatch }
>("posts/createPost", async (params, thunkApi) => {
  try {
    const { data } = await createPost(params.post);
    params.navigate(`/posts/${data._id}`);
    thunkApi.dispatch(create(params.post));
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const UpdateExistingPost = createAsyncThunk<
  Object,
  Post,
  { dispatch: AppDispatch }
>("posts/:id", async (post, thunkApi) => {
  try {
    const { data } = await updatePost(post._id, post);
    thunkApi.dispatch(update(post));
    return data;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const removePost = createAsyncThunk<
  Object,
  string,
  { dispatch: AppDispatch }
>("posts/:id", async (id, thunkApi) => {
  try {
    await deletePost(id);
    thunkApi.dispatch(remove(id));
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const addLikePost = createAsyncThunk<
  Object,
  string,
  { dispatch: AppDispatch }
>("posts/:id/likePost", async (id, thunkApi) => {
  try {
    const { data } = await likePost(id);
    thunkApi.dispatch(like(data));
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const commentPost = createAsyncThunk<
  Object,
  { value: string; id: string },
  { dispatch: AppDispatch }
>("posts/:id/commentPost", async (params, thunkApi) => {
  try {
    const { data } = await comment(params.value, params.id);
    thunkApi.dispatch(setComments(data));
    return data.comments;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<fetchedPosts>) => {
      state.posts = action.payload.data;
      state.currentPage = action.payload.currentPage;
      state.numberOfPages = action.payload.numberOfPages;
    },
    create: (state, action: PayloadAction<Post>) => {
      state.posts = [...state.posts, action.payload];
    },
    update: (state, action: PayloadAction<Post>) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
    remove: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    like: (state, action: PayloadAction<Post>) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload._id ? action.payload : post
      );
    },
    fetchBySearch: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    setSinglePost: (state, action: PayloadAction<Post>) => {
      state.singlePost = action.payload;
    },
    setComments: (state, action: PayloadAction<Post>) => {
      state.posts = state.posts.map((post) => {
        if (post._id === action.payload._id) return action.payload;
        return post;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(getPosts.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    });
    builder.addCase(getPostsBySearch.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPostsBySearch.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(getPostsBySearch.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    });
    builder.addCase(createNewPost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createNewPost.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(createNewPost.rejected, (state, action) => {
      state.loading = false;
      // state.errors = action.payload;
    });
  },
});

export default postSlice.reducer;
export const {
  setPosts,
  update,
  create,
  like,
  remove,
  fetchBySearch,
  setSinglePost,
  setComments,
} = postSlice.actions;
