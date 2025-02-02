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
    return <div className="p-4 text-gray-500">Please select a user...</div>;
  }

  return (
    <div className="w-full bg-white rounded-lg">
      {/* Header Section */}
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-800">
          Investment Account Performance
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Annual overview of {selectedUser.name}'s TFSA and RRSP accounts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* TFSA Card */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-gray-800">TFSA Performance</h3>
              <p className="text-2xl font-bold text-[#144953]">
                ${selectedUser.TFSA_total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Current Balance</p>
              <p className="text-xs text-gray-500">
                Contributing: ${selectedUser.TFSA_contribution.toLocaleString()}/year
              </p>
            </div>
          </div>

          {/* RRSP Card */}
          <div className="bg-green-50 rounded-xl p-4">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-gray-800">RRSP Performance</h3>
              <p className="text-2xl font-bold text-green-600">
                ${selectedUser.RRSP_total.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Current Balance</p>
              <p className="text-xs text-gray-500">
                Contributing: ${selectedUser.RRSP_contribution.toLocaleString()}/year
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-4 sm:p-6 mt-4">
        <h3 className="text-base font-semibold text-gray-800 mb-4">
          Account Balance History
        </h3>
        <div className="w-full h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={{ stroke: '#e5e7eb' }}
                axisLine={{ stroke: '#e5e7eb' }}
                allowDuplicatedCategory={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickLine={{ stroke: '#e5e7eb' }}
                axisLine={{ stroke: '#e5e7eb' }}
                width={60}
                tickFormatter={(value) => `$${(value / 1000)}k`}
              />
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, 'Balance']}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  padding: '0.5rem'
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
              />
              <Line
                data={tfsaData}
                type="monotone"
                dataKey="value"
                name="TFSA"
                stroke="#144953"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#144953' }}
              />
              <Line
                data={rrspData}
                type="monotone"
                dataKey="value"
                name="RRSP"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats1;