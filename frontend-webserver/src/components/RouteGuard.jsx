import { Route, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Children } from 'react'

const RouteGuard = ({children}) => {

    function hasJWT() {
        let flag = false

        Cookies.get('access-token') ? flag = true : flag = false

        return flag
    }

    if(!hasJWT()){
        return <Navigate to='/login' replace />
    }
    return children
    
}

export default RouteGuard