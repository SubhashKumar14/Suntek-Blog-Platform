import React from 'react'
import { siteFooterClass, siteFooterContainer, siteFooterLink } from '../styles/common'

function Footer() {
  return (
    <footer className={siteFooterClass}>
      <div className={siteFooterContainer}>
        <div>
          &copy; {new Date().getFullYear()} Blog Platform. All rights reserved.
        </div>
        
        <div className="flex gap-5">
          <a href="#" className={siteFooterLink}>Privacy Policy</a>
          <a href="#" className={siteFooterLink}>Terms of Service</a>
          <a href="#" className={siteFooterLink}>Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer