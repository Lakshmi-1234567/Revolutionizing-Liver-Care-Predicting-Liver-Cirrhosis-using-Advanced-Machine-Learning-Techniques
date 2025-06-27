import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# Load your dataset
df = pd.read_csv('Data/liver.csv')  # make sure this file path is correct

# Drop missing values
df.dropna(inplace=True)

# Convert Gender to 0/1
df['Gender'] = df['Gender'].map({'Female': 0, 'Male': 1})

# Features and label
X = df.drop('Dataset', axis=1)
y = df['Dataset'].map({1: 1, 2: 0})  # Map to 1: disease, 0: healthy

# Normalize
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model and scaler
with open('rf_acc_68.pkl', 'wb') as f:
    pickle.dump(model, f)

with open('normalizer.pkl', 'wb') as f:
    pickle.dump(scaler, f)

print("✅ Model and scaler saved successfully!")
