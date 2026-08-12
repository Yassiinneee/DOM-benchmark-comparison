export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  name: string;
  priority: Priority;
  createdAt: number;
  completed: boolean;
}

export type FrameworkId = 'react' | 'angular' | 'vue' | 'svelte';

export type BenchmarkOp = 
  | 'initialRender100'
  | 'initialRender500'
  | 'initialRender1000'
  | 'update50'
  | 'delete50'
  | 'initialRender'
  | 'add1000'
  | 'updateEvery10th'
  | 'swapRows'
  | 'removeHalf'
  | 'clearAll';

export interface BenchmarkOpInfo {
  id: BenchmarkOp;
  name: string;
  description: string;
  iconName: string;
}

export interface BenchmarkResult {
  id: string;
  framework: FrameworkId;
  op: BenchmarkOp;
  itemCount: number;
  durationMs: number;
  domMutations: number;
  memoryEstKb: number;
  fps: number;
  timestamp: number;
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

export interface FrameworkInfo {
  id: FrameworkId;
  name: string;
  version: string;
  tagline: string;
  architecture: string;
  domStrategy: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderAccent: string;
  logoSvg: string;
  description: string;
  pros: string[];
  cons: string[];
  codeSnippets: {
    todoComponent: CodeSnippet;
    templateView: CodeSnippet;
    stateAndOperations: CodeSnippet;
    domOptimization: CodeSnippet;
  };
  keyMechanisms: {
    title: string;
    description: string;
  }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
