import csv, random, datetime, os

# Output directory (make sure it exists)
output_dir = "dataSets"
os.makedirs(output_dir, exist_ok=True)

# Date range for September 2023
start_date = datetime.datetime(2025, 1, 1)
end_date = datetime.datetime(2025, 2, 2)
num_days = (end_date - start_date).days + 1

# Utility function: random time for a given day
def random_time_for_day(date):
    hour = random.randint(0, 23)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    return date.strftime("%Y-%m-%d") + f" {hour:02d}:{minute:02d}:{second:02d}"

# Function to generate a random expense amount based on a category hint
def generate_amount(category, profile):
    # Adjust ranges based on category and profile when needed
    if category == "Coffee":
        return round(random.uniform(3.5, 5.0), 2)
    elif category in ["Groceries"]:
        return round(random.uniform(20, 100), 2)
    elif category in ["Dining Out"]:
        return round(random.uniform(10, 40), 2)
    elif category in ["Utilities"]:
        return round(random.uniform(30, 70), 2)
    elif category in ["Rent", "Mortgage"]:
        # Student rent lower, corporate mortgage higher
        if profile == "Student":
            return 700.00
        elif profile == "Corporate Parent":
            return 1500.00
        elif profile == "Freelancer":
            return 900.00
    elif category in ["Transportation"]:
        return round(random.uniform(5, 30), 2)
    elif category in ["Entertainment"]:
        return round(random.uniform(10, 50), 2)
    elif category in ["Medical"]:
        return round(random.uniform(20, 150), 2)
    elif category in ["Gambling Loss"]:
        return round(random.uniform(20, 200), 2)
    elif category in ["Gambling Win"]:
        return round(random.uniform(300, 2000), 2)
    elif category in ["Child Expenses"]:
        return round(random.uniform(50, 250), 2)
    elif category in ["Vacation"]:
        return round(random.uniform(1000, 2000), 2)
    elif category in ["Books"]:
        return round(random.uniform(15, 60), 2)
    elif category in ["Online Subscription"]:
        return round(random.uniform(8, 20), 2)
    # default expense range
    return round(random.uniform(5, 100), 2)

