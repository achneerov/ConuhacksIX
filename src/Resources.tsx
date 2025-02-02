import React from 'react';
import { BookOpen, Calculator, PiggyBank, LineChart, Shield, Building2 } from 'lucide-react';
import { isMobile } from 'react-device-detect';

const Resources: React.FC = () => {
  const resources = [
    {
      title: 'Financial Literacy Terms',
      description: 'Master 20 must-know terms to enhance your understanding of personal finance and investments.',
      link: 'https://www.sunlife.ca/en/tools-and-resources/money-and-finances/investing-basics/must-know-terms-to-boost-your-financial-literacy/',
      icon: BookOpen
    },
    {
      title: 'Life Insurance Calculator',
      description: 'Calculate your life insurance needs with our interactive tool to ensure proper coverage for you and your family.',
      link: 'https://www.sunlife.ca/en/tools-and-resources/tools-and-calculators/life-insurance-calculator/',
      icon: Calculator
    },
    {
      title: 'Money Management Blog',
      description: 'Expert insights and practical tips for managing your money effectively and achieving your financial goals.',
      link: 'https://www.sunlife.ca/en/tools-and-resources/money-and-finances/managing-your-money/',
      icon: PiggyBank
    },
    {
      title: 'Investment & Retirement',
      description: 'Explore registered investment and retirement plans to secure your financial future.',
      link: 'https://www.sunlife.ca/en/investments/',
      icon: LineChart
    },
    {
      title: 'Insurance Solutions',
      description: 'Comprehensive insurance options to protect what matters most to you and your loved ones.',
      link: 'https://www.sunlife.ca/en/insurance/',
      icon: Shield
    },
    {
      title: 'About Sun Life',
      description: 'Learn about our mission, values, and commitment to helping Canadians achieve lifetime financial security.',
      link: 'https://www.sunlife.ca/en/about-us/who-we-are/',
      icon: Building2
    }
  ];

  if(isMobile){
    return(
      <div className="flex flex-col w-full h-full">
      <div className="grid md:grid-cols-2 flex-1 min-h-0 overflow-y-auto max-w-4xl mx-auto overflow-x-hidden">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.link}
            className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <resource.icon className="w-6 h-6 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors mb-2">
                  {resource.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {resource.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-yellow-600 group-hover:text-yellow-700">
                  Learn More
                  <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Directory</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.link}
            className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <resource.icon className="w-6 h-6 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors mb-2">
                  {resource.title}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {resource.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-yellow-600 group-hover:text-yellow-700">
                  Learn More
                  <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Resources;