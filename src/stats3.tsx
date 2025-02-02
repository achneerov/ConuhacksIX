import { Shield, TrendingUp, PiggyBank, ExternalLink } from 'lucide-react';
import { useUser } from './UserContext';

type IconKey = 'insurance' | 'investment' | 'savings';

interface Tip {
  icon: JSX.Element;
  title: string;
  description: string;
  url?: string;
}

const Stats3 = () => {
  const { selectedUser } = useUser();
  
  const icons: Record<IconKey, JSX.Element> = {
    insurance: <Shield className="w-6 h-6 text-red-600" />,
    investment: <TrendingUp className="w-6 h-6 text-purple-600" />,
    savings: <PiggyBank className="w-6 h-6 text-green-600" />
  };
  
  const iconKeys: IconKey[] = ['insurance', 'investment', 'savings'];
  
  // Transform SunLife links into tip format
  const sunLifeTips: Tip[] = selectedUser?.SuggestedSunLifeLinks.slice(0, 3).map(([title, description, url], index) => ({
    icon: icons[iconKeys[index]],
    title,
    description,
    url
  })) || [];

  return (
    <div className="bg-white rounded-lg">
      <div className="p-6">
        <h2 className="text-xl font-serif bold text-gray-800">Sun Life Resources</h2>
        <p className="text-sm text-gray-600 mb-6">
          Recommended financial resources tailored for you
        </p>
        
        <div className="grid grid-cols-1 gap-4">
          {sunLifeTips.map((tip, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                {tip.icon}
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
      </div>
    </div>
  );
};

export default Stats3;