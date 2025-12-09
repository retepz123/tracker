import { BrowserRouter, Route, Routes} from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {

  return (
   <BrowserRouter>
      <Routes>
        <Route element={<SignUp/>} path='/' />
        <Route element={<Home />} path='Map' />
        <Route element={<Login />} path='/login' />
      </Routes>
   </BrowserRouter>
  );
}

export default App;