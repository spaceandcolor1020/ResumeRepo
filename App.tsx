import React, { useState, useRef, useEffect, useMemo } from 'react';

// --- TYPE DEFINITIONS ---
interface Experience {
  date: string;
  company: string;
  role: string;
  project?: string;
  description: string[];
  previousPositions?: string[];
}

interface Recognition {
  type: 'PATENT' | 'AWARD';
  title: string;
  details?: string;
  date: string;
  url?: string;
}

interface Education {
    institution: string;
    degree: string;
    details: string[];
}

interface ResumeData {
    name: string;
    title: string;
    contact: {
        website: string;
        phone: string;
        email: string;
    };
    summary: string[];
    experience: Experience[];
    recognition: Recognition[];
    education: Education;
}

// --- RESUME DATA ---
const resumeData: ResumeData = {
    name: "Ashley Golen Johnston",
    title: "Staff Product Designer",
    contact: {
        website: "www.spaceandcolor.co",
        phone: "724.816.0736",
        email: "ashleygolen@gmail.com"
    },
    summary: [
        "Staff Product Designer with over 15 years of experience defining vision, strategy, and execution for hyperscaler Enterprise AI and Cloud platforms.",
        "Proven track record of leading cross-disciplinary teams to deliver successful, innovative software. Currently designing human-centered experiences for Google Cloud Platform, focusing on seamless AI-powered experiences across multiple products and services. Recognized with a patent and multiple technical achievement awards."
    ],
    experience: [
        {
            date: "NOV. '24 - PRESENT",
            company: "Google",
            role: "Staff UX Designer",
            project: "Google Cloud Observability & Gemini Cloud Assist",
            description: [
                "Lead the UX strategy and define the platform vision for AI-powered troubleshooting experiences across Cloud services.",
                "Drive cross-functional alignment with engineering and product management teams to execute strategic objectives.",
                "Collaborate with interdisciplinary teams across multiple Cloud products and services to create seamless experiences."
            ],
            previousPositions: ["Senior UX Designer, Cloud Observability: May '21 - Nov. '24"]
        },
        {
            date: "APR. '19 - MAY '21",
            company: "IBM Watson",
            role: "Senior Product Designer",
            project: "IBM Watson Assistant",
            description: [
                "Directed the strategic vision and design execution for Watson Assistant's platform, driving design alignment with key business OKRs and influencing the product roadmap.",
                "Managed and mentored a team of eight product designers, fostering a high-performance, collaborative design culture.",
                "Invented and championed the Conversational Recommendations interaction pattern, earning a US patent."
            ],
            previousPositions: ["Lead Product Designer, IBM Watson Discovery: Nov. '17 - Apr. '19", "Interaction Designer, IBM Watson Discovery: Aug. '16 - Nov. '17"]
        },
        {
            date: "MAY '14 - AUG. '16",
            company: "Branding Brand",
            role: "Director of Project Design",
            description: [
                "Directed and managed a team of designers, overseeing the complete project lifecycle from concept to delivery for mobile experiences (responsive web, iOS & Android apps).",
                "Cultivated an environment of research-driven innovation to deliver world-class interfaces and interactions for the world's top retailers.",
                "Oversaw design quality and strategy across entire client portfolio, ensuring design solutions directly supported and achieved client objectives related to mobile revenue and user experience."
            ],
            previousPositions: ["Senior Designer: Feb. '13 - May '14", "Designer: Feb. '11 - Feb. '13"]
        }
    ],
    recognition: [
        { type: "PATENT", title: "Contextual Help Recommendations for Conversational Interfaces Based on Interaction Patterns", details: "US 11,243,991", date: "ISSUED FEB. 8, 2022", url: "https://patents.google.com/patent/US11243991B2/en?q=(ashley+golen+johnston)&oq=ashley+golen+johnston" },
        { type: "AWARD", title: "UX Trailblazer Award, Artificial Intelligence Operations", date: "APR. 2024" },
        { type: "AWARD", title: "Cloud Technical Impact Award, Universal Dashboard Framework", date: "MAR. 2024" },
        { type: "AWARD", title: "IBM Outstanding Technical Achievement Award, Watson Conversational Suggestions", date: "OCT. 2020" },
        { type: "AWARD", title: "IBM People's Choice Culture Award, Radical Candor", date: "OCT. 2020" },
        { type: "AWARD", title: "IBM Outstanding Technical Achievement Award, Watson Recommendations", date: "SEP. 2019" },
        { type: "AWARD", title: "IBM Agile Excellence Award", date: "AUG. 2019" }
    ],
    education: {
        institution: "Indiana University of Pennsylvania",
        degree: "BA Art Studio",
        details: ["Summa cum laude", "Graphic Design concentration, Art History minor"]
    }
};


