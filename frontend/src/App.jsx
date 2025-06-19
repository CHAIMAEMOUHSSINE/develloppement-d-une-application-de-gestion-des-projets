import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Whyus from './pages/whyus';
import Pricing from './pages/Pricing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Admindash from './pages/Admindash';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import Tasks from './pages/Tasks';
import Invoices from './pages/Invoices';
import Projects from './pages/Projects';
import Taskse from './pages/Taskse';
import Notes from './pages/Notes';
import Documents from './pages/Documents';
import Whiteboard from './pages/Whiteboard';
import Addemplo from './pages/Addemplo';
import Historique from './pages/Historique';
import MediaRecorder from './components/MediaRecorder';
import TasksEmployeePage from './pages/TasksEmployeePage';


function App() {
  return (
    <Router>
      <Routes>
      <Route index element={<HomePage />} />
      <Route path="/Admindash" element={<Admindash />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/whyus" element={<Whyus/>} />
        <Route path="/Pricing" element={<Pricing/>} />
        <Route path="/Signup" element={<Signup/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/Customers" element={<Customers/>} />
        <Route path="/Employees" element={<Employees/>} />
        <Route path="/Tasks" element={<Tasks/>} />
        <Route path="/Invoices" element={<Invoices/>} />
        <Route path="/Projects" element={<Projects/>} />
        <Route path="/Taskse" element={<Taskse/>} />
                <Route path="/TasksEmployeePage" element={<TasksEmployeePage/>} />

        <Route path="/Documents" element={<Documents/>} />
        <Route path="/Notes" element={<Notes/>} />
        <Route path="/Whiteboard" element={<Whiteboard/>} />
        <Route path="/Addemplo" element={<Addemplo/>} />
        <Route path="/Historique" element={<Historique/>} />
        <Route path="/MediaRecorder" element={<MediaRecorder/>} />


      </Routes>
    </Router>
  );
}
export default App;