# Define profile-specific parameters
profiles = [
    {
        "name": "Student",
        "file_name": "student.csv",
        "profile": "Student",
        "fixed_incomes": [
            # (date, description, amount)
            ("2025-01-01 09:00:00", "Scholarship", 500.00),
            ("2025-01-15 17:00:00", "Part-time Job", 300.00)
        ],
        "fixed_expenses": [
            ("2025-01-01 08:00:00", "Rent", 700.00, "Rent")
        ],
        "daily_habits": [
            ("07:30:00", "Starbucks",  "Coffee",  lambda: round(random.uniform(3.5, 5.0),2))
        ],
        "extra_expenses": ["Groceries", "Dining Out", "Utilities", "Books", "Transportation", "Online Subscription"]
    },
    {
        "name": "Corporate Parent",
        "file_name": "corporate_parent.csv",
        "profile": "Corporate Parent",
        "fixed_incomes": [
            ("2025-01-01 09:00:00", "Salary", 4000.00),
            ("2025-01-20 16:00:00", "Bonus", 500.00)
        ],
        "fixed_expenses": [
            ("2025-01-05 10:00:00", "Mortgage Payment", 1500.00, "Mortgage")
        ],
        "daily_habits": [
            ("07:30:00", "Starbucks",  "Coffee", lambda: round(random.uniform(3.5, 5.0),2))
        ],
        "extra_expenses": ["Groceries", "Dining Out", "Utilities", "Child Expenses", "Transportation", "Online Subscription"]
    },
    {
        "name": "Retired",
        "file_name": "retired.csv",
        "profile": "Retired",
        "fixed_incomes": [
            ("2025-01-01 09:00:00", "Pension", 2000.00)
        ],
        "fixed_expenses": [
            # Retired person has no housing payment but will have a vacation
            ("2025-01-20 12:00:00", "Vacation", 1500.00, "Vacation")
        ],
        "daily_habits": [
            ("09:00:00", "Local Diner",  "Coffee", lambda: round(random.uniform(3.0, 6.0),2))
        ],
        "extra_expenses": ["Groceries", "Dining Out", "Utilities", "Medical", "Transportation", "Online Subscription"]
    },
    {
        "name": "Gambler",
        "file_name": "gambler.csv",
        "profile": "Gambler",
        "fixed_incomes": [
            # Gambler wins occur randomly; add a few fixed wins for demonstration
            ("2025-01-07 20:00:00", "Casino Win", 1000.00),
            ("2025-01-21 22:00:00", "Casino Win", 1500.00)
        ],
        "fixed_expenses": [],
        "daily_habits": [
            ("07:30:00", "Starbucks", "Coffee", lambda: round(random.uniform(3.5, 5.0),2))
        ],
        "extra_expenses": ["Gambling Loss", "Dining Out", "Groceries", "Utilities", "Transportation"]
    },
    {
        "name": "Freelancer",
        "file_name": "freelancer.csv",
        "profile": "Freelancer",
        "fixed_incomes": [
            ("2025-01-07 12:00:00", "Freelance Payment", 800.00),
            ("2025-01-14 12:00:00", "Freelance Payment", 800.00),
            ("2025-01-21 12:00:00", "Freelance Payment", 800.00),
            ("2025-01-28 12:00:00", "Freelance Payment", 800.00)
        ],
        "fixed_expenses": [
            ("2025-01-01 08:00:00", "Rent", 900.00, "Rent")
        ],
        "daily_habits": [
            ("07:30:00", "Starbucks", "Coffee", lambda: round(random.uniform(3.5, 5.0),2))
        ],
        "extra_expenses": ["Groceries", "Dining Out", "Utilities", "Transportation", "Online Subscription", "Entertainment"]
    }
]

# Function to generate transactions for a given profile
def generate_transactions(profile_info):
    transactions = []

    # Add fixed income transactions (type Deposit)
    for dt_str, desc, amt in profile_info.get("fixed_incomes", []):
        transactions.append((dt_str, desc, amt, "Income", "Deposit"))
    
    # Add fixed expense transactions (type Expense)
    for dt_str, desc, amt, cat in profile_info.get("fixed_expenses", []):
        transactions.append((dt_str, desc, -amt, cat, "Expense"))
    
    # For each day of the month, add daily habits and random extra transactions.
    for day in range(num_days):
        current_date = start_date + datetime.timedelta(days=day)
        # Daily habit (e.g., coffee purchase)
        for habit_time, vendor, cat, amount_func in profile_info.get("daily_habits", []):
            dt_str = current_date.strftime("%Y-%m-%d") + " " + habit_time
            amt = amount_func()
            transactions.append((dt_str, vendor, -amt, cat, "Expense"))
        
        # Add random extra transactions: around 10 per day
        for _ in range(10):
            dt_str = random_time_for_day(current_date)
            # Randomly decide if it's an income (deposit) or expense; generally expenses are more common
            if random.random() < 0.1:
                # Random deposit from "Misc Income"
                amt = round(random.uniform(50, 300), 2)
                transactions.append((dt_str, "Misc Income", amt, "Income", "Deposit"))
            else:
                cat = random.choice(profile_info.get("extra_expenses", []))
                amt = generate_amount(cat, profile_info["profile"])
                transactions.append((dt_str, cat, -amt, cat, "Expense"))
    
    # Sort transactions by date/time (ISO format works well)
    transactions.sort(key=lambda x: x[0])
    return transactions

# For each profile, generate and write CSV file
for prof in profiles:
    trans = generate_transactions(prof)
    file_path = os.path.join(output_dir, prof["file_name"])
    with open(file_path, "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["time", "description", "amount", "category", "transaction_type"])
        for t in trans:
            writer.writerow(t)
    print(f"{prof['name']} file generated with {len(trans)} transactions at: {file_path}")
