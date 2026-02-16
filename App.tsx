
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, AlgorithmType } from './types';
import { ISLANDS, LOADING_TIPS } from './constants';
import MapCanvas from './components/MapCanvas';
import QuestModal from './components/QuestModal';
import { generateBossIntro } from './services/geminiService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [view, setView] = useState<'home' | 'game' | 'victory'>('home');
  const [gameState, setGameState] = useState<GameState>({
    currentIslandIndex: -1,
    playerPos: { x: ISLANDS[0].x, y: ISLANDS[0].y },
    isMoving: false,
    score: 0,
    unlockedIslands: 0,
    completed: false
  });
  const [activeIsland, setActiveIsland] = useState<number | null>(null);
  const [bossIntro, setBossIntro] = useState<string>("");

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % LOADING_TIPS.length);
    }, 4000);
    
    const timeout = setTimeout(() => {
      setLoading(false);
      clearInterval(tipInterval);
    }, 3000);

    return () => {
      clearInterval(tipInterval);
      clearTimeout(timeout);
    };
  }, []);

  const movePlayer = useCallback((targetIndex: number) => {
    if (targetIndex !== gameState.unlockedIslands) return;
    
    setGameState(prev => ({ ...prev, isMoving: true }));
    const target = ISLANDS[targetIndex];
    
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        playerPos: { x: target.x, y: target.y },
        isMoving: false
      }));
      setActiveIsland(targetIndex);
      
      if (target.topic === AlgorithmType.FINAL_BOSS) {
        generateBossIntro("searching and sorting algorithms").then(setBossIntro);
      }
    }, 800);
  }, [gameState.unlockedIslands]);

  const handleIslandComplete = () => {
    const nextIsland = gameState.unlockedIslands + 1;
    setGameState(prev => ({
      ...prev,
      unlockedIslands: nextIsland,
      score: prev.score + 100
    }));
    setActiveIsland(null);

    if (nextIsland >= ISLANDS.length) {
      setView('victory');
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-sky-100 flex flex-col items-center justify-center p-8 text-center">
        <div className="animate-bounce mb-8">
          <svg className="w-16 h-16 md:w-24 md:h-24 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
          </svg>
        </div>
        <h1 className="text-2xl md:text-4xl font-pirate text-emerald-800 mb-4">Navigating Neverland...</h1>
        <div className="max-w-md bg-white p-6 rounded-2xl shadow-xl border-t-4 border-emerald-500">
          <p className="text-emerald-600 font-bold uppercase text-[10px] md:text-xs tracking-widest mb-2">Algorithm Tip</p>
          <p className="text-sm md:text-lg text-gray-700 italic">"{LOADING_TIPS[tipIndex]}"</p>
        </div>
      </div>
    );
  }

  if (view === 'home') {
    return (
      <div className="h-screen w-screen bg-[url('https://picsum.photos/id/1015/1920/1080')] bg-cover flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-2xl max-w-2xl w-full border-4 md:border-8 border-emerald-100 text-center overflow-y-auto max-h-[90vh]">
          <h1 className="text-3xl md:text-5xl font-pirate text-emerald-900 mb-4 md:mb-6">The Great Buried Treasure Search</h1>
          <p className="text-base md:text-xl text-gray-700 mb-6 md:mb-8 leading-relaxed">
            Help Peter Pan navigate Neverland! Master <span className="font-bold text-emerald-700">Searching</span> and <span className="font-bold text-emerald-700">Sorting</span> to defeat Captain Hook.
          </p>
          
          <div className="bg-emerald-50 p-4 md:p-6 rounded-xl mb-6 md:mb-8 text-left border-l-4 border-emerald-500">
            <h2 className="font-bold text-emerald-800 mb-2">How to Play:</h2>
            <ul className="list-disc list-inside text-sm md:text-base text-gray-700 space-y-1">
              <li>Click the next <span className="text-yellow-600 font-bold">Gold Island</span>.</li>
              <li>Solve 3 challenges to progress.</li>
              <li>Learn algorithms through story clues.</li>
              <li>Defeat Captain Hook at the end!</li>
            </ul>
          </div>

          <button 
            onClick={() => setView('game')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 md:px-12 py-3 md:py-4 rounded-full text-xl md:text-2xl font-pirate shadow-2xl transform transition hover:scale-105 active:scale-95"
          >
            Start Quest!
          </button>
        </div>
      </div>
    );
  }

  if (view === 'victory') {
    return (
      <div className="h-screen w-screen bg-yellow-400 flex flex-col items-center justify-center text-center p-4 overflow-y-auto">
        <div className="max-w-3xl bg-white p-6 md:p-12 rounded-3xl shadow-2xl border-4 md:border-8 border-yellow-200">
          <div className="text-6xl md:text-8xl mb-4 md:mb-6">💰👑🏝️</div>
          <h1 className="text-4xl md:text-6xl font-pirate text-emerald-900 mb-4">Victory!</h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
            "Hook is in the water, the Crocodile is happy, and Neverland's secrets are sorted!"
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-8">
            {ISLANDS.map(island => (
              <div key={island.id} className="p-2 md:p-3 bg-emerald-50 rounded-lg">
                <div className="text-xl md:text-2xl">{island.icon}</div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase mt-1 leading-tight">{island.topic}</p>
              </div>
            ))}
          </div>
          <p className="text-2xl md:text-3xl font-bold text-emerald-600 mb-8">Score: {gameState.score}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 md:px-10 py-3 rounded-full font-bold text-lg md:text-xl"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-sky-200">
      {/* HUD */}
      <div className="bg-emerald-800 text-white p-3 md:p-4 flex justify-between items-center shadow-lg z-10 shrink-0">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-full flex items-center justify-center text-xl md:text-2xl border-2 border-emerald-400">
            👦
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest leading-none mb-1">Adventurer</p>
            <h2 className="text-lg md:text-xl font-pirate leading-none">Peter Pan</h2>
          </div>
        </div>
        <div className="flex gap-4 md:gap-8">
          <div className="text-center">
            <p className="text-[10px] font-bold text-emerald-300 uppercase leading-none mb-1">Islands</p>
            <p className="text-base md:text-xl font-pirate leading-none">{gameState.unlockedIslands}/{ISLANDS.length}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-emerald-300 uppercase leading-none mb-1">Score</p>
            <p className="text-base md:text-xl font-pirate leading-none">{gameState.score}</p>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 relative flex items-center justify-center bg-sky-900 overflow-hidden">
        <MapCanvas 
          gameState={gameState} 
          onIslandClick={movePlayer} 
        />
        
        {gameState.isMoving && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none z-20">
            <div className="bg-white/90 px-6 py-3 rounded-full font-bold text-emerald-800 animate-pulse shadow-2xl border-2 border-emerald-500 text-sm md:text-base">
              Flying to next adventure... ✨
            </div>
          </div>
        )}
      </div>

      {/* Challenge Modal */}
      {activeIsland !== null && (
        <QuestModal 
          island={{
            ...ISLANDS[activeIsland],
            storyBefore: activeIsland === ISLANDS.length - 1 ? (bossIntro || ISLANDS[activeIsland].storyBefore) : ISLANDS[activeIsland].storyBefore
          }}
          onComplete={handleIslandComplete}
          onClose={() => setActiveIsland(null)}
        />
      )}

      {/* Footer / Controls */}
      <div className="bg-white/50 p-2 text-center text-[10px] md:text-xs text-gray-700 italic shrink-0">
        "Second star to the right, and straight on 'til morning!"
      </div>
    </div>
  );
};

export default App;
