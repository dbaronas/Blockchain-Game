import React, { useRef } from 'react'
import { LoadingCards } from './LoadingCards'
import clsx from 'clsx'
import useLazyLoad from './useLazyLoad'
import Card from './Card'
import posts from './data.json'
import useWindowSize from './useWindowSize'


const Cards = () => {
  const nfts = posts["data"]
  const triggerRef = useRef(null)
  const { width } = useWindowSize()
  let cardsPerPage = 4

  if (width >= 1700) {
    cardsPerPage = 5 
  } else if (width >= 1200) {
    cardsPerPage = 4 
  } else if (width >= 1060) {
    cardsPerPage = 3 
  } else if (width <= 860) {
    cardsPerPage = 2
  } else if (width >= 625) {
    cardsPerPage = 2
  } else if (width >= 280) {
    cardsPerPage = 1
  }

  const onGrabData = (currentPage) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const startIndex = (currentPage - 1) * cardsPerPage
        const endIndex = startIndex + cardsPerPage
        const data = nfts.slice(startIndex, endIndex)
        resolve(data)
      }, 1000)
    })
  }
  
  const { data, loading} = useLazyLoad({ triggerRef, onGrabData })

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5
     gap-4 content-start min-[280px]:grid-cols-1 min-[625px]:grid-cols-2 mb-2">
        {data.map((image, index) => {
            return <Card key={index} id={index + 1} owner={image["owner"]} imageUrl={image["imageUrl"]} />
        })}
    </div>
    {/* clsx dynamically generates classes using conditions for data fetching */}
    {data.length < nfts.length && (
        <div ref={triggerRef} className={clsx("trigger", { visible: loading })}>
          <LoadingCards />
        </div>
    )}
    </>
  )
}

export default Cards