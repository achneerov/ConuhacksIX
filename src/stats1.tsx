import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useUser } from './UserContext';

const Stats1 = () => {
  const { selectedUser } = useUser();
  
  const tfsaData = useMemo(() => {
    if (!selectedUser) return [];
    return Object.entries(selectedUser.TFSA_prices).map(([month, value]) => ({
      month,
      value
    }));
  }, [selectedUser]);

  const rrspData = useMemo(() => {
    if (!selectedUser) return [];
    return Object.entries(selectedUser.RRSP_prices).map(([month, value]) => ({
      month,
      value
    }));
  }, [selectedUser]);

  if (!selectedUser) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden">
      <div className="mb-4">
        <h2 className="text-xl font-serif bold text-gray-850">Investment Account Performance</h2>
        <p className="text-sm text-gray-600">Annual overview of {selectedUser.name}'s TFSA and RRSP accounts</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <h3 className="text-base font-semibold mb-1">TFSA Performance</h3>
          <p className="text-2xl font-bold" style={{ color: '#144953' }}>
            ${selectedUser.TFSA_total.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600">Current Balance</p>
          <p className="text-xs text-gray-500">
            Contributing: ${selectedUser.TFSA_contribution.toLocaleString()}/year
          </p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <h3 className="text-base font-semibold mb-1">RRSP Performance</h3>
          <p className="text-2xl font-bold text-green-600">
            ${selectedUser.RRSP_total.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600">Current Balance</p>
          <p className="text-xs text-gray-500">
            Contributing: ${selectedUser.RRSP_contribution.toLocaleString()}/year
          </p>
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
                stroke="#144953"
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