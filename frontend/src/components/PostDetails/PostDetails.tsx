import { useParams } from "react-router-dom";
import { Paper, CircularProgress } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../store/store";
import "./PostDetails.scss";
import moment from "moment";
import corner from "../../images/corner.png";
import { useEffect } from "react";
import useStyles from "./styles";
import { getPostsBySearch, getSinglePost } from "../../store/slices/postSlice";
import CommentSection from "./Comments";
import Footer from "../Home/Footer/Footer";
import RecommendedPosts from "./RecommendedPosts";
const PostDetails = () => {
  const { singlePost, posts, loading } = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(getSinglePost(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (singlePost) {
      dispatch(
        getPostsBySearch({
          search: "none",
          tags: singlePost?.tags?.join(",") || "",
        })
      );
    }
  }, [singlePost, dispatch]);

  let recommendedPosts = posts.filter(({ _id }) => _id !== singlePost._id);
  recommendedPosts = recommendedPosts.slice(0, 4);
  if (!singlePost) return null;

  if (loading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  return (
    <>
      <main className="postDetails">
        <section className="postDetails__section">
          <h3 className="postDetails__section__title gradient">
            {singlePost.title}
          </h3>
          <h6>
            Created by: <span className="name">{singlePost.name}</span>
          </h6>

          <h6>{moment(singlePost.createdAt).fromNow()}</h6>
          <p className="postDetails__section__message">{singlePost.message}</p>
          <p className="postDetails__section__tags">
            {singlePost.tags?.map((tag) => `#${tag} `)}
          </p>

          <div className="postDetails__section__comments">
            <CommentSection post={singlePost} />
          </div>
          <div className="corner">
            <img src={corner} alt="corner" />
          </div>
        </section>
        <section className="postDetails__image">
          <img
            className={classes.media}
            src={
              singlePost.selectedFile ||
              "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
            }
            alt={singlePost.title}
          />
        </section>
      </main>
      <aside>
        <RecommendedPosts posts={recommendedPosts} />
      </aside>
      <Footer />
    </>
  );
};

export default PostDetails;
