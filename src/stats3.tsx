import { Shield, TrendingUp, PiggyBank, ExternalLink, BookOpen, Calculator } from 'lucide-react';
import { useUser } from './UserContext';
import { isMobile } from 'react-device-detect';
import { recommendationEngine } from './recommendationEngine';
import { useMemo } from 'react';

type IconKey = 'insurance' | 'investment' | 'savings' | 'education' | 'calculator' | 'general';

interface Tip {
  icon: JSX.Element;
  title: string;
  description: string;
  url?: string;
  priority?: 'high' | 'medium' | 'low';
}

const Stats3 = () => {
  const { selectedUser } = useUser();

  const icons: Record<IconKey, JSX.Element> = {
    insurance: <Shield className="w-6 h-6 text-red-600" />,
    investment: <TrendingUp className="w-6 h-6 text-purple-600" />,
    savings: <PiggyBank className="w-6 h-6 text-green-600" />,
    education: <BookOpen className="w-6 h-6 text-blue-600" />,
    calculator: <Calculator className="w-6 h-6 text-yellow-600" />,
    general: <Shield className="w-6 h-6 text-gray-600" />
  };

  // Map recommendation titles to icon types
  const getIconForTitle = (title: string): IconKey => {
    if (title.toLowerCase().includes('insurance')) return 'insurance';
    if (title.toLowerCase().includes('investment')) return 'investment';
    if (title.toLowerCase().includes('money')) return 'savings';
    if (title.toLowerCase().includes('calculator')) return 'calculator';
    if (title.toLowerCase().includes('blog')) return 'education';
    return 'general';
  };

  // Generate recommendations using the ML engine
  const sunLifeTips: Tip[] = useMemo(() => {
    if (!selectedUser) return [];

    // Get recommendations from the engine
    const recommendations = recommendationEngine.getRecommendations(selectedUser);
    
    // Calculate financial metrics for priority determination
    const metrics = recommendationEngine.calculateFinancialMetrics(selectedUser);

    return recommendations.map(([title, description, url]) => {
      // Determine priority based on relevance to user's situation
      let priority: 'high' | 'medium' | 'low' = 'medium';
      
      if (title.toLowerCase().includes('money') && metrics.spendingPressure > 0.1) {
        priority = 'high';
      } else if (title.toLowerCase().includes('investment') && metrics.savingsToIncomeRatio > 0.3) {
        priority = 'high';
      } else if (title.toLowerCase().includes('insurance') && metrics.age > 25) {
        priority = 'high';
      }

      return {
        icon: icons[getIconForTitle(title)],
        title,
        description,
        url,
        priority
      };
    });
  }, [selectedUser]);

  const content = (
    <>
      <div className="mb-6">
        <h2 className={`text-2xl font-serif bold text-gray-800 ${isMobile ? 'text-center pr-5 mt-6' : ''}`}>
          Sun Life Resources
        </h2>
        <p className={`text-sm text-gray-600 ${isMobile ? 'pr-5' : ''}`}>
          AI-powered recommendations tailored for your financial journey
        </p>
      </div>
      <div className="flex-1">
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${isMobile ? 'pr-4' : ''}`}>
          {sunLifeTips.map((tip, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg hover:shadow-md transition-shadow ${
                tip.priority === 'high' 
                  ? 'bg-yellow-50 border border-yellow-100'
                  : tip.priority === 'medium'
                  ? 'bg-gray-50'
                  : 'bg-gray-50 opacity-90'
              }`}
            >
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
              {tip.priority === 'high' && (
                <div className="mt-2 text-xs text-yellow-600 font-medium">
                  ★ Highly Relevant for Your Profile
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return <div className="">{content}</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg p-6">
      {content}
    </div>
  );
};

export default Stats3;