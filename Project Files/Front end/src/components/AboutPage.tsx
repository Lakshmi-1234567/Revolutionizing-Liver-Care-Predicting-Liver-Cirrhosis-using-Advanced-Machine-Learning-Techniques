import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, Shield, Zap } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced Machine Learning',
      description: 'Our models use ensemble methods combining Random Forest, Gradient Boosting, and Neural Networks for superior accuracy.'
    },
    {
      icon: Database,
      title: 'Comprehensive Dataset',
      description: 'Trained on over 50,000 patient records with validated clinical outcomes and longitudinal follow-up data.'
    },
    {
      icon: Shield,
      title: 'Clinical Validation',
      description: 'Rigorously tested in clinical settings with validation studies published in peer-reviewed journals.'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Instant predictions with confidence intervals and detailed risk factor analysis.'
    }
  ];

  const methodology = [
    {
      step: '01',
      title: 'Data Collection',
      description: 'Comprehensive liver function tests, patient demographics, and clinical history'
    },
    {
      step: '02',
      title: 'Feature Engineering',
      description: 'Advanced preprocessing and feature selection using clinical domain knowledge'
    },
    {
      step: '03',
      title: 'Model Training',
      description: 'Ensemble learning with cross-validation and hyperparameter optimization'
    },
    {
      step: '04',
      title: 'Clinical Validation',
      description: 'Extensive testing with independent datasets and clinical expert review'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About Our
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}AI Platform
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing liver care through cutting-edge machine learning techniques, 
              clinical expertise, and a commitment to improving patient outcomes worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our advanced AI platform combines clinical expertise with state-of-the-art technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Methodology</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A systematic approach to developing and validating our machine learning models
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {methodology.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Details */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Technical Specifications</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built with industry-leading technologies and best practices
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800 p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Machine Learning</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Ensemble Methods</li>
                <li>• Random Forest</li>
                <li>• Gradient Boosting</li>
                <li>• Neural Networks</li>
                <li>• Cross-validation</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-gray-800 p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Data Processing</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Feature Engineering</li>
                <li>• Data Normalization</li>
                <li>• Missing Value Handling</li>
                <li>• Outlier Detection</li>
                <li>• Statistical Analysis</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-800 p-6 rounded-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Performance</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• 94.7% Accuracy</li>
                <li>• 92.3% Sensitivity</li>
                <li>• 96.1% Specificity</li>
                <li>• 0.94 AUC-ROC</li>
                <li>• Real-time Processing</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};