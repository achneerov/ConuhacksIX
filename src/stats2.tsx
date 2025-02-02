import React from 'react';
import { Coffee, ShoppingCart, Utensils, Car, Bolt, Tv, Clock, Gamepad, CreditCard, Baby, Stethoscope } from 'lucide-react';
import { useUser } from './UserContext';
import { isMobile } from 'react-device-detect';

interface BaseRecommendation {
  category?: string;
  action: string;
  urgency?: string;
  type?: string;
}

interface SpendingRecommendation extends BaseRecommendation {
  current_spending: number | string;
  recommended_spending: number | string;
  potential_savings: number | string;
  message?: string;
}

interface TimingRecommendation extends BaseRecommendation {
  peak_spending_time?: string;
  peak_spending_day?: string;
  peak_hour?: string;
  peak_day?: string;
  suggestion: string;
}

interface Challenge {
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const Stats2 = () => {
  const { selectedUser } = useUser();

  // Icon mapping for different categories
  const getCategoryIcon = (category: string | undefined): React.ReactNode => {
    switch (category?.toLowerCase()) {
      case 'coffee':
        return <Coffee className="w-6 h-6 text-brown-600" />;
      case 'dining out':
        return <Utensils className="w-6 h-6 text-purple-600" />;
      case 'groceries':
        return <ShoppingCart className="w-6 h-6 text-green-600" />;
      case 'transportation':
        return <Car className="w-6 h-6 text-red-600" />;
      case 'utilities':
        return <Bolt className="w-6 h-6 text-yellow-600" />;
      case 'online subscription':
        return <Tv className="w-6 h-6 text-blue-600" />;
      case 'entertainment':
        return <Gamepad className="w-6 h-6 text-orange-600" />;
      case 'gambling loss':
        return <CreditCard className="w-6 h-6 text-red-600" />;
      case 'child expenses':
        return <Baby className="w-6 h-6 text-pink-600" />;
      case 'medical':
        return <Stethoscope className="w-6 h-6 text-blue-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const formatCurrency = (value: number | string): number => {
    return typeof value === 'string' ? parseFloat(value) : value;
  };

  // Determine challenge difficulty based on multiple factors
  const getDifficulty = (recommendation: SpendingRecommendation | TimingRecommendation): 'Easy' | 'Medium' | 'Hard' => {
    if (recommendation.type === 'timing' || recommendation.type === 'timing_optimization') {
      // Timing recommendations are generally easier
      return 'Easy';
    }

    const spendingRec = recommendation as SpendingRecommendation;
    const current = formatCurrency(spendingRec.current_spending);
    const recommended = formatCurrency(spendingRec.recommended_spending);
    const savings = formatCurrency(spendingRec.potential_savings);
    
    // Calculate reduction percentage
    const reductionPercentage = ((current - recommended) / current) * 100;

    // Determine difficulty based on multiple factors
    if (spendingRec.urgency === 'high') {
      if (reductionPercentage > 40) {
        return 'Hard';
      }
      return 'Medium';
    }

    if (spendingRec.category?.toLowerCase() === 'gambling loss' || 
        spendingRec.category?.toLowerCase() === 'medical') {
      return 'Hard';
    }

    if (reductionPercentage > 30) {
      return 'Hard';
    } else if (reductionPercentage > 15) {
      return 'Medium';
    }

    // Consider the absolute savings amount
    if (savings > 200) {
      return 'Medium';
    }

    return 'Easy';
  };

  // Transform recommendations into challenges
  const generateChallenges = (): Challenge[] => {
    if (!selectedUser?.money_saving_recommendations) return [];

    return selectedUser.money_saving_recommendations.map(rec => {
      // Handle timing recommendations
      if (rec.type === 'timing' || rec.type === 'timing_optimization') {
        const timingRec = rec as TimingRecommendation;
        return {
          icon: <Clock className="w-6 h-6 text-indigo-600" />,
          title: "Optimize Shopping Times",
          description: `${timingRec.suggestion} Peak spending occurs on ${timingRec.peak_day || timingRec.peak_spending_day} at ${timingRec.peak_hour || timingRec.peak_spending_time}.`,
          category: "Timing",
          difficulty: getDifficulty(timingRec)
        };
      }

      // Handle spending recommendations
      const spendingRec = rec as SpendingRecommendation;
      const current = formatCurrency(spendingRec.current_spending);
      const recommended = formatCurrency(spendingRec.recommended_spending);
      const savings = formatCurrency(spendingRec.potential_savings);

      return {
        icon: getCategoryIcon(spendingRec.category),
        title: `${spendingRec.category || 'General'} Optimization`,
        description: spendingRec.message || 
          `Reduce ${spendingRec.category?.toLowerCase() || 'general'} spending from $${current.toFixed(2)} to $${recommended.toFixed(2)}. Potential monthly savings: $${savings.toFixed(2)}`,
        category: spendingRec.category || 'General',
        difficulty: getDifficulty(spendingRec)
      };
    });
  };

  const challenges = generateChallenges();

  if(isMobile){
    return(
        <div className="flex flex-col h-full bg-white rounded-lg">
      <div className="">
        <h2 className="text-2xl font-serif bold text-gray-800">Personalized Money-Saving Challenges</h2>
        <p className="text-sm text-gray-600">
          Custom recommendations based on your spending patterns
        </p>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {challenges.map((challenge, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                {challenge.icon}
                <div className="flex items-center">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {challenge.difficulty}
                  </span>
                  <span className="text-xs font-medium text-gray-500">{challenge.category}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{challenge.title}</h3>
              <p className="text-sm text-gray-600">{challenge.description}</p>
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
        <h2 className="text-2xl font-serif bold text-gray-800">Personalized Money-Saving Challenges</h2>
        <p className="text-sm text-gray-600">
          Custom recommendations based on your spending patterns
        </p>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges.map((challenge, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                {challenge.icon}
                <div className="flex items-center">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {challenge.difficulty}
                  </span>
                  <span className="ml-2 text-xs font-medium text-gray-500">{challenge.category}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{challenge.title}</h3>
              <p className="text-sm text-gray-600">{challenge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats2;