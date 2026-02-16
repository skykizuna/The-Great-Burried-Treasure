
import React, { useState, useEffect, useRef } from 'react';
import { IslandNode, Question } from '../types';

interface QuestModalProps {
  island: IslandNode;
  onComplete: () => void;
  onClose: () => void;
}

const QuestModal: React.FC<QuestModalProps> = ({ island, onComplete, onClose }) => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'outro'>('intro');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [interactiveData, setInteractiveData] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);

  // Audio refs
  const correctAudio = useRef<HTMLAudioElement | null>(null);
  const incorrectAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload audios
    correctAudio.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'); // Magic Twinkle
    incorrectAudio.current = new Audio('https://www.soundjay.com/human/laugh-evil-1.mp3'); // Hook Laugh
    
    // Lower volume for laugh as it can be loud
    if (incorrectAudio.current) incorrectAudio.current.volume = 0.4;
    if (correctAudio.current) correctAudio.current.volume = 0.5;

    return () => {
      correctAudio.current = null;
      incorrectAudio.current = null;
    };
  }, []);

  useEffect(() => {
    if (island.questions[currentQuestionIdx]?.data) {
      setInteractiveData([...island.questions[currentQuestionIdx].data!]);
    }
    setShowHint(false);
  }, [currentQuestionIdx, island]);

  const playCorrect = () => correctAudio.current?.play().catch(() => {});
  const playIncorrect = () => incorrectAudio.current?.play().catch(() => {});

  const handleOptionClick = (option: string) => {
    const question = island.questions[currentQuestionIdx];
    if (option === question.correctAnswer) {
      setFeedback("Correct! Tinkerbell sparkles with joy!");
      playCorrect();
      setTimeout(() => {
        setFeedback(null);
        if (currentQuestionIdx < island.questions.length - 1) {
          setCurrentQuestionIdx(prev => prev + 1);
        } else {
          setStep('outro');
        }
      }, 1500);
    } else {
      setFeedback("Oops! Captain Hook laughs in the distance. Try again!");
      playIncorrect();
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const handleInteractiveClick = (val: number, idx: number) => {
    const question = island.questions[currentQuestionIdx];
    if (question.type === 'interactive-search') {
      if (val === question.target) {
        setFeedback("You found it! Great searching skills!");
        playCorrect();
        setTimeout(() => {
          setFeedback(null);
          if (currentQuestionIdx < island.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
          } else {
            setStep('outro');
          }
        }, 1500);
      } else {
        setFeedback("Not here! Keep searching...");
        // Minor incorrect sound or just feedback
        setTimeout(() => setFeedback(null), 1000);
      }
    }
  };

  const handleSwap = (i: number, j: number) => {
    const newData = [...interactiveData];
    [newData[i], newData[j]] = [newData[j], newData[i]];
    setInteractiveData(newData);
    
    const question = island.questions[currentQuestionIdx];
    if (JSON.stringify(newData) === JSON.stringify(question.correctAnswer)) {
      setFeedback("The list is perfectly sorted! Amazing!");
      playCorrect();
      setTimeout(() => {
        setFeedback(null);
        if (currentQuestionIdx < island.questions.length - 1) {
          setCurrentQuestionIdx(prev => prev + 1);
        } else {
          setStep('outro');
        }
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 md:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300 border-4 border-emerald-500 max-h-[95vh] overflow-y-auto">
        <div className="bg-emerald-600 p-4 md:p-6 text-white flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-xl md:text-3xl font-pirate flex items-center gap-3">
            <span>{island.icon}</span>
            <span className="truncate">{island.name}</span>
          </h2>
          <button onClick={onClose} className="text-white hover:text-emerald-200 text-3xl transition-colors">&times;</button>
        </div>

        <div className="p-4 md:p-8">
          {step === 'intro' && (
            <div className="space-y-6 text-center">
              <div className="text-5xl md:text-7xl mb-4 animate-bounce">{island.icon}</div>
              <p className="text-lg md:text-xl leading-relaxed text-gray-700 italic font-medium">"{island.storyBefore}"</p>
              <button 
                onClick={() => setStep('quiz')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-lg md:text-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Accept Challenge!
              </button>
            </div>
          )}

          {step === 'quiz' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center text-xs font-bold text-emerald-600 uppercase tracking-widest">
                <span>Challenge {currentQuestionIdx + 1} of {island.questions.length}</span>
                <span className="bg-emerald-100 px-2 py-1 rounded hidden sm:inline">{island.topic}</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
                {island.questions[currentQuestionIdx].text}
              </h3>

              {feedback && (
                <div className={`p-4 rounded-xl text-center font-bold animate-pulse shadow-sm border-2 ${feedback.includes('Correct') || feedback.includes('found') || feedback.includes('sorted') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {feedback}
                </div>
              )}

              <div className="relative">
                {island.questions[currentQuestionIdx].type === 'multiple-choice' && (
                  <div className="grid grid-cols-1 gap-3">
                    {island.questions[currentQuestionIdx].options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionClick(opt)}
                        className="p-4 md:p-5 border-2 border-emerald-50 rounded-xl hover:bg-emerald-50 hover:border-emerald-500 transition-all text-left font-bold text-base md:text-lg shadow-sm hover:shadow-md"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {island.questions[currentQuestionIdx].type === 'interactive-search' && (
                  <div className="flex flex-wrap justify-center gap-2 md:gap-4 py-4 md:py-8">
                    {interactiveData.map((val, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleInteractiveClick(val, idx)}
                        className="w-16 h-16 md:w-20 md:h-20 bg-amber-50 border-4 border-amber-300 rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold hover:bg-amber-100 transform hover:scale-110 transition-all shadow-lg active:scale-95"
                      >
                        🎁
                      </button>
                    ))}
                  </div>
                )}

                {island.questions[currentQuestionIdx].type === 'interactive-sort' && (
                  <div className="space-y-4 md:space-y-8 py-4 md:py-8 overflow-x-auto">
                    <div className="flex justify-center gap-2 md:gap-4 items-end min-h-[100px] md:min-h-[120px] pb-4">
                      {interactiveData.map((val, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2 md:gap-3">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 border-2 md:border-4 border-blue-400 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-2xl font-black shadow-lg text-blue-900">
                            {val}
                          </div>
                          {idx < interactiveData.length - 1 && (
                            <button 
                              onClick={() => handleSwap(idx, idx + 1)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-black shadow-md transition-colors whitespace-nowrap"
                            >
                              ↔
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-center text-gray-500 italic font-medium text-sm">Swap buttons sort the numbers!</p>
                  </div>
                )}
              </div>

              <div className="mt-4 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 text-center">
                {!showHint ? (
                  <button 
                    onClick={() => setShowHint(true)}
                    className="flex items-center gap-2 mx-auto text-emerald-600 font-bold hover:text-emerald-700 transition-colors text-sm md:text-base"
                  >
                    <span className="text-lg md:text-xl">✨</span> Need a hint?
                  </button>
                ) : (
                  <div className="bg-yellow-50 border-2 border-yellow-200 p-3 md:p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <span className="text-xl md:text-2xl">🧚‍♀️</span>
                    <p className="text-left text-yellow-900 font-medium italic text-sm md:text-base">
                      {island.questions[currentQuestionIdx].hint || "Try your best!"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'outro' && (
            <div className="space-y-6 text-center">
              <div className="text-5xl md:text-7xl mb-4">✨🏴‍☠️✨</div>
              <p className="text-xl md:text-2xl leading-relaxed text-gray-800 font-bold italic">"{island.storyAfter}"</p>
              <button 
                onClick={onComplete}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-lg md:text-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                Onward!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestModal;
