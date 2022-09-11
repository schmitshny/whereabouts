import { Paper, AppBar, TextField, Button } from "@material-ui/core";
import { ArrowDropDownCircle } from "@material-ui/icons";
import { useRef } from "react";
import ChipInput from "material-ui-chip-input";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPostsBySearch } from "../../store/slices/postSlice";
import { useAppDispatch } from "../../store/store";
import Form from "../Form/Form";
import Posts from "../Posts/Posts";
import Pagination from "../Pagination/Pagination";
import useStyles from "./styles";
import "./Home.scss";
import ContinentsBar from "./Continents/ContinentsBar";
import Footer from "./Footer/Footer";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Home = () => {
  const [currentId, setCurrentId] = useState(null);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const query = useQuery();
  const mainSectionRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const navigate = useNavigate();
  const page = query.get("page") || "1";

  const classes = useStyles();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "enter") {
      searchPost();
    }
  };

  const handleAdd = (tag: string) => {
    setTags([...tags, tag]);
  };
  const handleDelete = (tagToDelete: string) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const searchPost = () => {
    if (search.trim() || tags) {
      dispatch(getPostsBySearch({ search, tags: tags.join(",") }));
      navigate(
        `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
      );
    } else {
      navigate("/");
    }
  };
  const cancelSearch = () => {
    navigate("/");
    mainSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollDown = () => {
    mainSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="header">
        <div className="lead">
          <h1 className="header__title gradient">Wheareabouts</h1>
          <p className="header__paragraph text">
            Share amazing places with other people!
          </p>
        </div>
        <div className="dropDown gradient">
          <ArrowDropDownCircle
            color="inherit"
            style={{ fontSize: 50 }}
            className="dropDown__icon"
            onClick={handleScrollDown}
          />
        </div>
      </header>

      <main className="main" ref={mainSectionRef}>
        <div className="main__continents">
          <ContinentsBar />
        </div>

        <div className="main__articles">
          <Posts setCurrentId={setCurrentId} />
        </div>
        <div className="main__forms">
          <AppBar
            className={classes.appBarSearch}
            position="static"
            color="inherit"
          >
            <TextField
              name="search"
              variant="outlined"
              label="Search Places"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <ChipInput
              style={{ margin: "10px 0" }}
              value={tags}
              onAdd={handleAdd}
              onDelete={handleDelete}
              label="Search tags"
              variant="outlined"
            />
            <Button
              onClick={searchPost}
              variant="contained"
              color="primary"
              style={{ marginBottom: 8 }}
            >
              Search
            </Button>
            <Button
              onClick={cancelSearch}
              variant="contained"
              color="secondary"
              size="small"
            >
              Cancel
            </Button>
          </AppBar>
          <Form currentId={currentId} setCurrentId={setCurrentId} />
          <Paper elevation={6} className={classes.pagination}>
            <Pagination page={page} />
          </Paper>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
