import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Header from './header';
import ForceLightMode from './ForceLightMode';
import SuggestedProductsChatbot from './SuggestedProductsChatbot';
import { UserProvider } from './UserContext';


const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
      <ForceLightMode>
        <div className="min-h-screen h-screen w-screen flex flex-col">
          <Header />
          <div className="flex-1 p-4 overflow-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/suggested-products" element={<SuggestedProductsChatbot />} />
            </Routes>
          </div>
        </div>
      </ForceLightMode>
      </UserProvider>
    </Router>
  );
};

export default App;