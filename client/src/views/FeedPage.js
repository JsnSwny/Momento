import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "../components/feed/Post";
import ScrapCard from "../components/feed/ScrapCard";
import { getPosts } from "../store/actions/posts";

const FeedPage = () => {
  const dispatch = useDispatch();
  const filterList = ["Holidays", "Weddings", "Nature", "Anniversary"];
  const [currentFilter, setCurrentFilter] = useState(filterList[0]);
  const posts = useSelector((state) => state.posts.posts);

  useEffect(() => {
    dispatch(getPosts());
  }, []);

  return (
    <div className="wrapper--md">
      <div className="feed">
        <h2>My Scraps</h2>
        <div className="flex-container post-cards">
          <ScrapCard />
          <ScrapCard />
          <ScrapCard />
          <ScrapCard />
        </div>

        <div className="feed__checkout">
          <h2 className="feed__title center">Check out the latest scraps</h2>
          <ul className="feed-filters">
            {filterList.map((item) => (
              <li
                onClick={() => setCurrentFilter(item)}
                className={`${currentFilter == item ? "active" : ""}`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <ul>
          {posts.map((post) => (
            <Post post={post} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeedPage;
