import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm'
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Protected from './protected/Protected';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginForm/>} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;