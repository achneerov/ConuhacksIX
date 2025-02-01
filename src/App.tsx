import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './dashboard';
import Header from './header';
import ForceLightMode from './ForceLightMode';
import MortgageCalculator from './MortgageCalculator';
import SuggestedProductsChatbot from './SuggestedProductsChatbot';

const App: React.FC = () => {
  return (
    <Router>
      <ForceLightMode>
        <div className="min-h-screen h-screen w-screen flex flex-col">
          <Header />
          <div className="flex-1 p-4 overflow-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
              <Route path="/suggested-products" element={<SuggestedProductsChatbot />} />
            </Routes>
          </div>
        </div>
      </ForceLightMode>
    </Router>
  );
};

export default App;