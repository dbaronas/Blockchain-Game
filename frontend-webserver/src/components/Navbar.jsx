import { useState, lazy } from 'react'
import { close, logo2, menu } from '../assets'
import { navLinks } from '../constants'
import { useTranslation } from "react-i18next"
import { useAccount } from "wagmi"
import Authentication from './Authentication'
import ProfileDropdown from './ProfileDropdown'
import styles from '../style'
const Logo = lazy(() => import('./Logo'))

const Navbar = () => {
  const [toggle, setToggle] = useState(false)
  const [language, setLanguage] = useState('English')
  const { t, i18n } = useTranslation('NavBar')
  const { isConnected } = useAccount()

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value)
    setLanguage(event.target.value)
  }
  
  // Filter the navLinks array to exclude the last three links
  const navLinksExceptLastTwo = navLinks.slice(0, -3)
  
  const navLinksIfWalletConnected = isConnected ? navLinks : navLinksExceptLastTwo
  
  return (
    <nav className='w-full flex py-6 justify-between items-center navbar pb-0 z-[12]'>

      <Logo />

      <ul className='list-none sm:flex hidden justify-end items-center flex-1'>
        {navLinksExceptLastTwo.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-vt323 font-semibold cursor-pointer text-[32px] ${index === navLinks.length - 1 ? 'mr-0' : 'mr-10'} text-gold hover:text-secondary tracking-wider`}>
            <a href={`${nav.link}`}>
              {t(nav.title)}
            </a>
          </li>
        ))}
        <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="w-13 px-2 py-2 ml-7 rounded-md text-gold2 text-sm bg-transparent border outline-none border-yellow-400 hover:bg-transparent">
            <option value="English">EN</option>
            <option value="Spanish">ES</option>
            <option value="French">FR</option>
            <option value="Lithuanian">LT</option>
        </select>
        <li className="ml-5">
          <div className="flex flex-row">
            <Authentication />
            {isConnected && <ProfileDropdown />}
          </div>
        </li>
      </ul>

      <div className='sm:hidden flex flex-1 justify-end items-center z-[12]'>
        <img
          src={toggle ? close : menu}
          alt='menu'
          className='w-[28px] h-[28px] object-contain'
          onClick={() => { setToggle((prev) => !prev); console.log(toggle) }}
        />
        <div className={`${toggle ? 'flex sidebar' : 'hidden'} p-6 bg-black-gradient absolute top-20 mx-4 my-2 min-w-[140px] rounded-xl`}>
          <ul className='list-none flex flex-col justify-end items-center flex-1'>
          {navLinksIfWalletConnected.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-vt323 font-normal cursor-pointer text-[24px] ${index === navLinks.length - 1 ? 'mr-0' : 'mb-4'} text-gold tracking-wider hover:text-secondary`}
              >
                <a href={`${nav.link}`}>
                  {t(nav.title)}
                </a>
              </li>
            ))}
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="px-2 py-2 mt-4 rounded-md text-gold2 text-sm bg-transparent border outline-none border-yellow-400 hover:bg-transparent">
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="Lithuanian">Lithuanian</option>
            </select>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar