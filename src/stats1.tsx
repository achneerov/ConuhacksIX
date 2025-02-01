import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Stats1 = () => {
  const tfsaData = [
    { month: 'Jan', value: 25000 },
    { month: 'Feb', value: 25800 },
    { month: 'Mar', value: 26200 },
    { month: 'Apr', value: 25900 },
    { month: 'May', value: 27000 },
    { month: 'Jun', value: 28500 },
    { month: 'Jul', value: 29200 },
    { month: 'Aug', value: 29800 },
    { month: 'Sep', value: 30500 },
    { month: 'Oct', value: 31200 },
    { month: 'Nov', value: 32000 },
    { month: 'Dec', value: 33500 },
  ];

  const rrspData = [
    { month: 'Jan', value: 45000 },
    { month: 'Feb', value: 46200 },
    { month: 'Mar', value: 47500 },
    { month: 'Apr', value: 46800 },
    { month: 'May', value: 48000 },
    { month: 'Jun', value: 49500 },
    { month: 'Jul', value: 51000 },
    { month: 'Aug', value: 52500 },
    { month: 'Sep', value: 54000 },
    { month: 'Oct', value: 55500 },
    { month: 'Nov', value: 57000 },
    { month: 'Dec', value: 59000 },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Investment Account Performance</h2>
        <p className="text-sm text-gray-600">Annual overview of your TFSA and RRSP accounts</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h3 className="text-base font-semibold mb-1">TFSA Performance</h3>
          <p className="text-2xl font-bold text-blue-600">${tfsaData[tfsaData.length - 1].value.toLocaleString()}</p>
          <p className="text-xs text-gray-600">Current Balance</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <h3 className="text-base font-semibold mb-1">RRSP Performance</h3>
          <p className="text-2xl font-bold text-green-600">${rrspData[rrspData.length - 1].value.toLocaleString()}</p>
          <p className="text-xs text-gray-600">Current Balance</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <h3 className="text-base font-semibold mb-2">Account Balance History</h3>
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" allowDuplicatedCategory={false} />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line 
                data={tfsaData} 
                type="monotone" 
                dataKey="value" 
                name="TFSA" 
                stroke="#3B82F6" 
                strokeWidth={2}
              />
              <Line 
                data={rrspData} 
                type="monotone" 
                dataKey="value" 
                name="RRSP" 
                stroke="#10B981" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats1;