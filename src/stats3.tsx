import { Clock, PiggyBank, TrendingUp, Shield, Briefcase, BarChart, ExternalLink } from 'lucide-react';
import { useUser } from './UserContext';

type IconKey = 'insurance' | 'investment' | 'planning' | 'education' | 'savings' | 'time';

interface Tip {
  icon: JSX.Element;
  title: string;
  description: string;
  category: string;
  url?: string;
}

const Stats3 = () => {
  const { selectedUser } = useUser();

  const icons: Record<IconKey, JSX.Element> = {
    insurance: <Shield className="w-6 h-6 text-red-600" />,
    investment: <TrendingUp className="w-6 h-6 text-purple-600" />,
    planning: <Briefcase className="w-6 h-6 text-orange-600" />,
    education: <BarChart className="w-6 h-6 text-indigo-600" />,
    savings: <PiggyBank className="w-6 h-6 text-green-600" />,
    time: <Clock className="w-6 h-6 text-blue-600" />
  };

  const iconKeys: IconKey[] = ['insurance', 'investment', 'planning', 'education', 'savings', 'time'];

  // Transform SunLife links into tip format
  const sunLifeTips: Tip[] = selectedUser?.SuggestedSunLifeLinks.map(([title, description, url], index) => ({
    icon: icons[iconKeys[index % iconKeys.length]],
    title,
    description,
    category: "SunLife Resource",
    url
  })) || [];

  // Create spending tips based on user's recommendations
  const spendingTips: Tip[] = selectedUser?.money_saving_recommendations
    .filter(rec => rec.type === "spending_alert")
    .map(rec => ({
      icon: <PiggyBank className="w-6 h-6 text-green-600" />,
      title: `Optimize ${rec.category} Spending`,
      description: `Your spending in ${rec.category} is ${rec.potential_savings} above recommended budget. ${rec.action}. Potential savings: $${rec.potential_savings}`,
      category: "Spending Optimization"
    })) || [];

  // Combine all tips
  const allTips = [...sunLifeTips, ...spendingTips];

  const timingOptimizations = selectedUser?.money_saving_recommendations
    .filter(rec => rec.type === "timing_optimization")
    .map(rec => ({
      message: rec.suggestion || '',
      suggestion: rec.suggestion || ''
    }));

  return (
    <div className="flex flex-col h-full bg-white rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif bold text-gray-800">Personalized Financial Tips</h2>
        <p className="text-sm text-gray-600">
          Customized recommendations based on your profile and spending patterns
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allTips.map((tip, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                {tip.icon}
                <span className="ml-2 text-xs font-medium text-gray-500">{tip.category}</span>
                {tip.url && (
                  <a 
                    href={tip.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-600">{tip.description}</p>
            </div>
          ))}
        </div>
        
        {timingOptimizations?.map((optimization, index) => (
          <div key={index} className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-base font-semibold text-gray-800 mb-2">Timing Optimization</h3>
            <p className="text-sm text-gray-600">
              {optimization.message}. {optimization.suggestion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats3;
