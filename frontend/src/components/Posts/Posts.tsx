import { useAppSelector } from "../../store/store";
import { CircularProgress } from "@material-ui/core";
import SinglePost from "./Post/Post";
import "./Posts.scss";
interface PostsProps {
  setCurrentId: any;
}

const Posts: React.FC<PostsProps> = ({ setCurrentId }) => {
  const { posts, loading } = useAppSelector((state) => state.posts);
  return loading ? (
    <div className="loading">
      <CircularProgress color="secondary" />
    </div>
  ) : (
    <main className="container">
      {posts.length === 0 && <div className="noPostInfo">No posts found</div>}
      {posts.map((post) => {
        return (
          <article className="container__article" key={`${post._id}1`}>
            <SinglePost post={post} setCurrentId={setCurrentId} />
          </article>
        );
      })}
    </main>
  );
};

export default Posts;
