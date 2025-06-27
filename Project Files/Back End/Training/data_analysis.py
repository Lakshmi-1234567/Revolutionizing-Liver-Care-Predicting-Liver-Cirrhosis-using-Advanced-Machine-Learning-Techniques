"""
Exploratory Data Analysis for Liver Cirrhosis Dataset
This script performs comprehensive EDA on the liver cirrhosis dataset.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

class LiverCirrhosisEDA:
    def __init__(self, data_path='../Data/liver.csv'):
        self.data_path = data_path
        self.df = None
        
    def load_data(self):
        """Load the dataset"""
        print("Loading dataset...")
        self.df = pd.read_csv(self.data_path)
        print(f"Dataset loaded successfully. Shape: {self.df.shape}")
        
    def basic_info(self):
        """Display basic information about the dataset"""
        print("\n" + "="*50)
        print("BASIC DATASET INFORMATION")
        print("="*50)
        
        print(f"Dataset shape: {self.df.shape}")
        print(f"Number of features: {self.df.shape[1] - 1}")  # Excluding target
        print(f"Number of samples: {self.df.shape[0]}")
        
        print("\nColumn names and data types:")
        print(self.df.dtypes)
        
        print("\nMissing values:")
        missing_values = self.df.isnull().sum()
        print(missing_values[missing_values > 0])
        
        if missing_values.sum() == 0:
            print("No missing values found!")
            
    def descriptive_statistics(self):
        """Generate descriptive statistics"""
        print("\n" + "="*50)
        print("DESCRIPTIVE STATISTICS")
        print("="*50)
        
        # Numerical features
        numerical_cols = self.df.select_dtypes(include=[np.number]).columns
        print("\nNumerical Features Statistics:")
        print(self.df[numerical_cols].describe())
        
        # Categorical features
        categorical_cols = self.df.select_dtypes(include=['object']).columns
        if len(categorical_cols) > 0:
            print("\nCategorical Features:")
            for col in categorical_cols:
                print(f"\n{col} value counts:")
                print(self.df[col].value_counts())
                
    def target_distribution(self):
        """Analyze target variable distribution"""
        print("\n" + "="*50)
        print("TARGET VARIABLE ANALYSIS")
        print("="*50)
        
        target_col = 'Dataset'  # Assuming this is the target column
        
        if target_col in self.df.columns:
            print(f"\nTarget variable ({target_col}) distribution:")
            target_counts = self.df[target_col].value_counts()
            print(target_counts)
            
            # Calculate percentages
            target_percentages = self.df[target_col].value_counts(normalize=True) * 100
            print(f"\nTarget variable percentages:")
            print(target_percentages)
            
            # Visualize target distribution
            plt.figure(figsize=(12, 5))
            
            plt.subplot(1, 2, 1)
            target_counts.plot(kind='bar', color=['skyblue', 'lightcoral'])
            plt.title('Target Variable Distribution (Counts)')
            plt.xlabel('Class')
            plt.ylabel('Count')
            plt.xticks(rotation=0)
            
            plt.subplot(1, 2, 2)
            plt.pie(target_counts.values, labels=target_counts.index, autopct='%1.1f%%', 
                   colors=['skyblue', 'lightcoral'])
            plt.title('Target Variable Distribution (Percentage)')
            
            plt.tight_layout()
            plt.show()
            
    def correlation_analysis(self):
        """Perform correlation analysis"""
        print("\n" + "="*50)
        print("CORRELATION ANALYSIS")
        print("="*50)
        
        # Select numerical columns
        numerical_cols = self.df.select_dtypes(include=[np.number]).columns
        
        # Calculate correlation matrix
        correlation_matrix = self.df[numerical_cols].corr()
        
        # Visualize correlation matrix
        plt.figure(figsize=(12, 10))
        mask = np.triu(np.ones_like(correlation_matrix, dtype=bool))
        sns.heatmap(correlation_matrix, mask=mask, annot=True, cmap='coolwarm', 
                   center=0, square=True, linewidths=0.5)
        plt.title('Feature Correlation Matrix')
        plt.tight_layout()
        plt.show()
        
        # Find highly correlated features
        high_corr_pairs = []
        for i in range(len(correlation_matrix.columns)):
            for j in range(i+1, len(correlation_matrix.columns)):
                if abs(correlation_matrix.iloc[i, j]) > 0.7:
                    high_corr_pairs.append((
                        correlation_matrix.columns[i],
                        correlation_matrix.columns[j],
                        correlation_matrix.iloc[i, j]
                    ))
                    
        if high_corr_pairs:
            print("\nHighly correlated feature pairs (|correlation| > 0.7):")
            for pair in high_corr_pairs:
                print(f"{pair[0]} - {pair[1]}: {pair[2]:.3f}")
        else:
            print("\nNo highly correlated feature pairs found.")
            
    def feature_distributions(self):
        """Analyze feature distributions"""
        print("\n" + "="*50)
        print("FEATURE DISTRIBUTION ANALYSIS")
        print("="*50)
        
        numerical_cols = self.df.select_dtypes(include=[np.number]).columns
        
        # Remove target column if present
        if 'Dataset' in numerical_cols:
            numerical_cols = numerical_cols.drop('Dataset')
            
        # Create subplots for distributions
        n_cols = 3
        n_rows = (len(numerical_cols) + n_cols - 1) // n_cols
        
        plt.figure(figsize=(15, 5 * n_rows))
        
        for i, col in enumerate(numerical_cols):
            plt.subplot(n_rows, n_cols, i + 1)
            
            # Histogram with KDE
            sns.histplot(data=self.df, x=col, kde=True, alpha=0.7)
            plt.title(f'Distribution of {col}')
            plt.xlabel(col)
            plt.ylabel('Frequency')
            
        plt.tight_layout()
        plt.show()
        
    def outlier_analysis(self):
        """Detect and visualize outliers"""
        print("\n" + "="*50)
        print("OUTLIER ANALYSIS")
        print("="*50)
        
        numerical_cols = self.df.select_dtypes(include=[np.number]).columns
        
        # Remove target column if present
        if 'Dataset' in numerical_cols:
            numerical_cols = numerical_cols.drop('Dataset')
            
        # Create box plots
        n_cols = 3
        n_rows = (len(numerical_cols) + n_cols - 1) // n_cols
        
        plt.figure(figsize=(15, 5 * n_rows))
        
        for i, col in enumerate(numerical_cols):
            plt.subplot(n_rows, n_cols, i + 1)
            sns.boxplot(y=self.df[col])
            plt.title(f'Box Plot of {col}')
            plt.ylabel(col)
            
        plt.tight_layout()
        plt.show()
        
        # Calculate outliers using IQR method
        outlier_summary = {}
        for col in numerical_cols:
            Q1 = self.df[col].quantile(0.25)
            Q3 = self.df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            outliers = self.df[(self.df[col] < lower_bound) | (self.df[col] > upper_bound)]
            outlier_summary[col] = len(outliers)
            
        print("\nOutlier count by feature (using IQR method):")
        for feature, count in outlier_summary.items():
            print(f"{feature}: {count} outliers")
            
    def class_wise_analysis(self):
        """Analyze features by class"""
        print("\n" + "="*50)
        print("CLASS-WISE FEATURE ANALYSIS")
        print("="*50)
        
        target_col = 'Dataset'
        
        if target_col not in self.df.columns:
            print("Target column not found. Skipping class-wise analysis.")
            return
            
        numerical_cols = self.df.select_dtypes(include=[np.number]).columns
        numerical_cols = numerical_cols.drop(target_col)
        
        # Create violin plots for each feature by class
        n_cols = 3
        n_rows = (len(numerical_cols) + n_cols - 1) // n_cols
        
        plt.figure(figsize=(15, 5 * n_rows))
        
        for i, col in enumerate(numerical_cols):
            plt.subplot(n_rows, n_cols, i + 1)
            sns.violinplot(data=self.df, x=target_col, y=col)
            plt.title(f'{col} by Class')
            plt.xlabel('Class')
            plt.ylabel(col)
            
        plt.tight_layout()
        plt.show()
        
        # Statistical tests for significant differences
        print("\nStatistical significance tests (Mann-Whitney U test):")
        for col in numerical_cols:
            class_0 = self.df[self.df[target_col] == 0][col]
            class_1 = self.df[self.df[target_col] == 1][col]
            
            statistic, p_value = stats.mannwhitneyu(class_0, class_1, alternative='two-sided')
            significance = "Significant" if p_value < 0.05 else "Not significant"
            
            print(f"{col}: p-value = {p_value:.4f} ({significance})")
            
    def generate_complete_report(self):
        """Generate complete EDA report"""
        print("LIVER CIRRHOSIS DATASET - EXPLORATORY DATA ANALYSIS REPORT")
        print("=" * 70)
        
        # Load data
        self.load_data()
        
        # Basic information
        self.basic_info()
        
        # Descriptive statistics
        self.descriptive_statistics()
        
        # Target distribution
        self.target_distribution()
        
        # Feature distributions
        self.feature_distributions()
        
        # Correlation analysis
        self.correlation_analysis()
        
        # Outlier analysis
        self.outlier_analysis()
        
        # Class-wise analysis
        self.class_wise_analysis()
        
        print("\n" + "="*70)
        print("EDA REPORT COMPLETED SUCCESSFULLY!")
        print("="*70)

if __name__ == "__main__":
    # Initialize EDA class
    eda = LiverCirrhosisEDA()
    
    # Generate complete report
    eda.generate_complete_report()