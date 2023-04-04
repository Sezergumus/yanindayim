import React from 'react'
import yanindayimLogo from '../assets/yanindayim-footer.svg'
import draftLogo from '../assets/draft-footer.svg'
import { Grid } from '@mui/material'


const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <div className="footer-left">
          <img src={yanindayimLogo} className='yanindayim-logo' style={{height:'12px', display: 'inline', width:'fit-content'}} alt="yanindayim logo"/><span className="footer-text">kâr amacı gütmeden, imece usulu bilgi paylaşımı yapan bir <b>sosyal sorumluluk projesidir. </b><b>Bu sitede yer alan bilgilerin kesin doğruluk payı bulunmamaktadır. Sorumluluk tamamen kullanıcılara aittir.</b></span>
        </div>
        <div className="footer-middle">
          <div className="yanindayim-contact">
            <div className="social">
              <a href="https://www.instagram.com/yanindayimco/" target="_blank" rel="noreferrer" className='instagram'>
                INSTAGRAM
              </a>
              <a href="https://discord.gg/s7BxQ7tprB" target="_blank" className='discord'>
                DISCORD
              </a>
            </div>
            <div className="mail">
              <p>Soru, öneri ve görüşleriniz için</p>
              <a href="mailto:destek@yanindayim.co">destek@<b>yanindayim</b>.co</a> / <a href="mailto:hello@draft.ist">hello@<b>draft</b>.ist</a>
            </div>
          </div>
        </div>
        <div className="footer-right">
          <a className="draft-works" href="https://draft.ist" target="_blank">
            <img src={draftLogo} className='draft-footer' style={{height:'2.5rem'}} alt='draft logo'></img>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer