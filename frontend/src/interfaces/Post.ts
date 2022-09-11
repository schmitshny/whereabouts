export interface Post {
  _id: string;
  title: string;
  message: string;
  name?: string;
  creator?: string;
  tags: string[];
  selectedFile: string;
  likes: string[];
  createdAt?: Date;
  comments?: string[];
}
