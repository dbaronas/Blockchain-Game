import React from 'react'
import ReactPlayer from 'react-player'
import styles from '../style'
import { logo2 } from '../assets'
import { footerLinks, socialMedia } from '../constants'

const Footer = () => (
  <section className={`${styles.flexCenter} ${styles.paddingY} flex-col`}>
    <div className={`${styles.flexStart} md:flex-row flex-col mb-8 w-full`}>
      <div className='flex-1 flex flex-col justify-start mr-10'>
      <ReactPlayer url={logo2} playing={true} controls={false} playsinline={true} loop={true} muted={true} width={266} height={73} />
        <p className={`${styles.paragraph} mt-4 max-w-[310px]`}>
          MetaOcean is the best game you will ever find! Pls buy some NFTs
        </p>
      </div>

      <div className='flex-[1.5] w-full flex flex-row justify-between flew-wrap md:mt-0 mt-10'>
        {footerLinks.map((footerLink) => (
          <div key={footerLink.title.toString()} className='flex flex-col ss:my-0 my-4 min-w-[150px]'>
            <h4 className='font-vt323 font-medium text-[18px] leading-[27px] text-white'>
              {footerLink.title.toString()}
            </h4>
            <ul className='list-none mt-4'>
              {footerLink.links.map((link, index) => (
                <li key={link.name.toString()} className={`font-vt323 font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary curson-pointer
                ${index !== footerLink.links.length - 1 ? 'mb-4' : 'mb-0'}`}>
                  {link.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className='w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45]'>
      <p className='font-vt323 font-normal text-center text-[18px] leading-[27px] text-white'>
        2023 MetaOcean. All Rights Reserved.
      </p>

      <div className='flex flex-row md:mt-0 mt-6'>
        {socialMedia.map((social, index) => (
          <img 
            key={social.id}
            src={social.icon}
            alt={social.id}
            className={`w-[21px] h-[21px] object-contain cursor-pointer ${index !== socialMedia.length-1 ? 'mr-6' : 'mr-0'}`}
          />
        ))}
      </div>
    </div>
  </section>
)

export default Footer