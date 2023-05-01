import { login } from '../assets'
import Authentication from '../components/Authentication'
import { useLocation } from 'react-router-dom'
import { useAccount } from "wagmi"

const Login = () => {
    const { state } = useLocation();
    const { from = "/" } = state || {};
    const { isConnected } = useAccount()

    return (
        <div className=' text-white h-[50vh] flex justify-center items-center'>
            {!isConnected
                ?
                <div className=' h-[400px] w-[400px] bg-neutral-700 grid place-items-center'>
                    <p className='text-white'>
                        Please login in order to proceed
                    </p>
                    <img src={login} alt="login" />
                    <Authentication />
                </div>
                : window.location.replace(from.pathname)
            }
        </div>

    )
}

export default Login
