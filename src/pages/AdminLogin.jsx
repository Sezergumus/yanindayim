import React, { useState } from 'react';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext.jsx';

const AdminLogin = () => {
      const [inputs, setInputs] = useState({
        username: '',
        password: ''
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(inputs => ({ ...inputs, [name]: value }));
      };
    
      const navigate = useNavigate()
    
      const { adminLogin } = useContext(AuthContext);
    
      const handleSubmit = async (e) => {
        if(!inputs.username || !inputs.password) {
          alert('Lütfen tüm alanları doldurunuz.')
        } else {
          try {
            await adminLogin(inputs)
            navigate('/')
          } catch (error) {
            console.log(error)
          }
        }
      }
    
      return (
        <div className='login-container'>
          <div className='login-form'>
            <h1>Giriş yap</h1>
            <form>
              <TextField id="outlined-basic" label="Kullanıcı Adı" name="username" variant="outlined" onChange={handleChange} sx={{width:'25ch'}}/>
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
          </div>
        </div>
      )
}

export default AdminLogin