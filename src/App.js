import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { AuthPage } from './components/AuthPage/AuthPage';
import { ChatPage } from './components/ChatPage/ChatPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route 
            path={"/auth"} 
            exact
            element={<AuthPage/>}
          />
          <Route 
            path={"/chat"}
            element={<ChatPage/>}
          />
          <Route 
            path="/" 
            element={<Navigate replace to="/auth" />} 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
