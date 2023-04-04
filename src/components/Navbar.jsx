import React, { useContext } from 'react'
import yanindayimLogo from '../assets/logo.svg'
import ahbapLogo from '../assets/ahbap.png'
import { AuthContext } from '../context/authContext'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className='header'>
      <Link to='/'>
        <img src={yanindayimLogo} className='yanindayim-logo' alt="" srcset=""/>
      </Link>
      <div className="right-container">
        <a
          className='donate-container' 
          href='https://ahbap.org/bagisci-ol'
          target='_blank'>
          <img src={ahbapLogo} alt="" width="128px"/>
          <span className='btn-donate'>
            BAĞIŞ YAP
          </span>
        </a>
        <div className="account">
          {currentUser ? (
            <>
              <span className="user-name">{currentUser?.full_name}</span>
              <a className="logout-button" onClick={logout}><b>Çıkış Yap</b></a>
            </>
          ) : (
            <>
            <Link className="register-button" to="/kayit"><b>Üye Ol</b></Link>
            <Link className="login-button" to="/giris"><b>Giriş Yap</b></Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar