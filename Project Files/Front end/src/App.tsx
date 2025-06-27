import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { PredictionForm } from './components/PredictionForm';
import { PredictionResults } from './components/PredictionResults';
import { Dashboard } from './components/Dashboard';
import { AboutPage } from './components/AboutPage';
import { LiverCirrhosisPredictor } from './utils/mlModel';
import { PatientData, PredictionResult } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    if (page !== 'predict') {
      setPredictionResult(null);
    }
  };

  const handlePredictionSubmit = async (data: PatientData) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = LiverCirrhosisPredictor.predict(data);
    setPredictionResult(result);
    setIsLoading(false);
  };

  const handleNewPrediction = () => {
    setPredictionResult(null);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      case 'predict':
        if (predictionResult) {
          return <PredictionResults result={predictionResult} onNewPrediction={handleNewPrediction} />;
        }
        return <PredictionForm onSubmit={handlePredictionSubmit} isLoading={isLoading} />;
      case 'dashboard':
        return <Dashboard />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={handleNavigation} />
      {renderCurrentPage()}
    </div>
  );
}

export default App;