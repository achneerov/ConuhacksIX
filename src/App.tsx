import React from 'react';
import Dashboard from './dashboard';
import Header from './header';
import ForceLightMode from './ForceLightMode';

const App: React.FC = () => {
  return (
    <ForceLightMode>
      <div className="min-h-screen h-screen w-screen flex flex-col">
        <Header />
        <div className="flex-1 p-4 overflow-hidden">
          <Dashboard />
        </div>
      </div>
    </ForceLightMode>
  );
};

export default App;