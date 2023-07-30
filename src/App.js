import Login from './Components/Login'
import Signup from './Components/Signup';
import Home from './Components/Home';
import AddTask from './Components/AddTask';
import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/home/:id' element={<Home />} />
        <Route path='/addtask' element={<AddTask />} />
      </Routes>
    </div>
    </>
  );
}

export default App;
