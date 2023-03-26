import React, { useState, useEffect } from "react"
import NewsItem from "./NewsItem"
import $ from "jquery"

const News = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    $.ajax({
      url: "http://193.219.91.103:6172/api/v1/news",
      type: "GET",
      dataType: "json",
      success: function (response) {
        setArticles(response)
      },
      error: function (xhr, status, err) {
        setError(err.toString())
      },
    })
  }, [])

  if (error) {
    return <div className="text-white flex justify-center p-3.5 font-medium text-[1.5rem]">Error: {error}</div>
  }

  return (
    <div>
      {articles.map((article, index) => {
        return (
          <NewsItem
            key={article.news_id}
            release_date={article.release_date}
            content={article.content}
            isFirst={index === 0}
          />
        )
      })}
    </div>
  )
}

export default News