// --- HELPER COMPONENTS ---

const SectionHeader: React.FC<{ title: string; id: string; isVisible: boolean }> = ({ title, id, isVisible }) => (
    <h2 id={id} className={`font-instrument text-4xl mb-8 text-black transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>{title}</h2>
);

const HandDrawnCircleIcon: React.FC = () => (
    <div className="w-5 h-5 flex-shrink-0 mr-3 flex items-center justify-center pt-1">
        <svg
            className="w-2 h-2 text-[#1F32FF]"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="M 8,5 A 3,3.5 0 1,1 2,5 A 3,3.5 0 1,1 8,5" />
        </svg>
    </div>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const AnimatedRecognitionCard: React.FC<{ item: Recognition; index: number; onPatentClick: (item: Recognition) => void; }> = ({ item, index, onPatentClick }) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement | HTMLButtonElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.2,
            }
        );

        const currentRef = cardRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    const cardContent = (
        <>
            <p className="font-bold text-sm uppercase tracking-wider text-gray-500">{item.type}</p>
            <p className="text-gray-800 font-medium mt-1">{item.title}</p>
            {item.details && <p className="text-gray-500 text-sm">{item.details}</p>}
            <p className="text-gray-500 text-sm mt-1">{item.date}</p>
        </>
    );
    
    const isClickablePatent = item.type === 'PATENT' && item.url;
    const baseClasses = `bg-white border border-gray-200 p-4 transition-all duration-500 ease-out h-full`;
    const animationClasses = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

    if (isClickablePatent) {
        return (
            <button
                ref={cardRef as React.RefObject<HTMLButtonElement>}
                onClick={() => onPatentClick(item)}
                aria-label={`View details for patent: ${item.title}.`}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`${baseClasses} ${animationClasses} w-full text-left cursor-pointer hover:border-[#1F32FF] hover:scale-[1.02] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F32FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
            >
                {cardContent}
            </button>
        );
    }

    return (
        <div
            ref={cardRef as React.RefObject<HTMLDivElement>}
            style={{ transitionDelay: `${index * 100}ms` }}
            className={`${baseClasses} ${animationClasses}`}
        >
            {cardContent}
        </div>
    );
};

