
export enum AlgorithmType {
  LINEAR_SEARCH = 'Linear Search',
  BINARY_SEARCH = 'Binary Search',
  BUBBLE_SORT = 'Bubble Sort',
  SELECTION_SORT = 'Selection Sort',
  FINAL_BOSS = 'The Jolly Roger'
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer: string | number[];
  type: 'multiple-choice' | 'interactive-sort' | 'interactive-search';
  data?: number[];
  target?: number;
  hint?: string;
}

export interface IslandNode {
  id: string;
  name: string;
  topic: AlgorithmType;
  x: number;
  y: number;
  storyBefore: string;
  storyAfter: string;
  questions: Question[];
  icon: string;
}

export interface GameState {
  currentIslandIndex: number;
  playerPos: { x: number; y: number };
  isMoving: boolean;
  score: number;
  unlockedIslands: number;
  completed: boolean;
}
