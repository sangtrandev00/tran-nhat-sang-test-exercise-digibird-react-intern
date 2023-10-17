import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Routers from './routers'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
function App() {

  return (
    <BrowserRouter>
      <Routers />
      <ToastContainer/>
    </BrowserRouter>
  )
}

export default App
