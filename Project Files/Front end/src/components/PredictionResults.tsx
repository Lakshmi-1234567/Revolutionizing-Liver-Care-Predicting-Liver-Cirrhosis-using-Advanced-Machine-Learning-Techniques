import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle, Info, TrendingUp, Activity } from 'lucide-react';
import { PredictionResult } from '../types';

interface PredictionResultsProps {
  result: PredictionResult;
  onNewPrediction: () => void;
}

export const PredictionResults: React.FC<PredictionResultsProps> = ({ result, onNewPrediction }) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Moderate': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return CheckCircle;
      case 'Moderate': return Info;
      case 'High': return AlertTriangle;
      case 'Critical': return XCircle;
      default: return Info;
    }
  };

  const RiskIcon = getRiskIcon(result.riskLevel);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Prediction Results</h1>
          <p className="text-xl text-gray-600">AI-powered liver cirrhosis risk assessment</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Result Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className={`inline-flex items-center px-6 py-3 rounded-full ${getRiskColor(result.riskLevel)} mb-4`}>
                <RiskIcon className="h-6 w-6 mr-2" />
                <span className="font-semibold text-lg">{result.riskLevel} Risk</span>
              </div>
              
              <div className="mb-6">
                <div className="text-6xl font-bold text-gray-900 mb-2">
                  {result.probability.toFixed(1)}%
                </div>
                <div className="text-gray-600">Cirrhosis Probability</div>
              </div>

              <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
                <div className="text-center">
                  <div className="font-semibold text-lg text-gray-900">Stage {result.stage}</div>
                  <div>Disease Stage</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-gray-900">{result.confidence.toFixed(1)}%</div>
                  <div>Confidence</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Risk Level</span>
                <span>{result.probability.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.probability}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-3 rounded-full ${
                    result.riskLevel === 'Low' ? 'bg-green-500' :
                    result.riskLevel === 'Moderate' ? 'bg-yellow-500' :
                    result.riskLevel === 'High' ? 'bg-orange-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>

            {/* Key Factors */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Key Risk Factors
              </h3>
              <div className="space-y-4">
                {result.keyFactors.map((factor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{factor.factor}</h4>
                      <span className="text-sm font-medium text-blue-600">
                        {factor.impact.toFixed(1)}% impact
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{factor.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recommendations Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recommendations
              </h3>
              <div className="space-y-3">
                {result.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{recommendation}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNewPrediction}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              New Prediction
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};