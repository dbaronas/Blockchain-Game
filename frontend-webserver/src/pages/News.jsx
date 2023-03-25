import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import NewsItem from "./NewsItem";

const News = () => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const getArticles = async () => {
      const response = await axios.get(
        "http://193.219.91.103:6172/api/v1/news"
      );
      console.log(response);
      console.log(response.data.articles);
      setArticles(response.data);
    };
    getArticles();

    // [] emtpy dependency area, data will be loaded once
  }, []);
  return (
    <div>
      {articles.map((article) => {
        return (
          <NewsItem
            key={article.news_id}
            release_date={article.release_date}
            content={article.content}
          />
        );
      })}
    </div>
  );
};

export default News
