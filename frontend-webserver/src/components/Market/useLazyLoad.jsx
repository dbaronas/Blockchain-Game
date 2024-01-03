import { useEffect, useRef, useState } from "react"

const useLazyLoad = ({ triggerRef, onGrabData }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const observer = useRef(null)

  useEffect(() => {
    const loadMore = async () => {
      // Check if data is already being loaded
      if (loading) return 
      setLoading(true)
      const newData = await onGrabData(currentPage)
      setData((prevData) => [...prevData, ...newData])
      setLoading(false)
      setCurrentPage((prevPage) => prevPage + 1)
    }
    

    observer.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (triggerRef.current) {
      observer.current.observe(triggerRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [triggerRef, onGrabData, currentPage])

  return { data, loading }
}

export default useLazyLoad
