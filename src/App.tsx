// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Header from './header';
import ForceLightMode from './ForceLightMode';
import SuggestedProductsChatbot from './SuggestedProductsChatbot';
import InsuranceTools from './InsuranceTools';
import Resources from './Resources';
import Quiz from './Quiz';
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
                <Route path="/insurancetools" element={<InsuranceTools />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/quiz" element={<Quiz />} />
              </Routes>
            </div>
          </div>
        </ForceLightMode>
      </UserProvider>
    </Router>
  );
};

export default App;