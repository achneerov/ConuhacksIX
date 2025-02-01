import csv, random, datetime, os, math

# Output directory
output_dir = "dataSets"
os.makedirs(output_dir, exist_ok=True)

# Ask user for total transactions to generate per profile
target_transactions = 100000
daily_target = 50
num_days = math.ceil(target_transactions / daily_target)
start_date = datetime.datetime(2023, 1, 1)

# Utility function: random time in a given day
def random_time_for_day(date):
    hour = random.randint(0, 23)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    return date.strftime("%Y-%m-%d") + f" {hour:02d}:{minute:02d}:{second:02d}"

# Generate an amount based on the category and profile type when needed.
def generate_amount(category, profile):
    if category == "Coffee":
        return round(random.uniform(3.5, 5.0), 2)
    elif category == "Groceries":
        return round(random.uniform(20, 100), 2)
    elif category == "Dining Out":
        return round(random.uniform(10, 40), 2)
    elif category == "Utilities":
        return round(random.uniform(30, 70), 2)
    elif category in ["Rent", "Mortgage"]:
        if profile == "Student":
            return 700.00
        elif profile == "Corporate Parent":
            return 1500.00
        elif profile == "Freelancer":
            return 900.00
    elif category == "Transportation":
        return round(random.uniform(5, 30), 2)
    elif category == "Entertainment":
        return round(random.uniform(10, 50), 2)
    elif category == "Medical":
        return round(random.uniform(20, 150), 2)
    elif category == "Gambling Loss":
        return round(random.uniform(20, 200), 2)
    elif category == "Gambling Win":
        return round(random.uniform(300, 2000), 2)
    elif category == "Child Expenses":
        return round(random.uniform(50, 250), 2)
    elif category == "Vacation":
        return round(random.uniform(1000, 2000), 2)
    elif category == "Books":
        return round(random.uniform(15, 60), 2)
    elif category == "Online Subscription":
        return round(random.uniform(8, 20), 2)
    return round(random.uniform(5, 100), 2)

# Define five profiles. Fixed transactions use day offsets relative to start_date.
profiles = [
    {
        "name": "Student",
        "file_name": "student.csv",
        "profile": "Student",
        # (day_offset, time, description, amount, category, type)
        "fixed_transactions": [
            (1, "09:00:00", "Scholarship", 500.00, "Income", "Deposit"),
            (15, "17:00:00", "Part-time Job", 300.00, "Income", "Deposit"),
            (1, "08:00:00", "Rent", 700.00, "Rent", "Expense")
        ],
        "daily_habits": [
            # (time, vendor, category, lambda to generate amount)
            ("07:30:00", "Starbucks", "Coffee", lambda: round(random.uniform(3.5, 5.0),2))
        ],
        "extra_categories": ["Groceries", "Dining Out", "Utilities", "Books", "Transportation", "Online Subscription"]
    },
    {
        "name": "Corporate Parent",
        "file_name": "corporate_parent.csv",
        "profile": "Corporate Parent",
        "fixed_transactions": [
            (1, "09:00:00", "Salary", 4000.00, "Income", "Deposit"),
            (20, "16:00:00", "Bonus", 500.00, "Income", "Deposit"),
            (5, "10:00:00", "Mortgage Payment", 1500.00, "Mortgage", "Expense")
        ],
        "daily_habits": [
            ("07:30:00", "Starbucks", "Coffee", lambda: round(random.uniform(3.5, 5.0),2))
        ],
        "extra_categories": ["Groceries", "Dining Out", "Utilities", "Child Expenses", "Transportation", "Online Subscription"]
    },
    {
        "name": "Retired",
        "file_name": "retired.csv",
        "profile": "Retired",
        "fixed_transactions": [
            (1, "09:00:00", "Pension", 2000.00, "Income", "Deposit"),
            (20, "12:00:00", "Vacation", 1500.00, "Vacation", "Expense")
        ],
        "daily_habits": [
            ("09:00:00", "Local Diner", "Coffee", lambda: round(random.uniform(3.0, 6.0),2))
        ],
        "extra_categories": ["Groceries", "Dining Out", "Utilities", "Medical", "Transportation", "Online Subscription"]
    },
    {
        "name": "Gambler",
        "file_name": "gambler.csv",
        "profile": "Gambler",
        "fixed_transactions": [
            (7, "20:00:00", "Casino Win", 1000.00, "Gambling Win", "Deposit"),
            (21, "22:00:00", "Casino Win", 1500.00, "Gambling Win", "Deposit")
        ],
        "daily_habits": [
            ("07:30:00", "Starbucks", "Coffee", lambda: round(random.uniform(3.5, 5.0),2))
        ],
        "extra_categories": ["Gambling Loss", "Dining Out", "Groceries", "Utilities", "Transportation"]
    },
    {
        "name": "Freelancer",
        "file_name": "freelancer.csv",
        "profile": "Freelancer",
        "fixed_transactions": [
            (7, "12:00:00", "Freelance Payment", 800.00, "Income", "Deposit"),
            (14, "12:00:00", "Freelance Payment", 800.00, "Income", "Deposit"),
            (21, "12:00:00", "Freelance Payment", 800.00, "Income", "Deposit"),
            (28, "12:00:00", "Freelance Payment", 800.00, "Income", "Deposit"),
            (1, "08:00:00", "Rent", 900.00, "Rent", "Expense")
        ],
        "daily_habits": [
            ("07:30:00", "Starbucks", "Coffee", lambda: round(random.uniform(3.5, 5.0),2))
        ],
        "extra_categories": ["Groceries", "Dining Out", "Utilities", "Transportation", "Online Subscription", "Entertainment"]
    }
]

