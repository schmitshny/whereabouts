import { Pagination, PaginationItem } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { getPosts } from "../../store/slices/postSlice";
import { useEffect } from "react";
import useStyles from "./styles";

interface PaginateProps {
  page: string;
}

const Paginate: React.FC<PaginateProps> = ({ page }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { numberOfPages } = useAppSelector((state) => state.posts);
  useEffect(() => {
    if (page) dispatch(getPosts(page));
  }, [page, dispatch]);

  return (
    <Pagination
      classes={{ ul: classes.ul }}
      count={numberOfPages}
      page={Number(page) || 1}
      variant="outlined"
      color="primary"
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component={Link}
          to={`/posts?page=${item.page}`}
        />
      )}
    />
  );
};

export default Paginate;
