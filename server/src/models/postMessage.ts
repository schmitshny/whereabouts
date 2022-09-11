import { Schema, model } from "mongoose";

interface Post {
  title: string;
  message: string;
  name: string;
  creator: string;
  tags: [string];
  selectedFile: string;
  createdAt: Date;
  likes: string[];
  comments: string[];
}

const postSchema = new Schema<Post>({
  title: String,
  message: String,
  creator: String,
  name: String,
  tags: [String],
  selectedFile: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likes: {
    type: [String],
    default: [],
  },
  comments: {
    type: [String],
    default: [],
  },
});

const PostMessage = model("PostMessage", postSchema);

export default PostMessage;
