
import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { MaintenanceReminder } from './components/MaintenanceReminder';
import { About } from './components/About';
import { Reviews } from './components/Reviews';
import { Booking } from './components/Booking';
import { Chatbot } from './components/Chatbot';
import { Footer } from './components/Footer';
import { ServiceType } from './types';
import { EstimateCalculator } from './components/EstimateCalculator';
import { ServiceAreaMap } from './components/ServiceAreaMap';
import { CustomerPortal } from './components/CustomerPortal';
import { CostSavingsCalculator } from './components/CostSavingsCalculator';
import { RecommendedEnhancements } from './components/RecommendedEnhancements';
import { FinancingCalculator } from './components/FinancingCalculator';
import { DiagnosticTool } from './components/DiagnosticTool';
import { WrenchScrewdriverIcon, ShieldCheckIcon, XMarkIcon } from './components/icons';
import { FaqModal } from './components/FaqModal';
import { LeadGenerationForm } from './components/LeadGenerationForm';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsOfServiceModal } from './components/TermsOfServiceModal';
import { VisualDiagnosis } from './components/VisualDiagnosis';
import { ToolsSection } from './components/ToolsSection';
import { RatingWidget } from './components/RatingWidget';
import { ReviewsModal } from './components/ReviewsModal';
import { LeaveReviewModal } from './components/LeaveReviewModal';

