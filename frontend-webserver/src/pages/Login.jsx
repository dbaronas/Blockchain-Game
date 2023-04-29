import { login } from '../assets'
import Authentication from '../pages/Authentication'
import { useLocation } from 'react-router-dom'

const Login = () => {
    const { state } = useLocation();
    const { from = "/" } = state || {};
    let wallet = Authentication()
    let walletConnected = wallet.props.children[0].props.children[0].props.children.props.currentAddress
    console.log(walletConnected)

    return (
        <div className=' text-white h-[50vh] flex justify-center items-center'>
            {!walletConnected
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
