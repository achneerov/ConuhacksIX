import React from 'react';
import Stats1 from './stats1';
import Stats2 from './stats2';
import Stats3 from './stats3';
import Chatbot from './chatbot';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full gap-4">
      {/* Grid container that switches from 1 column on mobile to 2 columns on md screens */}
      <div className="grid md:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="overflow-hidden rounded-lg p-4 bg-[#fff8e0]">
          <div className="h-full overflow-auto">
            <Stats1 />
          </div>
        </div>
        <div className="overflow-hidden rounded-lg p-4 bg-[#fff8e0]">
          <div className="h-full overflow-auto">
            <Stats2 />
          </div>
        </div>
        <div className="overflow-hidden rounded-lg p-4 bg-[#fff8e0]">
          <div className="h-full overflow-auto">
            <Stats3 />
          </div>
        </div>
        <div className="overflow-hidden rounded-lg p-4 bg-[#fff8e0]">
          <div className="h-full overflow-auto">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;