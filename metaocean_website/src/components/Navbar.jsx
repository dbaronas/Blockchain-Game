import { useState } from 'react'
import { close, logo, menu } from '../assets'
import { navLinks } from '../constants'

const Navbar = () => {
const [toggle, setToggle] = useState(false)

  return (
    <nav className='w-full flex py-6 justify-between items-center navbar'>
      <img src={logo} alt='hoobank'
      className='w-[266px] h-[73px]'/>

      <ul className='list-none sm:flex hidden justify-end items-center flex-1'>
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-vt323 font-normal cursor-pointer text-[32px] ${index === navLinks.length - 1 ? 'mr-0' : 'mr-10'} text-red-600 tracking-wider`}
          >
            <a href={`#${nav.id}`}>
              {nav.title}
            </a>
          </li>
        ))}
      </ul>

      <div className='sm:hidden flex flex-1 justify-end items-center'>
          <img src={toggle ? close : menu} 
            alt='menu'
            className='w-[28px] h-[28px]
            object-contain'
            onClick={() => { setToggle((prev) => !prev); console.log(toggle)}}
          />
          <div className={`${toggle ? 'flex sidebar' : 'hidden'} p-6 bg-black-gradient absolute
          top-20 mx-4 my-2 min-w-[140px] rounded-xl`}>
            <ul className='list-none flex flex-col justify-end items-center flex-1'>
              {navLinks.map((nav, index) => (
                <li
                  key={nav.id}
                  className={`font-vt323 font-normal cursor-pointer text-[24px] ${index === navLinks.length - 1 ? 'mr-0' : 'mb-4'} text-red-700 tracking-wider`}
                >
                  <a href={`#${nav.id}`}>
                    {nav.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
      </div>

    </nav>
  )
}

export default Navbar