// Dashboard.tsx
import React from 'react';
import Stats1 from './stats1';
import Stats2 from './stats2';
import Stats3 from './stats3';
import Chatbot from './chatbot';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 space-y-4">
        {/* Grid container that stacks on mobile and uses 2 columns on md screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#fff8e0] rounded-lg">
            <Stats1 />
          </div>
          
          <div className="bg-[#fff8e0] rounded-lg">
            <Stats2 />
          </div>
          
          <div className="bg-[#fff8e0] rounded-lg">
            <Stats3 />
          </div>
          
          <div className="bg-[#fff8e0] rounded-lg">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;