import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Routers from './routers'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from 'react-scroll-to-top';


function App() {

  return (
    <BrowserRouter>
      <Routers />
      <ToastContainer/>
      <ScrollToTop 
      className="px-2" 
      style={{color: "", backgroundColor: "#ffcd0c", height: "44px", width: "44px", opacity: 0.8}} 
      smooth
      />
    </BrowserRouter>
  )
}

export default App
