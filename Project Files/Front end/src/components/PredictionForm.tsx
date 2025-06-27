import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Activity, FlaskConical, TrendingUp } from 'lucide-react';
import { PatientData } from '../types';

interface PredictionFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading: boolean;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PatientData>({
    age: 45,
    gender: 'Male',
    totalBilirubin: 1.0,
    directBilirubin: 0.2,
    alkalinePhosphatase: 100,
    alanineAminotransferase: 30,
    aspartateAminotransferase: 25,
    totalProteins: 7.0,
    albumin: 4.0,
    albuminGlobulinRatio: 1.5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof PatientData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value)
    }));
  };

  // Define a discriminated union type for form fields
  type NumberField = {
    key: keyof PatientData;
    label: string;
    type: 'number';
    unit?: string;
    step?: number;
    min?: number;
    max?: number;
  };
  type SelectField = {
    key: keyof PatientData;
    label: string;
    type: 'select';
    options: string[];
    min?: number;
    max?: number;
    unit?: string;
  };
  type FormField = NumberField | SelectField;
  
  const formSections: {
    title: string;
    icon: React.ComponentType<any>;
    fields: FormField[];
  }[] = [
    {
      title: 'Patient Information',
      icon: User,
      fields: [
        { key: 'age', label: 'Age', type: 'number', unit: 'years', min: 18, max: 100 },
        { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] }
      ]
    },
    {
      title: 'Liver Function Tests',
      icon: FlaskConical,
      fields: [
        { key: 'totalBilirubin', label: 'Total Bilirubin', type: 'number', unit: 'mg/dL', step: 0.1, min: 0 },
        { key: 'directBilirubin', label: 'Direct Bilirubin', type: 'number', unit: 'mg/dL', step: 0.1, min: 0 },
        { key: 'alkalinePhosphatase', label: 'Alkaline Phosphatase', type: 'number', unit: 'U/L', min: 0 },
        { key: 'alanineAminotransferase', label: 'ALT (Alanine Aminotransferase)', type: 'number', unit: 'U/L', min: 0 },
        { key: 'aspartateAminotransferase', label: 'AST (Aspartate Aminotransferase)', type: 'number', unit: 'U/L', min: 0 }
      ]
    },
    {
      title: 'Protein Analysis',
      icon: Activity,
      fields: [
        { key: 'totalProteins', label: 'Total Proteins', type: 'number', unit: 'g/dL', step: 0.1, min: 0 },
        { key: 'albumin', label: 'Albumin', type: 'number', unit: 'g/dL', step: 0.1, min: 0 },
        { key: 'albuminGlobulinRatio', label: 'Albumin/Globulin Ratio', type: 'number', step: 0.1, min: 0 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Liver Cirrhosis Prediction</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter patient laboratory values to generate AI-powered cirrhosis risk assessment
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {formSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: sectionIndex * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg mr-3">
                  <section.icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {section.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.unit && <span className="text-gray-500 ml-1">({field.unit})</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.key as keyof PatientData] as string}
                        onChange={(e) => handleInputChange(field.key as keyof PatientData, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        {field.options?.map((option: string) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.key as keyof PatientData] as number}
                        onChange={(e) => handleInputChange(field.key as keyof PatientData, e.target.value)}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Generate Prediction
                </div>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};