const ExperienceItem: React.FC<{ item: Experience; isLast: boolean; isOpen: boolean; onToggle: () => void; index: number; }> = ({ item, isLast, isOpen, onToggle, index }) => {
    const detailsId = `experience-details-${item.company.replace(/\s+/g, '-')}`;
    const [isVisible, setIsVisible] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null,
                rootMargin: '0px 0px -100px 0px',
                threshold: 0.1,
            }
        );

        const currentRef = itemRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div
            ref={itemRef}
            className={`flex transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            {/* Timeline Graphic Column */}
            <div className="flex flex-col items-center flex-shrink-0 w-6 mr-6">
                 <button
                    onClick={onToggle}
                    aria-label={`Toggle details for ${item.company}`}
                    className="group rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F32FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                    <div className="relative h-5 w-5 mt-1" aria-hidden="true">
                        <div className="absolute inset-0 bg-white flex items-center justify-center rounded-full">
                            <div className={`h-full w-full ring-2 transition-colors rounded-full ${isOpen ? 'ring-[#1F32FF]' : 'ring-gray-400'} group-hover:ring-[#1F32FF] ${isVisible ? 'animate-subtle-pulse' : ''}`}></div>
                        </div>
                    </div>
                </button>
                {!isLast && <div className="w-0.5 flex-grow bg-gray-300" aria-hidden="true"></div>}
            </div>

            {/* Content Column */}
            <div className={`flex-grow ${isLast ? '' : 'pb-12'}`}>
                <button
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    aria-controls={detailsId}
                    aria-label={`${item.company}: ${item.role}. Click to ${isOpen ? 'collapse' : 'expand'} details.`}
                    className="w-full text-left p-1 -m-1 hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F32FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                    <div className="flex justify-between items-start w-full">
                        <div className="flex-grow">
                             <p className="text-xs uppercase tracking-wider text-gray-500">{item.date}</p>
                             <h3 className="text-xl font-bold text-gray-900">{item.company} | <span className="font-medium">{item.role}</span></h3>
                             {item.project && <p className="text-[#1F32FF]">{item.project}</p>}
                        </div>
                    </div>
                </button>
                <div
                    id={detailsId}
                    className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] pt-4' : 'grid-rows-[0fr]'}`}
                >
                    <div className="overflow-hidden">
                        <ul className="space-y-2 text-gray-700">
                            {item.description.map((point, index) => (
                                <li key={index} className="flex items-start">
                                   <HandDrawnCircleIcon />
                                   <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                        {item.previousPositions && (
                            <div className="mt-4">
                                <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500">Previous Positions:</h4>
                                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                    {item.previousPositions.map((pos, index) => (
                                        <li key={index}>{pos}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ScrollspyNavProps {
    sections: { id: string; title: string }[];
    activeSection: string;
    onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void;
}

const ScrollspyNav: React.FC<ScrollspyNavProps> = ({ sections, activeSection, onNavClick }) => {
    return (
        <nav aria-label="Resume sections">
            <ul className="space-y-3">
                {sections.map(section => (
                    <li key={section.id}>
                        <a 
                            href={`#${section.id}`} 
                            onClick={(e) => onNavClick(e, section.id)}
                            className={`group flex items-center transition-all duration-200 ease-out text-sm font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-[#1F32FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white p-1 -m-1 ${activeSection === section.id ? 'text-[#1F32FF]' : 'text-gray-500 hover:text-black'}`}
                        >
                            <span className={`mr-3 h-px w-8 transition-all duration-200 ease-out ${activeSection === section.id ? 'bg-[#1F32FF] w-12' : 'bg-gray-400 group-hover:bg-black'}`}></span>
                            {section.title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

const PatentModal: React.FC<{ patent: Recognition | null; onClose: () => void; }> = ({ patent, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const modalContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (patent) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            setIsVisible(false);
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [patent]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    
    // Simple focus trap
    useEffect(() => {
      if (isVisible && modalContentRef.current) {
        const focusableElements = modalContentRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        };

        firstElement?.focus();
        window.addEventListener('keydown', handleTabKey);
        return () => window.removeEventListener('keydown', handleTabKey);
      }
    }, [isVisible]);

    if (!patent) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="patent-modal-title"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <div className="fixed inset-0 bg-black/75" onClick={onClose} aria-hidden="true"></div>
            <div
                ref={modalContentRef}
                onClick={(e) => e.stopPropagation()}
                className={`relative bg-white p-8 w-full max-w-lg shadow-xl transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
                <button
                    onClick={onClose}
                    aria-label="Close patent details"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F32FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                    <CloseIcon className="h-6 w-6" />
                </button>
                <div className="space-y-4">
                    <div>
                        <p className="font-bold text-sm uppercase tracking-wider text-gray-500">Patent</p>
                        <h2 id="patent-modal-title" className="text-2xl font-bold text-gray-900 mt-1">{patent.title}</h2>
                        <p className="text-gray-500 text-sm">{patent.details}</p>
                        <p className="text-gray-500 text-sm mt-1">{patent.date}</p>
                    </div>
                    <a
                      href={patent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View patent ${patent.details} on Google Patents. Opens in a new tab.`}
                      className="group inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-[#1F32FF] hover:border-[#1F32FF] hover:text-white active:scale-[0.98] transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F32FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                        View on Google Patents
                    </a>
                </div>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const [activeSection, setActiveSection] = useState('summary');
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({});
  const [openExperience, setOpenExperience] = useState<string | null>('Google');
  const [selectedPatent, setSelectedPatent] = useState<Recognition | null>(null);
  
  const summaryRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const recognitionRef = useRef<HTMLElement>(null);
  const educationRef = useRef<HTMLElement>(null);

  const sections = useMemo(() => [
      { id: 'summary', title: 'Summary', ref: summaryRef },
      { id: 'experience', title: 'Experience', ref: experienceRef },
      { id: 'recognition', title: 'Recognition', ref: recognitionRef },
      { id: 'education', title: 'Education', ref: educationRef }
  ], []);

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            const intersectingEntries = entries.filter(entry => entry.isIntersecting);

            if (intersectingEntries.length > 0) {
                const bandTopY = window.innerHeight * 0.20;
                const closestEntry = intersectingEntries.reduce((prev, current) => {
                    const prevDistance = Math.abs(prev.boundingClientRect.top - bandTopY);
                    const currentDistance = Math.abs(current.boundingClientRect.top - bandTopY);
                    return currentDistance < prevDistance ? current : prev;
                });
                
                setActiveSection(closestEntry.target.id);
            }
        },
        {
            rootMargin: '-20% 0px -75% 0px',
            threshold: 0,
        }
    );

    const currentRefs = sections.map(s => s.ref.current).filter(Boolean);
    currentRefs.forEach(ref => observer.observe(ref!));

    return () => {
        currentRefs.forEach(ref => {
          if (ref) observer.unobserve(ref);
        });
    };
  }, [sections]);

  useEffect(() => {
    const animationObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
                    animationObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const currentRefs = sections.map(s => s.ref.current).filter(Boolean);
    currentRefs.forEach(ref => animationObserver.observe(ref!));

    return () => {
        currentRefs.forEach(ref => {
            if (ref) animationObserver.unobserve(ref);
        });
    };
  }, [sections]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const sectionEl = document.getElementById(sectionId);
    if (sectionEl) {
        sectionEl.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        // Update active section immediately for better UX, observer will catch up
        setActiveSection(sectionId);
    }
  };

  const scrollbarStyles = `
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
      background: #c1c1c1;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
    @keyframes subtle-pulse {
      50% {
        transform: scale(1.1);
      }
    }
    .animate-subtle-pulse {
      animation: subtle-pulse 2s ease-in-out infinite;
    }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="bg-black min-h-screen p-4 sm:p-8 md:p-12 flex items-center justify-center font-sans">
        <div 
            className="bg-white w-full max-w-7xl mx-auto shadow-2xl relative"
        >
          <div className="max-w-7xl mx-auto p-6 sm:p-12 lg:p-16 xl:p-24">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
                <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start z-10">
                    <header className="space-y-2">
                        <h1 className="font-instrument text-5xl text-black tracking-tight">{resumeData.name}</h1>
                        <p className="text-2xl text-[#1F32FF]">{resumeData.title}</p>
                        <div className="pt-4 space-y-2 flex flex-col items-start">
                          <a href={`https://${resumeData.contact.website}`} target="_blank" rel="me noopener noreferrer" aria-label={`Visit personal website at ${resumeData.contact.website} (opens in a new tab)`} className="relative inline-block text-gray-600 hover:text-[#1F32FF] transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F32FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white after:content-[''] after:absolute after:bottom-[-2px] after:left-1/2 after:h-[1.5px] after:w-0 after:bg-[#1F32FF] after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full focus-visible:after:w-full">{resumeData.contact.website}</a>
                          <a href={`tel:${resumeData.contact.phone.replace(/\./g, '')}`} aria-label={`Call Ashley at ${resumeData.contact.phone}`} className="relative inline-block text-gray-600 hover:text-[#1F32FF] transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F32FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white after:content-[''] after:absolute after:bottom-[-2px] after:left-1/2 after:h-[1.5px] after:w-0 after:bg-[#1F32FF] after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full focus-visible:after:w-full">{resumeData.contact.phone}</a>
                          <a href={`mailto:${resumeData.contact.email}`} aria-label={`Email Ashley at ${resumeData.contact.email}`} className="relative inline-block text-gray-600 hover:text-[#1F32FF] transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F32FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white after:content-[''] after:absolute after:bottom-[-2px] after:left-1/2 after:h-[1.p-4x] after:w-0 after:bg-[#1F32FF] after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-full focus-visible:after:w-full">{resumeData.contact.email}</a>
                          <a
                              href="/ashley-golen-johnston-resume.pdf"
                              download="Ashley_Golen_Johnston_Resume.pdf"
                              aria-label="Download resume as PDF"
                              className="group mt-4 flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-[#1F32FF] hover:border-[#1F32FF] hover:text-white active:scale-[0.98] transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1F32FF] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                            >
                                <DownloadIcon className="h-5 w-5 mr-1.5 text-gray-500 group-hover:text-white transition-colors duration-200 ease-out" />
                                Download PDF
                            </a>
                      </div>
                    </header>

                    <div className="hidden lg:block my-12">
                        <ScrollspyNav sections={sections} activeSection={activeSection} onNavClick={handleNavClick} />
                    </div>
                </aside>
                <main className="lg:col-span-8 mt-16 lg:mt-0">
                  <section
                      ref={summaryRef}
                      id="summary"
                      aria-labelledby="summary-heading"
                      className="scroll-mt-24"
                    >
                      <SectionHeader title="Summary" id="summary-heading" isVisible={!!visibleSections.summary} />
                      <div className={`space-y-4 text-gray-700 transition-all duration-500 ease-out ${visibleSections.summary ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {resumeData.summary.map((p, i) => <p key={i}>{p}</p>)}
                      </div>
                  </section>

                  <section
                      ref={experienceRef}
                      id="experience"
                      aria-labelledby="experience-heading"
                      className="mt-16 scroll-mt-24"
                    >
                      <SectionHeader title="Experience" id="experience-heading" isVisible={!!visibleSections.experience} />
                      <div>
                        {resumeData.experience.map((item, index) => (
                          <ExperienceItem 
                            key={item.company} 
                            item={item}
                            index={index}
                            isLast={index === resumeData.experience.length - 1}
                            isOpen={openExperience === item.company}
                            onToggle={() => setOpenExperience(openExperience === item.company ? null : item.company)}
                          />
                        ))}
                      </div>
                  </section>

                  <section
                    ref={recognitionRef}
                    id="recognition"
                    aria-labelledby="recognition-heading"
                    className="mt-16 scroll-mt-24"
                  >
                      <SectionHeader title="Innovation & Recognition" id="recognition-heading" isVisible={!!visibleSections.recognition} />
                      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-500 ease-out ${visibleSections.recognition ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                          {resumeData.recognition.map((item, index) => (
                            <AnimatedRecognitionCard key={index} item={item} index={index} onPatentClick={() => setSelectedPatent(item)} />
                          ))}
                      </div>
                  </section>
                  
                  <section
                      ref={educationRef}
                      id="education"
                      aria-labelledby="education-heading"
                      className="mt-16 scroll-mt-24"
                    >
                        <SectionHeader title="Education" id="education-heading" isVisible={!!visibleSections.education} />
                        <div className={`transition-all duration-500 ease-out ${visibleSections.education ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <h3 className="font-bold text-lg text-gray-800">{resumeData.education.institution} | <span className="font-medium">{resumeData.education.degree}</span></h3>
                            <div className="text-gray-600 mt-1">
                                {resumeData.education.details.map((detail, index) => (
                                    <p key={index}>{detail}</p>
                                ))}
                            </div>
                        </div>
                  </section>
                </main>
            </div>
          </div>
        </div>
      </div>
      <PatentModal patent={selectedPatent} onClose={() => setSelectedPatent(null)} />
    </>
  );
}
