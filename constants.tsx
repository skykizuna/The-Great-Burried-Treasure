
import { IslandNode, AlgorithmType } from './types';

export const LOADING_TIPS = [
  "Linear Search is like checking every drawer for your socks one by one!",
  "Binary Search is super fast, but it ONLY works on sorted lists.",
  "Bubble Sort works by comparing neighboring items and swapping them.",
  "Selection Sort looks for the smallest item and puts it at the front.",
  "Captain Hook hates organized lists. Sorting is his greatest weakness!",
  "Tinkerbell says: Always look at the middle item in a sorted list for Binary Search."
];

export const ISLANDS: IslandNode[] = [
  {
    id: 'island-1',
    name: 'Lost Woods of Linear',
    topic: AlgorithmType.LINEAR_SEARCH,
    x: 150,
    y: 400,
    icon: '🌳',
    storyBefore: "Welcome to Neverland! Tinkerbell has lost her wand in the thick fog of the Lost Woods. We must check every bush, one by one, to find it!",
    storyAfter: "Great job! By checking each bush sequentially, we found the wand. That's Linear Search in action!",
    questions: [
      {
        id: 'q1-1',
        type: 'multiple-choice',
        text: "In Linear Search, if your item is the very last one in a list of 10, how many items do you check?",
        options: ["1", "5", "10", "None"],
        correctAnswer: "10",
        hint: "Linear search doesn't skip anything! It starts at the beginning and goes until the very end if it has to."
      },
      {
        id: 'q1-2',
        type: 'multiple-choice',
        text: "Does a list need to be sorted for Linear Search to work?",
        options: ["Yes", "No", "Only if it has numbers", "Only on Tuesdays"],
        correctAnswer: "No",
        hint: "Linear search is simple but thorough. It doesn't care about the order; it just checks everything!"
      },
      {
        id: 'q1-3',
        type: 'interactive-search',
        text: "Find the number 42 in this hidden list. Click each box one by one from left to right!",
        data: [12, 5, 89, 42, 7, 21],
        target: 42,
        correctAnswer: "3",
        hint: "Count the boxes starting from 0: box 0, box 1, box 2, box 3..."
      }
    ]
  },
  {
    id: 'island-2',
    name: 'Mermaid Lagoon',
    topic: AlgorithmType.BINARY_SEARCH,
    x: 400,
    y: 200,
    icon: '🧜‍♀️',
    storyBefore: "The Mermaids have organized their pearls by size. They want us to find a specific giant pearl, but the Lagoon is closing soon! We need a faster way than checking one by one.",
    storyAfter: "Amazing! By splitting the search area in half every time, you found the pearl in record time! That's Binary Search.",
    questions: [
      {
        id: 'q2-1',
        type: 'multiple-choice',
        text: "What is the most important requirement for Binary Search?",
        options: ["The list must be sorted", "The list must be small", "The list must be random", "The list must have words"],
        correctAnswer: "The list must be sorted",
        hint: "Think about how you look up a word in a real dictionary. You can only skip pages if you know the letters are in order!"
      },
      {
        id: 'q2-2',
        type: 'multiple-choice',
        text: "If you are searching for 15 in [10, 20, 30], where do you look first in Binary Search?",
        options: ["10", "20", "30", "Ask a mermaid"],
        correctAnswer: "20",
        hint: "Binary Search always starts exactly in the middle of the current range."
      },
      {
        id: 'q2-3',
        type: 'multiple-choice',
        text: "Find the value 72 in this sorted list: [10, 22, 35, 48, 60, 72, 85, 99]. Which is the middle element to check first?",
        options: ["35", "48", "60", "72"],
        correctAnswer: "48",
        hint: "In a list of 8 items, we usually pick the item at index (8/2)-1, which is index 3. Count from zero!"
      }
    ]
  },
  {
    id: 'island-3',
    name: 'Crocodile Creek',
    topic: AlgorithmType.BUBBLE_SORT,
    x: 650,
    y: 450,
    icon: '🐊',
    storyBefore: "The Tick-Tock Crocodile is confused! His collection of clocks is all jumbled. We need to swap neighboring clocks until the smallest ones are at the start.",
    storyAfter: "The clocks are sorted! Like bubbles rising to the surface, the largest clocks 'bubbled' to the end. That's Bubble Sort!",
    questions: [
      {
        id: 'q3-1',
        type: 'multiple-choice',
        text: "How does Bubble Sort compare items?",
        options: ["Compares neighbors", "Compares first and last", "Picks random items", "Asks the Crocodile"],
        correctAnswer: "Compares neighbors",
        hint: "Bubble sort only looks at two items sitting side-by-side at any given time."
      },
      {
        id: 'q3-2',
        type: 'multiple-choice',
        text: "In Bubble Sort, after one full pass, which item is guaranteed to be in its correct place?",
        options: ["The smallest", "The largest", "The middle one", "None of them"],
        correctAnswer: "The largest",
        hint: "Think about a heavy bubble falling or a large value 'floating' to the very end of the list."
      },
      {
        id: 'q3-3',
        type: 'interactive-sort',
        text: "Sort these numbers [5, 2, 8] using Bubble Sort logic (Swap neighbors!).",
        data: [5, 2, 8],
        correctAnswer: [2, 5, 8],
        hint: "Try swapping 5 and 2. Is 8 already in the right spot at the end?"
      }
    ]
  },
  {
    id: 'island-4',
    name: 'Skull Rock',
    topic: AlgorithmType.SELECTION_SORT,
    x: 850,
    y: 250,
    icon: '💀',
    storyBefore: "Captain Hook left his gold coins scattered at Skull Rock. To carry them away, we must pick the smallest coin first, then the next smallest, and so on.",
    storyAfter: "Efficiency at its best! By 'selecting' the minimum each time, you've sorted the gold. This is Selection Sort!",
    questions: [
      {
        id: 'q4-1',
        type: 'multiple-choice',
        text: "What does Selection Sort repeatedly look for in the unsorted part?",
        options: ["The maximum", "The minimum", "The average", "A hidden map"],
        correctAnswer: "The minimum",
        hint: "Selection sort 'selects' the smallest available item to put it at the front."
      },
      {
        id: 'q4-2',
        type: 'multiple-choice',
        text: "Where does Selection Sort place the found minimum value?",
        options: ["At the end", "In the middle", "At the beginning of the unsorted section", "In Hook's pocket"],
        correctAnswer: "At the beginning of the unsorted section",
        hint: "Once you find the smallest coin, you move it to the very first available spot on the left."
      },
      {
        id: 'q4-3',
        type: 'interactive-sort',
        text: "Sort [9, 1, 4] using Selection Sort (Select smallest first!).",
        data: [9, 1, 4],
        correctAnswer: [1, 4, 9],
        hint: "Find the smallest number (1) and swap it with the first number (9)."
      }
    ]
  },
  {
    id: 'island-boss',
    name: 'The Jolly Roger',
    topic: AlgorithmType.FINAL_BOSS,
    x: 1000,
    y: 500,
    icon: '🏴‍☠️',
    storyBefore: "Captain Hook is here! He won't let you have the treasure unless you prove you've mastered the arts of searching and sorting. Ready for the final challenge?",
    storyAfter: "Hook has been defeated! He's walking the plank! The treasure is ours!",
    questions: [
      {
        id: 'qb-1',
        type: 'multiple-choice',
        text: "Which search is faster on a sorted list of 1 million items?",
        options: ["Linear Search", "Binary Search", "Manual Search", "Neither"],
        correctAnswer: "Binary Search",
        hint: "Remember: Linear checks every item (1 million checks), while Binary Search cuts the list in half every time (only about 20 checks)!"
      },
      {
        id: 'qb-2',
        type: 'multiple-choice',
        text: "Which sort swaps adjacent neighbors?",
        options: ["Selection Sort", "Bubble Sort", "Quick Search", "Magic Sort"],
        correctAnswer: "Bubble Sort",
        hint: "Like bubbles rising, they only interact with what is right next to them."
      },
      {
        id: 'qb-3',
        type: 'multiple-choice',
        text: "True or False: Selection sort finds the smallest item in each step.",
        options: ["True", "False"],
        correctAnswer: "True",
        hint: "Selection sort scans the whole unsorted part to find that one 'selected' minimum."
      }
    ]
  }
];
