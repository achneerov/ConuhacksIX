import { Coffee, ShoppingCart, Utensils, Car, Gamepad, CreditCard } from 'lucide-react';

const Stats2 = () => {
  const challenges = [
    {
      icon: <Coffee className="w-6 h-6 text-brown-600" />,
      title: "Coffee Budget",
      description: "Limit cafe-bought coffee to maximum twice per week. Make coffee at home other days. Potential monthly savings: $60",
      category: "Daily Habits",
      difficulty: "Easy"
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-green-600" />,
      title: "No-Spend Days",
      description: "Complete 2 no-spend days each week (excluding bills and groceries). Track your success for a month.",
      category: "Spending Control",
      difficulty: "Medium"
    },
    {
      icon: <Utensils className="w-6 h-6 text-purple-600" />,
      title: "Meal Prep Master",
      description: "Bring lunch to work 4 days per week instead of buying. Target monthly savings: $200",
      category: "Food & Dining",
      difficulty: "Medium"
    },
    {
      icon: <Car className="w-6 h-6 text-red-600" />,
      title: "Transportation Challenge",
      description: "Use public transit or bike twice a week instead of driving. Save on gas and parking fees.",
      category: "Transportation",
      difficulty: "Hard"
    },
    {
      icon: <Gamepad className="w-6 h-6 text-orange-600" />,
      title: "Entertainment Budget",
      description: "Limit entertainment spending to $100 per month. Find free or low-cost alternatives.",
      category: "Lifestyle",
      difficulty: "Medium"
    },
    {
      icon: <CreditCard className="w-6 h-6 text-indigo-600" />,
      title: "Cash Only Week",
      description: "Use only cash for discretionary spending one week per month to better track expenses.",
      category: "Budgeting",
      difficulty: "Hard"
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg p-6 overflow-hidden">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Money-Saving Challenges</h2>
        <p className="text-sm text-gray-600">Take on these challenges to build better financial habits</p>
      </div>
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
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-base font-semibold text-gray-800 mb-2">Challenge Tips</h3>
        <p className="text-sm text-gray-600">
          Start with one easy challenge and gradually add more as you build confidence. Track your progress daily and celebrate small wins.
          Try to complete at least one challenge each month to build lasting financial habits.
        </p>
      </div>
    </div>
  );
};

export default Stats2;