import { TextField } from '@mui/material'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ResetPass = () => {
    const [inputs, setInputs] = useState({
        password: '',
        password2: ''
    })

    const navigate = useNavigate()
    const url = window.location.search
    const urlParams = new URLSearchParams(url);
    const userId = urlParams.get('userId')
    const token = urlParams.get('token')

    const handleSubmit = (e) => {
      // Check if passwords match
        if(inputs.password !== inputs.password2){
            alert('Şifreler eşleşmiyor!')
        } else if(inputs.password.length > 16 || inputs.password.length < 4){
            alert('Şifre en az 4 en fazla 16 karakter olabilir!')
        } else {
            axios.post('http://localhost:8080/api/auth/reset-password', { password: inputs.password, id: userId, token: token }, { withCredentials: true })
            .then(res => {
                if(res.status === 200){
                    localStorage.setItem('user', JSON.stringify(res.data))         
                    navigate('/')
                } else if (res.status === 404){
                    alert('Kullanıcı bulunamadı!')
                } 
            })
            .catch(err => {
                if(err.response.data.message === 'Yeni şifre eski şifrenizle aynı olamaz!'){
                    alert(err.response.data.message)
                } else{
                    alert('Şifre sıfırlama bağlantısı geçersiz!')
                }
            })
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

  return (
    <div className="forgot-password-container">
    <div className='forgot-password-adjuster'>
        <div className="forgot-password-form-container">
          <h1>Şifre Sıfırla</h1>
          <TextField id="outlined-basic" fullWidth label="Şifre" type="password" inputProps={{ maxLength: 16 }} placeholder="Şifre" variant="outlined" name='password' onChange={ handleChange } sx={{maxWidth: '25ch', marginBottom: '8px' }}/>
          <TextField id="outlined-basic" fullWidth label="Şifre tekrar" type="password" inputProps={{ maxLength: 16 }} placeholder="Şifre tekrar" variant="outlined" name='password2' onChange={ handleChange } sx={{maxWidth: '25ch', marginBottom: '8px' }}/>
          <button onClick={handleSubmit} className='forgot-password-button'>Gönder</button>
        </div>
    </div>
  </div>
  )
}

export default ResetPass