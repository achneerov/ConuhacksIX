import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from datetime import datetime

class BudgetAnalyzer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = KMeans(n_clusters=5, random_state=42)
        
    def preprocess_data(self, transactions):
        """
        Preprocess transaction data for analysis.
        
        Parameters:
        transactions: DataFrame with columns ['time_of_purchase', 'company', 'amount', 
                                           'category', 'transaction_type']
        """
        df = transactions.copy()
        df['time'] = pd.to_datetime(df['time'])
        df['month'] = df['time'].dt.to_period('M')
        
        self.expenses = df[df['transaction_type'] == 'Expense'].copy()
        self.income = df[df['transaction_type'] == 'Deposit'].copy()
        
        self.expenses['amount'] = self.expenses['amount'].abs()
        
        monthly_spending = self.expenses.pivot_table(
            index='month',
            columns='category',
            values='amount',
            aggfunc='sum',
            fill_value=0
        )
        
        return monthly_spending
    
    def analyze_income(self):
        """Analyze income patterns."""
        if hasattr(self, 'income'):
            monthly_income = self.income.groupby(
                self.income['time'].dt.to_period('M')
            )['amount'].sum()
            
            return {
                'average_monthly_income': float(monthly_income.mean()),
                'income_stability': float(monthly_income.std() / monthly_income.mean()),
                'income_trend': float(monthly_income.pct_change().mean())
            }
        return None

    def analyze_spending_patterns(self):
        """Analyze temporal spending patterns."""
        if hasattr(self, 'expenses'):
            self.expenses['hour'] = self.expenses['time'].dt.hour
            self.expenses['day_of_week'] = self.expenses['time'].dt.day_name()
            
            hourly_patterns = self.expenses.groupby('hour')['amount'].mean()
            daily_patterns = self.expenses.groupby('day_of_week')['amount'].mean()
            
            return {
                'peak_spending_hour': int(hourly_patterns.idxmax()),
                'peak_spending_day': str(daily_patterns.idxmax()),
                'hourly_patterns': hourly_patterns.to_dict(),
                'daily_patterns': daily_patterns.to_dict()
            }
        return None

    def fit(self, transactions):
        monthly_spending = self.preprocess_data(transactions)
        scaled_data = self.scaler.fit_transform(monthly_spending)
        self.model.fit(scaled_data)
        self.categories = monthly_spending.columns
        self.cluster_centers = self.scaler.inverse_transform(self.model.cluster_centers_)
        
    def generate_budget(self, transactions):
        monthly_spending = self.preprocess_data(transactions)
        scaled_data = self.scaler.transform(monthly_spending)
        latest_cluster = self.model.predict(scaled_data[-1:])
        ideal_spending = self.cluster_centers[latest_cluster[0]]
        budget = pd.Series(ideal_spending, index=self.categories)
        
        income_analysis = self.analyze_income()
        if income_analysis:
            total_budget = budget.sum()
            if total_budget > income_analysis['average_monthly_income'] * 0.9:
                budget = budget * (income_analysis['average_monthly_income'] * 0.9 / total_budget)
        
        return budget.to_dict()
    
    def generate_recommendations(self, transactions):
        """Generate JSON-compatible recommendations with string values."""
        monthly_spending = self.preprocess_data(transactions)
        current_spending = monthly_spending.iloc[-1]
        recommended_budget = pd.Series(self.generate_budget(transactions))
        spending_patterns = self.analyze_spending_patterns()
        income_analysis = self.analyze_income()
        
        recommendations = []
        
        # Budget recommendations
        for category in self.categories:
            current = float(current_spending[category])
            recommended = float(recommended_budget[category])
            diff = current - recommended
            
            if diff > recommended * 0.1:
                recommendations.append({
                    "type": "spending_alert",
                    "category": str(category),
                    "message": f"Your spending in {category} is {diff:.2f} above recommended budget",
                    "action": "Consider reducing spending in this category",
                    "current_spending": str(f"{current:.2f}"),
                    "recommended_spending": str(f"{recommended:.2f}"),
                    "potential_savings": str(f"{diff:.2f}"),
                    "urgency": "high" if diff > recommended * 0.25 else "medium"
                })
            elif diff < -recommended * 0.2:
                recommendations.append({
                    "type": "spending_notification",
                    "category": str(category),
                    "message": f"Your spending in {category} is significantly under budget",
                    "action": "Monitor this category for potential delayed expenses",
                    "current_spending": str(f"{current:.2f}"),
                    "recommended_spending": str(f"{recommended:.2f}"),
                    "available_budget": str(f"{-diff:.2f}")
                })
        
        # Income-based recommendations
        if income_analysis:
            if income_analysis['income_stability'] > 0.2:
                recommendations.append({
                    "type": "income_alert",
                    "category": "emergency_fund",
                    "message": "Your income shows significant variability",
                    "action": "Consider building an emergency fund of 3-6 months of expenses",
                    "reason": "High income variability detected",
                    "variability_score": str(f"{income_analysis['income_stability']:.2f}")
                })
        
        # Timing-based recommendations
        if spending_patterns:
            recommendations.append({
                "type": "timing_optimization",
                "category": "spending_pattern",
                "message": f"Peak spending detected on {spending_patterns['peak_spending_day']} at {spending_patterns['peak_spending_hour']}:00",
                "action": "Consider rescheduling non-essential purchases to off-peak times",
                "peak_hour": str(spending_patterns['peak_spending_hour']),
                "peak_day": str(spending_patterns['peak_spending_day']),
                "suggestion": "Spreading purchases across the week may help with budgeting"
            })
        
        return recommendations