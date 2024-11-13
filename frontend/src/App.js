import PublicRoute from './Guard/PublicRoute';
import PrivateRoute from './Guard/PrivateRoute';
import './App.css';
import Dashboard from './modules/Dashboard';
import Form from './modules/Form';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/SignIn';
import Signup from './pages/Signup';

function App() {
  return (
    <Routes>
      {/* <Route path='/' element={
        <PrivateRoute auth={true}>
          <Dashboard/>
        </PrivateRoute>
      } /> */}
      {/* <Route path='/users/sign_in' element={
      <PrivateRoute>
        <Form isSignInPage={true}/>
      </PrivateRoute>
      } /> */}
      {/* <Route path='/users/sign_up' element={
        <PrivateRoute>
        <Form isSignInPage={false}/>
      </PrivateRoute>
      } /> */}
      <Route path="/" element={<PrivateRoute><Dashboard auth={true} /></PrivateRoute>} />
      <Route path="/signin" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
    </Routes>
  );
}

export default App;
