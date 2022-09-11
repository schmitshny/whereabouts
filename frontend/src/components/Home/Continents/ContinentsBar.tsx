import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/store";
import { getPostsBySearch } from "../../../store/slices/postSlice";
import africa from "../../../images/continents/africa.png";
import northamerica from "../../../images/continents/northamerica.png";
import southamerica from "../../../images/continents/southamerica.png";
import australia from "../../../images/continents/australia.png";
import asia from "../../../images/continents/asia.png";
import europe from "../../../images/continents/europe.png";

import "./Continents.scss";
const ContinentsBar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const searchPostByTag = (tag: string) => {
    dispatch(getPostsBySearch({ search: "", tags: tag }));
    navigate(`/posts/search?searchQuery="none"&tags=${tag}`);
  };

  return (
    <div className="continents">
      <div className="continents__motto">
        <span> Embark on a </span>
        <span className="gradient lead">life changing</span>{" "}
        <span>journey with others...</span>
      </div>
      <div className="continents__icons">
        <div
          className="continents__icons__item"
          onClick={() => searchPostByTag("africa")}
        >
          <img src={africa} alt="africa icon" />
          <p>Africa</p>
        </div>
        <div
          className="continents__icons__item"
          onClick={() =>
            searchPostByTag("southamerica, South America, america")
          }
        >
          <img src={southamerica} alt="southamerica icon" />
          <p>South America</p>
        </div>
        <div
          className="continents__icons__item"
          onClick={() =>
            searchPostByTag("northamerica, North America, america")
          }
        >
          <img src={northamerica} alt="northamerica icon" />
          <p>North America</p>
        </div>
        <div
          className="continents__icons__item"
          onClick={() => searchPostByTag("australia")}
        >
          <img src={australia} alt="australia icon" />
          <p>Australia</p>
        </div>
        <div
          className="continents__icons__item"
          onClick={() => searchPostByTag("europe")}
        >
          <img src={europe} alt="europe icon" />
          <p>Europe</p>
        </div>
        <div
          className="continents__icons__item"
          onClick={() => searchPostByTag("asia")}
        >
          <img src={asia} alt="asia icon" />
          <p>Asia</p>
        </div>
      </div>
    </div>
  );
};

export default ContinentsBar;
