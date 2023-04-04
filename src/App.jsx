import {
  BrowserRouter,
  RouterProvider,
  Routes,
  Route,
  Outlet
} from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Create from './pages/Create'
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import ResetPass from './pages/ResetPassword'
import ForgotPass from './pages/ForgotPassword'
import './assets/style.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'markpro',
      fontSize: 16,
    },
  },
});

const Layout = () => {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
};

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Routes>
          <Route path='/' element={<Layout/>}>
            <Route index element={<Home/>}/>
            <Route path="giris" element={<Login/>}/>
            <Route path="kayit" element={<Register/>}/>
            <Route path="olustur" element={<Create/>}/>
            <Route path="admin" element={<AdminPanel/>}/>
            <Route path="admin/login" element={<AdminLogin/>}/>
            <Route path="sifremi-unuttum" element={<ForgotPass/>}/>
            <Route path="sifre-sifirla" element={<ResetPass/>}/>
          </Route>
        </Routes>
      </ThemeProvider>
    </div>
  )
}

export default App
