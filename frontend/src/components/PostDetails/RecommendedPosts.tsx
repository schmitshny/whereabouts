import { useNavigate } from "react-router-dom";
import { Post } from "../../interfaces/Post";
import "./RecommenedPosts.scss";

interface RecommendedProps {
  posts: Post[];
}

const RecommendedPosts: React.FC<RecommendedProps> = ({ posts }) => {
  const navigate = useNavigate();

  const openPost = (id: string) => navigate(`/posts/${id}`);
  return (
    <div className="recommended">
      <h2>You might also like:</h2>

      <div className="recommended__posts">
        {posts.map(({ title, name, selectedFile, _id, tags }) => (
          <div
            className="recommended__posts__post"
            onClick={() => openPost(_id)}
            key={`${_id}2`}
          >
            <h3 className="recommended__posts__post__author ">{name}</h3>
            <p className="recommended__posts__post__title">{title}</p>
            {/* <p>{message}</p> */}
            <p className="recommended__posts__post__tags">
              {tags?.map((tag) => `#${tag} `)}
            </p>
            <img src={selectedFile} width="200px" alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedPosts;
