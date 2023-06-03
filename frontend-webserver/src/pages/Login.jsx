import { login } from '../assets'
import Authentication from '../components/Authentication'
import { useLocation } from 'react-router-dom'
import { useAccount } from "wagmi"
import styles from '../style'

const Login = () => {
    const { state } = useLocation();
    const { from = "/" } = state || {};
    const { isConnected } = useAccount()

    return (
        <div className=' text-white h-[50vh] flex justify-center items-center'>
            {!isConnected
                ?
                <div className='flex flex-row justify-between items-center p-1'>
                    <div className='max-w-[600px] max-h-[450px] bg-neutral-700 flex flex-col justify-center items-center xl:px-6 sm:px-16 px-6'>
                        <p className='text-white p-5'>
                            Please login in order to proceed
                        </p>
                        <h1 className=' text-start text-[40px] text-red-600 font-vt323 font-semibold'>IMPORTANT!</h1>
                        <ul className='marker:text-white list-disc pb-5'>
                            <li className={`${styles.paragraph} max-w-[500px] text-white`}>We do not gain access to any of your private data like private keys or passwords.</li>
                            <li className={`${styles.paragraph} max-w-[500px] text-white`}>We only ask for your public address, account balance and activity.</li>
                            <li className={`${styles.paragraph} max-w-[500px] text-white`}>Wallet connection is handled by WalletConnect communications protocol.</li> 
                        </ul>
                        <div className='pb-10'>
                            <Authentication />
                        </div>
                    </div>
                </div>
                : window.location.replace(from.pathname)
            }
        </div>

    )
}

export default Login
