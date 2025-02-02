// Dashboard.tsx
import React from 'react';
import Stats1 from './stats1';
import Stats2 from './stats2';
import Stats3 from './stats3';
import Chatbot from './chatbot';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Investment Performance */}
          <div className="bg-[#fff8e0] rounded-lg shadow">
            <Stats1 />
          </div>
          
          {/* Money-Saving Challenges */}
          <div className="bg-[#fff8e0] rounded-lg shadow">
            <Stats2 />
          </div>
          
          {/* Sun Life Resources */}
          <div className="bg-[#fff8e0] rounded-lg shadow">
            <Stats3 />
          </div>
          
          {/* Chatbot */}
          <div className="bg-[#fff8e0] rounded-lg shadow">
            <div className="h-full">
              <Chatbot />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;