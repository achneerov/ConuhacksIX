import { Clock, PiggyBank, TrendingUp, Shield, Briefcase, BarChart } from 'lucide-react';

const Stats3 = () => {
  const tips = [
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "Start Early",
      description: "Take advantage of compound interest by starting your investment journey as early as possible. Time in the market beats timing the market.",
      category: "Fundamental"
    },
    {
      icon: <PiggyBank className="w-6 h-6 text-green-600" />,
      title: "Diversification",
      description: "Spread investments across different asset classes, sectors, and geographical regions to reduce risk and optimize returns.",
      category: "Risk Management"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
      title: "Regular Contributions",
      description: "Set up automatic monthly contributions to benefit from dollar-cost averaging and maintain consistent investment habits.",
      category: "Strategy"
    },
    {
      icon: <Shield className="w-6 h-6 text-red-600" />,
      title: "Emergency Fund",
      description: "Maintain 3-6 months of living expenses in easily accessible savings before making long-term investments.",
      category: "Safety"
    },
    {
      icon: <Briefcase className="w-6 h-6 text-orange-600" />,
      title: "Tax-Advantaged Accounts",
      description: "Maximize contributions to tax-advantaged accounts like RRSPs and TFSAs before investing in taxable accounts.",
      category: "Tax Strategy"
    },
    {
      icon: <BarChart className="w-6 h-6 text-indigo-600" />,
      title: "Rebalancing",
      description: "Review and rebalance your portfolio annually to maintain your target asset allocation and risk level.",
      category: "Maintenance"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif bold text-gray-800">Smart Investment Tips</h2>
        <p className="text-sm text-gray-600">Essential strategies for long-term financial success</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tips.map((tip, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2">
                {tip.icon}
                <span className="ml-2 text-xs font-medium text-gray-500">{tip.category}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-600">{tip.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-base font-semibold text-gray-800 mb-2">Pro Tip</h3>
          <p className="text-sm text-gray-600">
            Consider consulting with a financial advisor to create a personalized investment strategy
            that aligns with your goals, risk tolerance, and time horizon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stats3;