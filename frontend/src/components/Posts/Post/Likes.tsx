import { ThumbUpAlt, ThumbUpAltOutlined } from "@material-ui/icons";

interface LikesProps {
  isAlreadyLiked: boolean;
  likes: string[];
}

const Likes: React.FC<LikesProps> = ({ likes, isAlreadyLiked }) => {
  if (likes.length > 0) {
    return isAlreadyLiked ? (
      <>
        <ThumbUpAlt fontSize="small" />
        &nbsp;
        {likes.length} {likes.length === 1 ? "Like" : "Likes"}
      </>
    ) : (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
      </>
    );
  }

  return (
    <>
      <ThumbUpAltOutlined fontSize="small" />
      &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
    </>
  );
};

export default Likes;