# Function to generate transactions for a profile until target count is reached.
def generate_transactions(profile_info, target_count):
    transactions = []
    current_total = 0
    # Pre-calculate fixed transactions by day number for quick lookup.
    fixed_by_day = {}
    for day_offset, time_str, desc, amt, cat, ttype in profile_info.get("fixed_transactions", []):
        fixed_by_day.setdefault(day_offset, []).append((time_str, desc, amt, cat, ttype))
    
    day = 1
    while current_total < target_count:
        current_date = start_date + datetime.timedelta(days=day-1)
        day_str = current_date.strftime("%Y-%m-%d")
        # Add fixed transactions for today if scheduled
        if day in fixed_by_day:
            for t_time, desc, amt, cat, ttype in fixed_by_day[day]:
                dt_str = day_str + " " + t_time
                # For income, amount is positive; for expense, negative.
                final_amt = amt if ttype == "Deposit" else -amt
                transactions.append((dt_str, desc, final_amt, cat, ttype))
                current_total += 1
        
        # Add daily habit transactions (e.g., morning coffee)
        for habit_time, vendor, cat, amt_func in profile_info.get("daily_habits", []):
            dt_str = day_str + " " + habit_time
            amt = amt_func()
            transactions.append((dt_str, vendor, -amt, cat, "Expense"))
            current_total += 1
        
        # Fill up the day with extra transactions until ~daily_target transactions for the day.
        # (Extra transactions include both deposits and expenses)
        transactions_today = len([t for t in transactions if t[0].startswith(day_str)])
        while transactions_today < daily_target and current_total < target_count:
            dt_str = random_time_for_day(current_date)
            # 10% chance for an income deposit from "Misc Income"
            if random.random() < 0.1:
                amt = round(random.uniform(50, 300), 2)
                transactions.append((dt_str, "Misc Income", amt, "Income", "Deposit"))
            else:
                cat = random.choice(profile_info.get("extra_categories", []))
                amt = generate_amount(cat, profile_info["profile"])
                transactions.append((dt_str, cat, -amt, cat, "Expense"))
            transactions_today += 1
            current_total += 1
        day += 1
    # Sort transactions by timestamp
    transactions.sort(key=lambda x: x[0])
    return transactions

# Generate CSV files for each profile using the user-defined target_transactions.
for prof in profiles:
    trans = generate_transactions(prof, target_transactions)
    file_path = os.path.join(output_dir, prof["file_name"])
    with open(file_path, "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["time", "description", "amount", "category", "transaction_type"])
        for t in trans:
            writer.writerow(t)
    print(f"{prof['name']} file generated with {len(trans)} transactions at: {file_path}")
