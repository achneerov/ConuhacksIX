import { Shield, TrendingUp, PiggyBank, ExternalLink } from 'lucide-react';
import { useUser } from './UserContext';
import { isMobile } from 'react-device-detect';

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

  if(isMobile){
    return(
      <div className="">
      <div className="mb-6">
        <h2 className="text-2xl font-serif bold text-gray-800 text-center pr-5 mt-6">Sun Life Resources</h2>
        <p className="text-sm text-gray-600 pr-5">
          Recommended financial resources tailored for you
        </p>
      </div>
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-4">
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
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-serif bold text-gray-800">Sun Life Resources</h2>
        <p className="text-sm text-gray-600">
          Recommended financial resources tailored for you
        </p>
      </div>
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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