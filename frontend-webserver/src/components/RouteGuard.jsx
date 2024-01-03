import { Navigate, useLocation } from "react-router-dom"

const RouteGuard = ({ walletConnected, children }) => {

    const location = useLocation();

    if (!walletConnected) {
        return (
            <Navigate to='/login' replace state={{ from: location }} />
        )
    } else {
        return children
    }

}

export default RouteGuard