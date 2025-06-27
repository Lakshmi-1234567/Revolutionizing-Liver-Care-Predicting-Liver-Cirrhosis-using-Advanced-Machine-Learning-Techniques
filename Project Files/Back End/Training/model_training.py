"""
Liver Cirrhosis Prediction Model Training Script
This script handles the training of machine learning models for liver cirrhosis prediction.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score
import pickle
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

class LiverCirrhosisModelTrainer:
    def __init__(self, data_path='../Data/liver.csv'):
        self.data_path = data_path
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        
    def load_and_preprocess_data(self):
        """Load and preprocess the liver cirrhosis dataset"""
        print("Loading and preprocessing data...")
        
        # Load data
        df = pd.read_csv(self.data_path, delimiter=None, engine='python')

        
        # Handle missing values
        df = df.dropna()
        
        # Encode categorical variables
        self.label_encoder = LabelEncoder()
        df['Gender'] = self.label_encoder.fit_transform(df['Gender'])
        
        # Separate features and target
        self.feature_columns = [
            'Age', 'Gender', 'Total_Bilirubin', 'Direct_Bilirubin',
            'Alkaline_Phosphatase', 'Alamine_Aminotransferase',
            'Aspartate_Aminotransferase', 'Total_Proteins', 'Albumin',
            'A/G_Ratio'
        ]
        
        X = df[self.feature_columns]
        y = df['Dataset']  # Assuming 'Dataset' column contains the target (1 for cirrhosis, 0 for normal)
        
        # Split the data
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale the features
        self.scaler = StandardScaler()
        self.X_train_scaled = self.scaler.fit_transform(self.X_train)
        self.X_test_scaled = self.scaler.transform(self.X_test)
        
        print(f"Data loaded successfully. Shape: {X.shape}")
        print(f"Training set: {self.X_train.shape}, Test set: {self.X_test.shape}")
        
    def train_random_forest(self):
        """Train Random Forest model with hyperparameter tuning"""
        print("Training Random Forest model...")
        
        # Define parameter grid for hyperparameter tuning
        param_grid = {
            'n_estimators': [100, 200, 300],
            'max_depth': [10, 20, None],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4]
        }
        
        # Initialize Random Forest
        rf = RandomForestClassifier(random_state=42)
        
        # Perform grid search
        grid_search = GridSearchCV(
            rf, param_grid, cv=5, scoring='accuracy', n_jobs=-1, verbose=1
        )
        
        grid_search.fit(self.X_train_scaled, self.y_train)
        
        # Get best model
        self.model = grid_search.best_estimator_
        
        print(f"Best parameters: {grid_search.best_params_}")
        print(f"Best cross-validation score: {grid_search.best_score_:.4f}")
        
    def evaluate_model(self):
        """Evaluate the trained model"""
        print("Evaluating model...")
        
        # Make predictions
        y_pred = self.model.predict(self.X_test_scaled)
        y_pred_proba = self.model.predict_proba(self.X_test_scaled)[:, 1]
        
        # Calculate metrics
        accuracy = accuracy_score(self.y_test, y_pred)
        auc_score = roc_auc_score(self.y_test, y_pred_proba)
        
        print(f"Test Accuracy: {accuracy:.4f}")
        print(f"AUC-ROC Score: {auc_score:.4f}")
        
        # Classification report
        print("\nClassification Report:")
        print(classification_report(self.y_test, y_pred))
        
        # Confusion matrix
        cm = confusion_matrix(self.y_test, y_pred)
        plt.figure(figsize=(8, 6))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
        plt.title('Confusion Matrix')
        plt.ylabel('Actual')
        plt.xlabel('Predicted')
        plt.show()
        
        # Feature importance
        feature_names = [
            'Age', 'Gender', 'Total_Bilirubin', 'Direct_Bilirubin',
            'Alkaline_Phosphatase', 'Alamine_Aminotransferase',
            'Aspartate_Aminotransferase', 'Total_Proteins', 'Albumin',
            'A/G_Ratio'
        ]
        
        importance_df = pd.DataFrame({
            'feature': self.feature_columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        plt.figure(figsize=(10, 6))
        sns.barplot(data=importance_df, x='importance', y='feature')
        plt.title('Feature Importance')
        plt.xlabel('Importance')
        plt.tight_layout()
        plt.show()
        
        return accuracy, auc_score
        
    def save_model(self, model_path='../rf_acc_68.pkl', scaler_path='../normalizer.pkl'):
        """Save the trained model and scaler"""
        print("Saving model and scaler...")
        
        # Save model
        with open(model_path, 'wb') as f:
            pickle.dump(self.model, f)
            
        # Save scaler
        with open(scaler_path, 'wb') as f:
            pickle.dump(self.scaler, f)
            
        print(f"Model saved to {model_path}")
        print(f"Scaler saved to {scaler_path}")
        
    def cross_validate_model(self):
        """Perform cross-validation"""
        print("Performing cross-validation...")
        
        cv_scores = cross_val_score(
            self.model, self.X_train_scaled, self.y_train, cv=5, scoring='accuracy'
        )
        
        print(f"Cross-validation scores: {cv_scores}")
        print(f"Mean CV accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        
    def train_complete_pipeline(self):
        """Complete training pipeline"""
        print("Starting complete training pipeline...")
        
        # Load and preprocess data
        self.load_and_preprocess_data()
        
        # Train model
        self.train_random_forest()
        
        # Cross-validate
        self.cross_validate_model()
        
        # Evaluate
        accuracy, auc_score = self.evaluate_model()
        
        # Save model
        self.save_model()
        
        print(f"\nTraining completed successfully!")
        print(f"Final Test Accuracy: {accuracy:.4f}")
        print(f"Final AUC-ROC Score: {auc_score:.4f}")
        
        return self.model, self.scaler

if __name__ == "__main__":
    # Initialize trainer
    trainer = LiverCirrhosisModelTrainer()
    
    # Run complete training pipeline
    model, scaler = trainer.train_complete_pipeline()
    
    print("Model training completed successfully!")