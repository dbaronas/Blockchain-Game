import { Route, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Children } from 'react'

const RouteGuard = ({walletConnected, children}) => {

    console.log('lol' + walletConnected)

    if(!walletConnected){
        return <Navigate to='/login' replace />
    }
    return children
    
}

export default RouteGuard