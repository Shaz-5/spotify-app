import './App.css';
import { useEffect } from 'react';
import Dashboard from './components/Dashboard';

function App() {

  const access_token = new URLSearchParams(window.location.hash).get('#access_token');
  const refresh_token = new URLSearchParams(window.location.hash).get('refresh_token');
  const expires_in = new URLSearchParams(window.location.hash).get('expires_in');

  useEffect(() => {
    if (!access_token) {
      window.location = "http://localhost:8888/login";
    }
  }, [access_token]);

  return (
    <div>
      <Dashboard  access_token={access_token} refresh_token={refresh_token} expires_in={expires_in}/>
    </div>
  );
}

export default App;
