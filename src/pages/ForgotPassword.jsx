import { TextField } from '@mui/material'
import React, { useState } from 'react'
import axios from 'axios'

const ForgotPass = () => {
  const [mail, setMail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/auth/forgot-password', { mail }, { withCredentials: true })
    .then(res => {
      if(res.status === 200){
        alert('Şifre sıfırlama maili gönderildi!')
      } else if (res.status === 404){
        alert('Kullanaıcı bulunamadı!')
      }
    }
    )
    .catch(err => {
      if(err.response.status === 404){
        alert('Kullanıcı bulunamadı!')
      }
    }
    )
  }

  return (
    <div className="forgot-password-container">
      <div className='forgot-password-adjuster'>
          <div className="forgot-password-form-container">
            <h1>Şifremi Unuttum</h1>
            <TextField id="outlined-basic" fullWidth label="E-posta" placeholder="E-posta" variant="outlined" name='email' onChange={ (e) => { setMail(e.target.value) }} sx={{maxWidth: '25ch', marginBottom: '8px' }}/>
            <button onClick={handleSubmit} className='forgot-password-button'>Gönder</button>
          </div>
      </div>
    </div>
  )
}

export default ForgotPass