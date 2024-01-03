import React from 'react'

const NewsItem = ({ news_id, release_date, content, isFirst }) => {
  return (
    <div className={`flex justify-center flex-wrap ${isFirst ? 'mt-6' : ''}`}>
        <div className="w-[32rem] h-[10rem] p-5 border-2 border-solid mb-2.5 rounded-md">
            <h2>{news_id}</h2>
            <h3 className="text-white">{release_date}</h3>
            <p className="text-white">{content}</p>
        </div>
    </div>
  )
}

export default NewsItem