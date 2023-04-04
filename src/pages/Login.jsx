import React, { useState } from 'react';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext.jsx';
import { Link } from 'react-router-dom';


const Login = () => {
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(inputs => ({ ...inputs, [name]: value }));
  };

  const navigate = useNavigate()

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    if(!inputs.email || !inputs.password) {
      alert('Lütfen tüm alanları doldurunuz.')
    } else if(!inputs.email.includes('@')) {
      alert('Geçerli bir e-posta giriniz!')
    } else if(inputs.password.length > 16 || inputs.password.length < 4) {
      alert('Şifre en az 4 en fazla 16 karakter olabilir!')
    } else {
      try {
        await login(inputs)
        navigate('/')
      } catch (error) {
        alert('Hatalı giriş yaptınız!')
      }
    }
  }

  return (
    <div className='login-container'>
      <div className='login-form'>
        <h1>Giriş yap</h1>
        <form>
          <TextField id="outlined-basic" label="E-posta" name="email" variant="outlined" onChange={handleChange} sx={{width:'25ch'}}/>
          <TextField
            id="outlined-password-input"
            label="Şifre"
            type="password"
            name="password"
            onChange={handleChange}
            autoComplete="current-password"
          />
          <Button 
            variant="contained"
            size="large"
            className='card-button'
            onClick={handleSubmit}
            sx={{color: 'white', borderRadius: 0.7,fontFamily: 'markpro-bold', textTransform: 'none', backgroundColor: '#4A2C8F', '&:hover': {backgroundColor: '#4A2C8F'}}}
          >GİRİŞ YAP</Button>
        </form>
        <Link to="/sifremi-unuttum" style={{marginBottom:8}}>Şifreni mi unuttun?</Link>
        <Link to="/kayit">Hesabın yok mu?</Link>
      </div>
    </div>
  )
}

export default Login