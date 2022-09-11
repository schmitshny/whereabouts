import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@material-ui/core";
import { Delete, MoreHoriz } from "@material-ui/icons";
import moment from "moment";

import { Post } from "../../../interfaces/Post";
import { useAppDispatch } from "../../../store/store";
import {
  removePost,
  addLikePost,
  getPostsBySearch,
} from "../../../store/slices/postSlice";
import Likes from "./Likes";

import "./Post.scss";

interface SinglePostProps {
  post: Post;
  setCurrentId: any;
}
const SinglePost: React.FC<SinglePostProps> = ({ post, setCurrentId }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile")!);
  const openPost = () => {
    navigate(`/posts/${post._id}`);
  };
  const [likes, setLikes] = useState(post.likes);
  const userId = user?.result?.googleId || user?.result?._id;
  const isAlreadyLiked = likes.find((like) => like === userId);

  const handleLikeClick = async () => {
    if (userId) {
      dispatch(addLikePost(post._id));

      if (isAlreadyLiked) {
        setLikes(post.likes.filter((id) => id !== userId));
      } else {
        setLikes([...post.likes, userId]);
      }
    }
  };

  const searchPostByTag = (tag: string) => {
    dispatch(getPostsBySearch({ search: "", tags: tag }));
    navigate(`/posts/search?searchQuery="none"&tags=${tag}`);
  };

  return (
    <article className="card">
      <header className="card__header">
        {/* <div className="overlay" onClick={openPost}></div> */}
        <div className="card__header__creator">
          <h5 className="card__header__creator__name" onClick={openPost}>
            {post.name}
          </h5>
          <h6 className="card__header__creator__date">
            {post.createdAt ? moment(post.createdAt).fromNow() : null}
          </h6>
        </div>
      </header>

      {(user?.result?.googleId === post?.creator ||
        user?.result?._id === post?.creator) && (
        <div className="editIcon">
          <Button
            style={{ color: "pink" }}
            size="small"
            onClick={() => setCurrentId(post._id)}
          >
            <MoreHoriz fontSize="large" />
          </Button>
        </div>
      )}
      <div className="card__body">
        <h5 onClick={openPost} className="card__body__title">
          {post.title}
        </h5>

        <textarea
          className="card__body__message"
          value={post.message}
          readOnly
        />
        <section className="card__body__hashtags">
          {post.tags &&
            post.tags.map((tag) => (
              <p
                onClick={() => searchPostByTag(tag)}
                key={Math.random()}
              >{` #${tag}`}</p>
            ))}
        </section>
      </div>
      <div onClick={openPost} className="card__image">
        <img
          src={
            post.selectedFile ||
            "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
          }
          alt={post.title}
        />
      </div>
      <div className="card__buttons">
        <Button size="small" color="primary" onClick={handleLikeClick}>
          <Likes likes={likes} isAlreadyLiked={!!isAlreadyLiked} />
        </Button>
        {(user?.result?.googleId === post?.creator ||
          user?.result?._id === post?.creator) && (
          <Button
            size="small"
            color="primary"
            onClick={() => dispatch(removePost(post._id))}
          >
            <Delete fontSize="small" color="secondary" />
          </Button>
        )}
      </div>
    </article>
  );
};

export default SinglePost;