const TroubleshootModalContent: React.FC<{ onBookNow: (service: ServiceType) => void, onClose: () => void }> = ({ onBookNow, onClose }) => {
    const [diagnosticResult, setDiagnosticResult] = useState<{ text: string; service: ServiceType } | null>(null);
    const [isDiagnosing, setIsDiagnosing] = useState(false);

    const handleComplete = (recommendation: string, service: ServiceType) => {
        setDiagnosticResult({ text: recommendation, service });
        setIsDiagnosing(false);
    };

    const handleStart = () => {
        setIsDiagnosing(true);
        setDiagnosticResult(null);
    }

    return (
        <div className="p-4 md:p-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-blue-800">Troubleshoot Your Issue</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Answer a few simple questions to help us identify the problem with your HVAC system.
                </p>
            </div>
            <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
                {!isDiagnosing && !diagnosticResult && (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <WrenchScrewdriverIcon className="w-10 h-10 text-orange-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Start System Check</h3>
                        <p className="text-gray-600 my-6 text-lg">Our interactive guide will help you perform basic checks before calling a pro.</p>
                        <button onClick={handleStart} className="bg-orange-500 text-white font-bold py-4 px-10 rounded-2xl shadow-xl hover:bg-orange-600 transition duration-300 transform hover:scale-105">
                            Begin Troubleshooting
                        </button>
                    </div>
                )}
                {isDiagnosing && (
                    <div className="py-4">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s] mx-2"></div>
                            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                        </div>
                        <DiagnosticTool onComplete={handleComplete} />
                    </div>
                )}
                {diagnosticResult && (
                    <div className="text-center py-8 animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldCheckIcon className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Check Complete</h3>
                        <div className="text-gray-700 my-6 bg-white p-6 rounded-2xl border border-green-100 shadow-sm text-lg italic">
                            "{diagnosticResult.text}"
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={() => onBookNow(diagnosticResult.service)} className="bg-blue-800 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:bg-blue-900 transition duration-300">
                                Book {diagnosticResult.service}
                            </button>
                            <button onClick={() => setDiagnosticResult(null)} className="text-gray-500 font-bold hover:text-gray-700 py-4 px-8">
                                Start Over
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<ServiceType | undefined>(undefined);
    const [isPortalOpen, setIsPortalOpen] = useState(false);
    const [isFaqOpen, setIsFaqOpen] = useState(false);
    const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
    const [isTermsOfServiceOpen, setIsTermsOfServiceOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isTestimonialsOpen, setIsTestimonialsOpen] = useState(false);
    const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);

    // New Modal States for Reviews
    const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
    const [isLeaveReviewModalOpen, setIsLeaveReviewModalOpen] = useState(false);

    // Tool Modal States
    const [isTroubleshootModalOpen, setIsTroubleshootModalOpen] = useState(false);
    const [isVisualDiagnosisModalOpen, setIsVisualDiagnosisModalOpen] = useState(false);
    const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
    const [isFinancingModalOpen, setIsFinancingModalOpen] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Ref to Chatbot to trigger actions
    const chatbotRef = useRef<{ openWithImage: (file: File) => void } | null>(null);

    const openBookingModal = (service?: ServiceType) => {
        setSelectedService(service);
        setIsBookingOpen(true);
    };

    const closeBookingModal = () => {
        setIsBookingOpen(false);
        setSelectedService(undefined);
    };

    const openPortalModal = () => setIsPortalOpen(true);
    const closePortalModal = () => setIsPortalOpen(false);

    const openFaqModal = () => setIsFaqOpen(true);
    const closeFaqModal = () => setIsFaqOpen(false);

    const openPrivacyPolicyModal = () => setIsPrivacyPolicyOpen(true);
    const closePrivacyPolicyModal = () => setIsPrivacyPolicyOpen(false);

    const openTermsOfServiceModal = () => setIsTermsOfServiceOpen(true);
    const closeTermsOfServiceModal = () => setIsTermsOfServiceOpen(false);

    const openAboutModal = () => setIsAboutOpen(true);
    const closeAboutModal = () => setIsAboutOpen(false);

    const openTestimonialsModal = () => setIsTestimonialsOpen(true);
    const closeTestimonialsModal = () => setIsTestimonialsOpen(false);

    const openEstimatorModal = () => setIsEstimatorOpen(false);
    const closeEstimatorModal = () => setIsEstimatorOpen(false);

    const openContactModal = () => setIsContactOpen(true);
    const closeContactModal = () => setIsContactOpen(false);

    const handleLogin = (customerData: any) => {
        setIsLoggedIn(true);
        setCurrentUser(customerData);
        closePortalModal();
    }

    const handlePortalBookNow = (service: ServiceType) => {
        closePortalModal();
        setTimeout(() => openBookingModal(service), 100);
    }

    const handleEstimatorBookNow = (service: ServiceType) => {
        closeEstimatorModal();
        setTimeout(() => openBookingModal(service), 100);
    }

    const handleImageUpload = (file: File) => {
        setIsVisualDiagnosisModalOpen(false); 
        if (chatbotRef.current) {
            chatbotRef.current.openWithImage(file);
        }
    };

    const closeToolModals = () => {
        setIsTroubleshootModalOpen(false);
        setIsVisualDiagnosisModalOpen(false);
        setIsSavingsModalOpen(false);
        setIsFinancingModalOpen(false);
    };

    return (
        <div className="bg-gray-50 text-gray-800 font-sans">
            <Header 
                onLoginClick={openPortalModal} 
                onFaqClick={openFaqModal} 
                onAboutClick={openAboutModal} 
                onTestimonialsClick={openTestimonialsModal}
                onBookNow={openBookingModal} 
                onContactClick={openContactModal}
            />
            <main>
                <Hero onBookNow={openBookingModal} />
                
                <Services onBookNow={openBookingModal} />
                
                <ToolsSection 
                    onOpenDiagnosis={() => setIsVisualDiagnosisModalOpen(true)}
                    onOpenTroubleshoot={() => setIsTroubleshootModalOpen(true)}
                    onOpenSavings={() => setIsSavingsModalOpen(true)}
                    onOpenFinancing={() => setIsFinancingModalOpen(true)}
                />

                <About />
                <MaintenanceReminder />
                <ServiceAreaMap />
            </main>
            <Footer 
                onPrivacyClick={openPrivacyPolicyModal} 
                onTermsClick={openTermsOfServiceModal} 
                onBookNow={openBookingModal}
                onContactClick={openContactModal}
                onAboutClick={openAboutModal}
            />
            <Chatbot 
                ref={chatbotRef}
                openBookingModal={openBookingModal} 
                isLoggedIn={isLoggedIn} 
                currentUser={currentUser}
            />

            {/* Rating Widget */}
            <RatingWidget onClick={() => setIsReviewsModalOpen(true)} />

            {/* Reviews Modals */}
            {isReviewsModalOpen && (
                <ReviewsModal 
                    onClose={() => setIsReviewsModalOpen(false)} 
                    onWriteReview={() => setIsLeaveReviewModalOpen(true)}
                />
            )}
            {isLeaveReviewModalOpen && (
                <LeaveReviewModal onClose={() => setIsLeaveReviewModalOpen(false)} />
            )}

            {/* Tool Modals - Pop-up Windows */}
            {isTroubleshootModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={closeToolModals}>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-4" onClick={e => e.stopPropagation()}>
                        <button onClick={closeToolModals} className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 z-10 p-3 bg-gray-100 rounded-full transition-all hover:scale-110">
                            <XMarkIcon className="w-8 h-8" />
                        </button>
                        <TroubleshootModalContent onBookNow={(s) => { closeToolModals(); openBookingModal(s); }} onClose={closeToolModals} />
                    </div>
                </div>
            )}

            {isVisualDiagnosisModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={closeToolModals}>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative" onClick={e => e.stopPropagation()}>
                        <button onClick={closeToolModals} className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 z-10 p-3 bg-gray-100 rounded-full transition-all hover:scale-110">
                            <XMarkIcon className="w-8 h-8" />
                        </button>
                        <VisualDiagnosis onImageUpload={handleImageUpload} />
                    </div>
                </div>
            )}

            {isSavingsModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={closeToolModals}>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative p-4 md:p-12" onClick={e => e.stopPropagation()}>
                        <button onClick={closeToolModals} className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 z-10 p-3 bg-gray-100 rounded-full transition-all hover:scale-110">
                            <XMarkIcon className="w-8 h-8" />
                        </button>
                        <CostSavingsCalculator onBookNow={(s) => { closeToolModals(); openBookingModal(s); }} />
                    </div>
                </div>
            )}

            {isFinancingModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={closeToolModals}>
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative p-4 md:p-12" onClick={e => e.stopPropagation()}>
                        <button onClick={closeToolModals} className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 z-10 p-3 bg-gray-100 rounded-full transition-all hover:scale-110">
                            <XMarkIcon className="w-8 h-8" />
                        </button>
                        <FinancingCalculator onBookNow={(s) => { closeToolModals(); openBookingModal(s); }} onOpenEstimator={openEstimatorModal} />
                    </div>
                </div>
            )}

            {/* Other Modals */}
            {isBookingOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <Booking onClose={closeBookingModal} initialService={selectedService} />
                </div>
            )}
             {isPortalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <CustomerPortal onClose={closePortalModal} onBookNow={handlePortalBookNow} onLogin={handleLogin} />
                </div>
            )}
            {isFaqOpen && (
                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <FaqModal onClose={closeFaqModal} />
                </div>
            )}
            {isPrivacyPolicyOpen && (
                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <PrivacyPolicyModal onClose={closePrivacyPolicyModal} />
                </div>
            )}
            {isTermsOfServiceOpen && (
                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <TermsOfServiceModal onClose={closeTermsOfServiceModal} />
                </div>
            )}
            {isAboutOpen && (
                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
                         <button onClick={closeAboutModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                            <XMarkIcon className="w-8 h-8" />
                        </button>
                        <About />
                    </div>
                </div>
            )}
            {isTestimonialsOpen && (
                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
                         <button onClick={closeTestimonialsModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                            <XMarkIcon className="w-8 h-8" />
                        </button>
                        <Reviews />
                    </div>
                </div>
            )}
            {isEstimatorOpen && (
                 <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto relative">
                         <button onClick={closeEstimatorModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                            <XMarkIcon className="w-8 h-8" />
                        </button>
                        <EstimateCalculator onBookNow={handleEstimatorBookNow} />
                    </div>
                </div>
            )}
            {isContactOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="relative w-full max-w-5xl">
                        <button onClick={closeContactModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                            <XMarkIcon className="w-10 h-10" />
                        </button>
                        <LeadGenerationForm isModal={true} onClose={closeContactModal} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
