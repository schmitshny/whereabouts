import { useState, useRef } from "react";
import {
  Typography,
  TextField,
  Button,
  ThemeProvider,
} from "@material-ui/core";
import { useAppDispatch } from "../../store/store";
import useStyles from "./styles";
import { Post } from "../../interfaces/Post";
import { commentPost } from "../../store/slices/postSlice";
import { theme } from "../../styles/muiStyles";

interface CommentsProps {
  post: Post;
}

const CommentSection: React.FC<CommentsProps> = ({ post }) => {
  const [comments, setComments] = useState<string[]>(post?.comments || []);
  const [comment, setComment] = useState("");
  const classes = useStyles();
  const commentsRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const dispatch = useAppDispatch();
  const user = JSON.parse(localStorage.getItem("profile")!);

  const handleComment = async () => {
    const finalComment = `${user?.result?.name}: ${comment}`;

    const newComments = await dispatch(
      commentPost({ value: finalComment, id: post._id })
    );
    setComments(newComments.payload as string[]);
    setComment("");
    commentsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <div className={classes.commentsOuterContainer}>
        <div className={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h5">
            Comments
          </Typography>
          {comments.length === 0 && (
            <Typography variant="subtitle1">No comments yet</Typography>
          )}
          {comments?.map((comment, index) => (
            <Typography key={index} gutterBottom variant="subtitle1">
              <strong>{comment.split(": ")[0]}</strong>
              {comment.split(":")[1]}
            </Typography>
          ))}
          <div ref={commentsRef}></div>
        </div>
        {user?.result?.name && (
          <div style={{ width: "70%" }}>
            <Typography gutterBottom variant="h5">
              Write a comment
            </Typography>
            <TextField
              fullWidth
              minRows={4}
              variant="outlined"
              label="Comment"
              multiline
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <br />
            <ThemeProvider theme={theme}>
              <Button
                style={{ marginTop: "10px" }}
                fullWidth
                disabled={!comment.length}
                variant="contained"
                onClick={handleComment}
                color="primary"
              >
                Comment
              </Button>
            </ThemeProvider>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
