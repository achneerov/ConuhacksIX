interface FinancialMetrics {
    age: number;
    savingsToIncomeRatio: number;
    investmentGrowthRate: number;
    monthlyContributionRate: number;
    spendingPressure: number;
    riskProfile: number;
    lifestageScore: number;
  }
  
  interface SpendingCategory {
    category: string;
    currentSpending: number;
    recommendedSpending: number;
    potentialSavings: number;
    urgency: string;
  }
  
  interface Recommendation {
    title: string;
    description: string;
    url: string;
    weight: number;
    tags: string[];
    lifestageRange: [number, number];
    spendingTriggers: string[];
    savingsThresholds: [number, number];
  }
  
  class FinancialRecommendationEngine {
    private readonly recommendationDatabase: Recommendation[] = [
      {
        title: "Managing Your Money Blog",
        description: "Expert insights and practical tips on budgeting, saving, investing, and making smart financial decisions for your future",
        url: "https://www.sunlife.ca/en/tools-and-resources/money-and-finances/managing-your-money/",
        weight: 1.0,
        tags: ['budgeting', 'saving', 'investing', 'basics'],
        lifestageRange: [18, 35],
        spendingTriggers: ['Groceries', 'Transportation', 'Online Subscription'],
        savingsThresholds: [0, 0.3]
      },
      {
        title: "Registered Investment & Retirement Plans",
        description: "Detailed information about various investment and retirement planning options to help secure your financial future",
        url: "https://www.sunlife.ca/en/investments/",
        weight: 0.8,
        tags: ['investment', 'retirement', 'planning'],
        lifestageRange: [25, 45],
        spendingTriggers: [],
        savingsThresholds: [0.2, 1.0]
      },
      {
        title: "Life Insurance Calculator",
        description: "An interactive tool to help determine the right amount of life insurance coverage based on your personal circumstances and financial goals",
        url: "https://www.sunlife.ca/en/tools-and-resources/tools-and-calculators/life-insurance-calculator/",
        weight: 0.9,
        tags: ['insurance', 'protection', 'family'],
        lifestageRange: [25, 55],
        spendingTriggers: ['Child Expenses', 'Medical'],
        savingsThresholds: [0.1, 1.0]
      },
      {
        title: "Insurance Solutions",
        description: "Comprehensive overview of insurance products and services to protect you and your loved ones financially",
        url: "https://www.sunlife.ca/en/insurance/",
        weight: 0.85,
        tags: ['insurance', 'protection', 'security'],
        lifestageRange: [30, 70],
        spendingTriggers: ['Medical', 'Child Expenses'],
        savingsThresholds: [0.2, 1.0]
      },
      {
        title: "About Sun Life",
        description: "Learn about Sun Life's history, values, and commitment to helping people achieve lifetime financial security and live healthier lives",
        url: "https://www.sunlife.ca/en/about-us/who-we-are/",
        weight: 0.5,
        tags: ['trust', 'information', 'general'],
        lifestageRange: [18, 100],
        spendingTriggers: [],
        savingsThresholds: [0, 1.0]
      }
    ];
  
    calculateFinancialMetrics(userData: any): FinancialMetrics {
      const totalSavings = userData.RRSP_total + userData.TFSA_total;
      const totalContributions = userData.TFSA_contribution + userData.RRSP_contribution;
      
      // Calculate investment growth rate
      const calculateGrowthRate = (prices: Record<string, number>): number => {
        const years = Object.keys(prices).map(Number);
        if (years.length < 2) return 0;
        const firstYear = Math.min(...years);
        const lastYear = Math.max(...years);
        const yearDiff = lastYear - firstYear;
        return Math.pow(prices[lastYear] / prices[firstYear], 1/yearDiff) - 1;
      };
  
      const rrspGrowth = calculateGrowthRate(userData.RRSP_prices);
      const tfsaGrowth = calculateGrowthRate(userData.TFSA_prices);
  
      // Calculate spending pressure
      const totalPotentialSavings = userData.money_saving_recommendations.reduce(
        (sum: number, rec: SpendingCategory) => sum + rec.potentialSavings,
        0
      );
  
      return {
        age: userData.age,
        savingsToIncomeRatio: totalSavings / userData.salary,
        investmentGrowthRate: (rrspGrowth + tfsaGrowth) / 2,
        monthlyContributionRate: (totalContributions * 12) / userData.salary,
        spendingPressure: totalPotentialSavings / (userData.salary / 12),
        riskProfile: Math.max(0, Math.min(1, (70 - userData.age) / 40)),
        lifestageScore: userData.age / 100
      };
    }
  
    calculateRecommendationScore(
      recommendation: Recommendation,
      metrics: FinancialMetrics,
      spendingCategories: SpendingCategory[]
    ): number {
      let score = recommendation.weight;
  
      // Age/Lifestage alignment
      const ageMatch = metrics.age >= recommendation.lifestageRange[0] && 
                      metrics.age <= recommendation.lifestageRange[1];
      score *= ageMatch ? 1.2 : 0.5;
  
      // Savings threshold alignment
      const savingsMatch = metrics.savingsToIncomeRatio >= recommendation.savingsThresholds[0] &&
                          metrics.savingsToIncomeRatio <= recommendation.savingsThresholds[1];
      score *= savingsMatch ? 1.1 : 0.7;
  
      // Spending trigger alignment
      const hasRelevantSpendingTriggers = spendingCategories.some(
        category => recommendation.spendingTriggers.includes(category.category)
      );
      if (recommendation.spendingTriggers.length > 0) {
        score *= hasRelevantSpendingTriggers ? 1.3 : 0.6;
      }
  
      // Risk profile considerations
      if (recommendation.tags.includes('investment')) {
        score *= metrics.riskProfile > 0.7 ? 1.2 : 0.8;
      }
  
      // Spending pressure considerations
      if (recommendation.tags.includes('budgeting') && metrics.spendingPressure > 0.1) {
        score *= 1.4;
      }
  
      return score;
    }
  
    getRecommendations(userData: any): [string, string, string][] {
      const metrics = this.calculateFinancialMetrics(userData);
      
      // Score all recommendations
      const scoredRecommendations = this.recommendationDatabase
        .map(recommendation => ({
          recommendation,
          score: this.calculateRecommendationScore(
            recommendation,
            metrics,
            userData.money_saving_recommendations
          )
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
  
      // Format recommendations as required
      return scoredRecommendations.map(({ recommendation }) => [
        recommendation.title,
        recommendation.description,
        recommendation.url
      ]);
    }
  }
  
  export const recommendationEngine = new FinancialRecommendationEngine();