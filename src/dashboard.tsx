// Dashboard.tsx
import React from 'react';
import Stats1 from './stats1';
import Stats2 from './stats2';
import Stats3 from './stats3';
import Chatbot from './chatbot';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full gap-4 p-4">
      {/* Grid container that stacks on mobile and uses 2 columns on md screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Each card now has consistent padding and height management */}
        <div className="flex flex-col overflow-hidden rounded-lg bg-[#fff8e0] h-[600px] md:h-auto">
          <div className="flex-1 overflow-auto p-4">
            <Stats1 />
          </div>
        </div>
        
        <div className="flex flex-col overflow-hidden rounded-lg bg-[#fff8e0] h-[600px] md:h-auto">
          <div className="flex-1 overflow-auto p-4">
            <Stats2 />
          </div>
        </div>
        
        <div className="flex flex-col overflow-hidden rounded-lg bg-[#fff8e0] h-[600px] md:h-auto">
          <div className="flex-1 overflow-auto p-4">
            <Stats3 />
          </div>
        </div>
        
        <div className="flex flex-col overflow-hidden rounded-lg bg-[#fff8e0] h-[600px] md:h-auto">
          <div className="flex-1 overflow-auto p-4">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;