import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm'
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Protected from './protected/Protected';
import Settings from './components/Settings';
import Profile from './components/Profile';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginForm/>} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>}></Route>
        <Route path="/settings" element={<Protected><Settings /></Protected>}></Route>
        <Route path="/profile" element={<Protected><Profile /></Protected>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;