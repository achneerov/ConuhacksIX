import React from 'react';
import Stats1 from './stats1';
import Stats2 from './stats2';
import Stats3 from './stats3';
import Chatbot from './chatbot';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex flex-row gap-4 flex-1 min-h-0">
        <div className="flex-1 rounded-lg p-4" style={{ backgroundColor: '#fff8e0' }}>
          <Stats1 />
        </div>
        <div className="flex-1 rounded-lg p-4" style={{ backgroundColor: '#fff8e0' }}>
          <Stats2 />
        </div>
      </div>
      <div className="flex flex-row gap-4 flex-1 min-h-0">
        <div className="flex-1 rounded-lg p-4" style={{ backgroundColor: '#fff8e0' }}>
          <Stats3 />
        </div>
        <div className="flex-1 rounded-lg p-4" style={{ backgroundColor: '#fff8e0' }}>
          <Chatbot />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;