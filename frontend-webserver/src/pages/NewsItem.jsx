import React from 'react'

const NewsItem = ({ news_id, release_date, content}) => {
  return (
    <div className='flex justify-center'>
        <div className='w-[32rem] p-5 border-2 border-solid margin-bottom: 1.25rem;'>
            <h2>{news_id}</h2>
            <h3 className='text-white'>{release_date}</h3>
            <p className='text-white'>{content}</p>
        </div>
    </div>
  )
}

export default NewsItem