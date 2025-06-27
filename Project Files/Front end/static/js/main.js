// Main JavaScript functionality for the liver cirrhosis prediction application

// Navigation functions
function showPredictionForm() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('predict').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
}

function showDashboard() {
    window.location.href = '/portfolio-details';
}

function showHome() {
    document.getElementById('home').style.display = 'block';
    document.getElementById('predict').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'none';
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...';
            submitBtn.disabled = true;
            
            // Collect form data
            const formData = new FormData(form);
            const data = {
                age: parseFloat(formData.get('age')),
                gender: formData.get('gender'),
                totalBilirubin: parseFloat(formData.get('totalBilirubin')),
                directBilirubin: parseFloat(formData.get('directBilirubin')),
                alkalinePhosphatase: parseFloat(formData.get('alkalinePhosphatase')),
                alanineAminotransferase: parseFloat(formData.get('alanineAminotransferase')),
                aspartateAminotransferase: parseFloat(formData.get('aspartateAminotransferase')),
                totalProteins: parseFloat(formData.get('totalProteins')),
                albumin: parseFloat(formData.get('albumin')),
                albuminGlobulinRatio: parseFloat(formData.get('albuminGlobulinRatio'))
            };
            
            try {
                // Send prediction request
                const response = await fetch('/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    displayResults(result);
                } else {
                    throw new Error(result.error || 'Prediction failed');
                }
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
});

// Display prediction results
function displayResults(result) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContent = document.getElementById('resultsContent');
    
    const riskColor = getRiskColor(result.riskLevel);
    const riskIcon = getRiskIcon(result.riskLevel);
    
    resultsContent.innerHTML = `
        <div class="grid lg:grid-cols-3 gap-8">
            <!-- Main Result Card -->
            <div class="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
                <div class="text-center mb-8">
                    <div class="inline-flex items-center px-6 py-3 rounded-full ${riskColor} mb-4">
                        <i class="${riskIcon} mr-2"></i>
                        <span class="font-semibold text-lg">${result.riskLevel} Risk</span>
                    </div>
                    
                    <div class="mb-6">
                        <div class="text-6xl font-bold text-gray-900 mb-2">
                            ${result.probability.toFixed(1)}%
                        </div>
                        <div class="text-gray-600">Cirrhosis Probability</div>
                    </div>

                    <div class="flex justify-center items-center space-x-8 text-sm text-gray-600">
                        <div class="text-center">
                            <div class="font-semibold text-lg text-gray-900">Stage ${result.stage}</div>
                            <div>Disease Stage</div>
                        </div>
                        <div class="text-center">
                            <div class="font-semibold text-lg text-gray-900">${result.confidence.toFixed(1)}%</div>
                            <div>Confidence</div>
                        </div>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="mb-8">
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Risk Level</span>
                        <span>${result.probability.toFixed(1)}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                        <div class="h-3 rounded-full progress-bar ${getProgressBarColor(result.riskLevel)}" 
                             style="width: ${result.probability}%"></div>
                    </div>
                </div>

                <!-- Key Factors -->
                <div class="mb-8">
                    <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <i class="fas fa-chart-line mr-2"></i>
                        Key Risk Factors
                    </h3>
                    <div class="space-y-4">
                        ${result.keyFactors.map(factor => `
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-semibold text-gray-900">${factor.factor}</h4>
                                    <span class="text-sm font-medium text-blue-600">
                                        ${factor.impact.toFixed(1)}% impact
                                    </span>
                                </div>
                                <p class="text-gray-600 text-sm">${factor.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <!-- Recommendations Sidebar -->
            <div class="space-y-6">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <i class="fas fa-chart-bar mr-2"></i>
                        Recommendations
                    </h3>
                    <div class="space-y-3">
                        ${result.recommendations.map(recommendation => `
                            <div class="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                                <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <p class="text-sm text-gray-700">${recommendation}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <button onclick="showPredictionForm()" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                    New Prediction
                </button>
            </div>
        </div>
    `;
    
    // Hide form and show results
    document.getElementById('predict').style.display = 'none';
    resultsSection.style.display = 'block';
}

// Helper functions
function getRiskColor(riskLevel) {
    switch (riskLevel) {
        case 'Low': return 'text-green-600 bg-green-100';
        case 'Moderate': return 'text-yellow-600 bg-yellow-100';
        case 'High': return 'text-orange-600 bg-orange-100';
        case 'Critical': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
    }
}

function getRiskIcon(riskLevel) {
    switch (riskLevel) {
        case 'Low': return 'fas fa-check-circle';
        case 'Moderate': return 'fas fa-info-circle';
        case 'High': return 'fas fa-exclamation-triangle';
        case 'Critical': return 'fas fa-times-circle';
        default: return 'fas fa-info-circle';
    }
}

function getProgressBarColor(riskLevel) {
    switch (riskLevel) {
        case 'Low': return 'bg-green-500';
        case 'Moderate': return 'bg-yellow-500';
        case 'High': return 'bg-orange-500';
        case 'Critical': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});