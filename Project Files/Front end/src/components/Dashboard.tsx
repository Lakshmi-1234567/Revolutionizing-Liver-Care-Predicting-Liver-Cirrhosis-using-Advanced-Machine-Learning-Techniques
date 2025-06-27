import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Activity, AlertTriangle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  // Sample data for demonstration
  const riskDistribution = [
    { name: 'Low Risk', value: 45, color: '#10B981' },
    { name: 'Moderate Risk', value: 30, color: '#F59E0B' },
    { name: 'High Risk', value: 20, color: '#F97316' },
    { name: 'Critical Risk', value: 5, color: '#EF4444' }
  ];

  const monthlyPredictions = [
    { month: 'Jan', predictions: 120, accuracy: 94.2 },
    { month: 'Feb', predictions: 135, accuracy: 94.8 },
    { month: 'Mar', predictions: 148, accuracy: 93.9 },
    { month: 'Apr', predictions: 162, accuracy: 95.1 },
    { month: 'May', predictions: 178, accuracy: 94.7 },
    { month: 'Jun', predictions: 195, accuracy: 95.3 }
  ];

  const ageGroupData = [
    { ageGroup: '18-30', count: 45 },
    { ageGroup: '31-45', count: 78 },
    { ageGroup: '46-60', count: 124 },
    { ageGroup: '61-75', count: 89 },
    { ageGroup: '75+', count: 34 }
  ];

  const stats = [
    {
      title: 'Total Predictions',
      value: '1,247',
      change: '+12.5%',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      title: 'Patients Analyzed',
      value: '892',
      change: '+8.2%',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Model Accuracy',
      value: '94.7%',
      change: '+0.3%',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'High Risk Cases',
      value: '156',
      change: '-2.1%',
      icon: AlertTriangle,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
          <p className="text-xl text-gray-600">Comprehensive insights into liver cirrhosis predictions and model performance</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-gray-100`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.title}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Risk Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Risk Level Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Monthly Trends */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Prediction Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPredictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="predictions" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Age Group Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Age Group Analysis</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={ageGroupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ageGroup" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};