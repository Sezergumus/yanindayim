import React, { useState } from 'react'
import { Button, FormGroup } from '@mui/material'
import TextField from '@mui/material/TextField';
import axios from 'axios'
import ReCAPTCHA from "react-google-recaptcha"; 
import { Link } from 'react-router-dom'

const Register = () => {
  const [inputs, setInputs] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    password2: ''
});

  const [recaptcha, setRecaptcha] = useState(false)

  const recaptchaChange = (value) => {
    setRecaptcha(true)
  }

const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(inputs => ({ ...inputs, [name]: value }));
}

const handleSubmit = async (e) => {
    e.preventDefault();
    // Check recaptcha
    if(!recaptcha) {
      alert('Lütfen reCAPTCHA kutucuğunu işaretleyin.')
      return
    } else if(inputs.password !== inputs.password2){
      alert('Şifreler eşleşmiyor!')
    } else if(inputs.password.length > 16 || inputs.password.length < 4){
        alert('Şifre en az 4 en fazla 16 karakter olabilir!')
    } else if(!inputs.email.includes('@')){
        alert('Geçerli bir e-posta giriniz!')
    } else if(!inputs.phone.match(/^[0-9]+$/)){
        alert('Telefon numarası sadece rakamlardan oluşabilir!\nBoşluk bırakmayınız!')
    } else if(inputs.phone.length !== 10){
        alert('Telefon numarası 10 haneli olmalıdır!')
    } else {
        await axios.post('http://localhost:8080/api/auth/register', inputs, {
          withCredentials: true
        })
        .then(res => {
            // set user to local storage
            localStorage.setItem('user', JSON.stringify(res.data))
            // redirect to home page
            window.location.href = '/'
        })
        .catch(err => {
            if(err.response.status === 409){
                alert('Bu e-posta adresi veya telefon numarası zaten kayıtlı!')
            } else { 
                alert('Bir hata oluştu!')
            }
        })
    }
}

  return (
    <div className='register-container'>
      <div className='register-form'>
        <h1>Kayıt Ol</h1>
        <form action={handleSubmit}>
          <FormGroup>
          <TextField id="outlined-basic" label="Ad Soyad" placeholder="Ad Soyad" variant="outlined" sx={{width:'100%'}} name='fullName' onChange={handleChange}/>
          <TextField id="outlined-basic" label="E-posta" placeholder="E-posta" variant="outlined" name='email' onChange={handleChange} sx={{width:'100%'}}/>
          <TextField id="outlined-basic" label="Telefon Numarası" placeholder="5xx xxx xx xx" variant="outlined" type="tel" name='phone' onChange={handleChange} sx={{width:'100%'}}/>
          <TextField
            id="outlined-password-input"
            placeholder="Şifre"
            label="Şifre"
            type="password"
            autoComplete="current-password"
            onChange={handleChange}
            name='password'
            inputProps={{ maxLength: 16 }}
            sx={{width:'100%'}}
          />
          <TextField
            id="outlined-password-input"
            placeholder="Şifre Tekrar"
            label="Şifre Tekrar"
            type="password"
            autoComplete="current-password"
            onChange={handleChange}
            name='password2'
            inputProps={{ maxLength: 16 }}
            sx={{width:'100%'}}
          />
          <Button 
            variant="contained"
            size="large"
            className='card-button'
            onClick={handleSubmit}
            fullWidth
            sx={{color: 'white', borderRadius: 0.7,fontFamily: 'markpro-bold', textTransform: 'none', backgroundColor: '#4A2C8F', '&:hover': {backgroundColor: '#4A2C8F'}}}
          >KAYIT OL</Button>
        </FormGroup>
        </form>
        <ReCAPTCHA sitekey='6LcQCm8kAAAAADlirK5s8VD5b2RY8K-SQJ9MWZeJ' className='g-recaptcha' onChange={recaptchaChange} />
        <Link to="/giris">Zaten hesabın var mı?</Link>
      </div>
    </div>
  )
}

export default Register