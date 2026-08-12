import { FrameworkInfo, BenchmarkOpInfo, QuizQuestion } from '../types';

export const BENCHMARK_OPERATIONS: BenchmarkOpInfo[] = [
  {
    id: 'initialRender100',
    name: 'Initial Render (100 Tasks)',
    description: 'Measure time taken to render 100 tasks from an empty DOM state.',
    iconName: 'Play',
  },
  {
    id: 'initialRender500',
    name: 'Initial Render (500 Tasks)',
    description: 'Measure time taken to render 500 tasks from an empty DOM state.',
    iconName: 'Play',
  },
  {
    id: 'initialRender1000',
    name: 'Initial Render (1,000 Tasks)',
    description: 'Measure time taken to render 1,000 tasks from an empty DOM state.',
    iconName: 'Play',
  },
  {
    id: 'update50',
    name: 'DOM Updates (50 Tasks)',
    description: 'Measure time taken to update 50 existing tasks in place.',
    iconName: 'Edit3',
  },
  {
    id: 'delete50',
    name: 'DOM Deletion (50 Tasks)',
    description: 'Measure time taken to delete 50 tasks from the DOM.',
    iconName: 'Trash2',
  },
  {
    id: 'add1000',
    name: 'Append Tasks (1,000)',
    description: 'Append 1,000 new tasks to an existing DOM task list.',
    iconName: 'Plus',
  },
  {
    id: 'updateEvery10th',
    name: 'Selective Update (10th)',
    description: 'Update task name and priority for every 10th item in place.',
    iconName: 'RefreshCw',
  },
  {
    id: 'swapRows',
    name: 'Swap Rows (#1 & #10)',
    description: 'Swap positions of row 1 and row 10 in the list.',
    iconName: 'ArrowUpRight',
  },
  {
    id: 'removeHalf',
    name: 'Delete High Priority',
    description: 'Filter and remove all high priority tasks from the DOM.',
    iconName: 'Filter',
  },
  {
    id: 'clearAll',
    name: 'Clear All Tasks',
    description: 'Remove all task elements from the DOM in a single pass.',
    iconName: 'Trash2',
  },
];

export const FRAMEWORKS: Record<string, FrameworkInfo> = {
  react: {
    id: 'react',
    name: 'React',
    version: '19.0',
    tagline: 'Declarative, Component-Based UI with Virtual DOM Reconciliation',
    architecture: 'Virtual DOM (VDOM) Tree Diffing & Reconciliation',
    domStrategy: 'Constructs in-memory JavaScript VNode trees on state change, computes visual tree diffs via Fiber engine, and batch-applies minimal imperative DOM mutations.',
    color: 'sky',
    badgeBg: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
    badgeText: 'text-sky-600 dark:text-sky-400',
    borderAccent: 'border-sky-500',
    logoSvg: `<svg viewBox="0 0 100 100" class="w-6 h-6 fill-sky-500"><circle cx="50" cy="50" r="10"/><ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="currentColor" stroke-width="4"/><ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="currentColor" stroke-width="4" transform="rotate(60 50 50)"/><ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="currentColor" stroke-width="4" transform="rotate(120 50 50)"/></svg>`,
    description: 'React uses an in-memory Virtual DOM tree representation. When component state changes, React re-executes component functions to construct a new Fiber tree, diffs it against the old Fiber tree using key matching heuristics, and flushes DOM patches in a single batched commit phase.',
    pros: [
      'Declarative state paradigm makes complex component composition predictable',
      'Fiber engine supports async time-slicing and concurrency (useTransition)',
      'Keyed list reconciliation minimizes unneeded node creation during reorders',
    ],
    cons: [
      'Garbage collection overhead from temporary VNode object allocation during large re-renders',
      'Requires explicit memoization (useMemo, React.memo) to prevent child component re-renders',
      'Virtual DOM diffing incurs CPU scripting time before DOM mutations occur',
    ],
    codeSnippets: {
      todoComponent: {
        title: 'React 19 - Component & State Setup',
        language: 'tsx',
        code: `import React, { useState, useCallback } from 'react';

export interface Task {
  id: string;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export function ReactTodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

  // Add new task with immutable state array update
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      name,
      priority,
      completed: false,
    };
    setTasks(prev => [newTask, ...prev]);
    setName('');
  };

  return (
    <div className="todo-app">
      <TaskForm name={name} setName={setName} priority={priority} setPriority={setPriority} onSubmit={addTask} />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}`,
        explanation: 'State in React is immutable. Updates create new array references (`setTasks(prev => [...])`), triggering a re-render phase where React compares VNode structures.',
      },
      templateView: {
        title: 'React 19 - List Rendering & Key Optimization',
        language: 'tsx',
        code: `// Key prop ensures Fiber reconciliation reuses existing DOM nodes instead of re-creating them
export const TaskList = React.memo(({ tasks, setTasks }: TaskListProps) => {
  const togglePriority = (id: string, newPriority: Priority) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, priority: newPriority } : task
    ));
  };

  const removeTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id} className={\`task-item \${task.priority.toLowerCase()}\`}>
          <span>{task.name}</span>
          <select 
            value={task.priority} 
            onChange={(e) => togglePriority(task.id, e.target.value as Priority)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button onClick={() => removeTask(task.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
});`,
        explanation: 'The `key={task.id}` attribute is crucial for React’s DOM diffing algorithm. It maps Fiber nodes directly to DOM elements so reordering or deleting items updates the DOM efficiently without recreating unchanged list items.',
      },
      stateAndOperations: {
        title: 'React 19 - Batch DOM Operations Engine',
        language: 'tsx',
        code: `// High-volume batch update using React 19 State Batching
const updateEvery10thTask = () => {
  setTasks(prev => prev.map((task, index) => {
    if (index % 10 === 0) {
      return { 
        ...task, 
        priority: task.priority === 'High' ? 'Low' : 'High',
        name: \`\${task.name} (Updated)\` 
      };
    }
    return task;
  }));
};

// Row swapping in VDOM
const swapFirstAndTenth = () => {
  setTasks(prev => {
    if (prev.length < 10) return prev;
    const next = [...prev];
    const temp = next[0];
    next[0] = next[9];
    next[9] = temp;
    return next;
  });
};`,
        explanation: 'React batches multiple state updates into a single re-render cycle. When swapping array elements, React uses the unique `key` to call `insertBefore` or `swap` directly in the DOM commit phase.',
      },
      domOptimization: {
        title: 'React - DOM Optimization Insights',
        language: 'markdown',
        code: `### React DOM Engine Mechanics
1. **Reconciliation Phase**: Executes component tree to build new Virtual DOM (Fiber).
2. **Diffing**: Compares new Fiber tree with current Fiber tree by key & type.
3. **Commit Phase**: Applies computed DOM patches (e.g. \`node.insertBefore\`, \`node.textContent = ...\`) inside a single DOM write phase.
4. **Optimization Tip**: Wrap item rows in \`React.memo\` to bypass re-executing unchanged rows when parent state changes.`,
        explanation: 'React separates the rendering calculation (VDOM diffing) from the browser DOM mutation phase.',
      },
    },
    keyMechanisms: [
      {
        title: 'Fiber Tree Diffing',
        description: 'React represents the component tree as linked Fiber nodes, processing updates in units of work.',
      },
      {
        title: 'Keyed List Reconciliation',
        description: 'Uses task IDs to track item identity, avoiding complete DOM re-creation during array mutations.',
      },
      {
        title: 'Synthetic Event System',
        description: 'Delegates DOM events to root wrapper, reducing individual event listener memory footprint.',
      },
    ],
  },
  angular: {
    id: 'angular',
    name: 'Angular',
    version: '18/19',
    tagline: 'Enterprise Full-Featured Framework with Ivy Engine & Signals',
    architecture: 'Ivy LView Directives, Change Detection & Signals',
    domStrategy: 'Compiles HTML templates into imperative LView instruction instructions. Uses zone-based dirty checking or Signal-driven reactive graph to patch exact template DOM bindings.',
    color: 'red',
    badgeBg: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    badgeText: 'text-red-600 dark:text-red-400',
    borderAccent: 'border-red-500',
    logoSvg: `<svg viewBox="0 0 100 100" class="w-6 h-6 fill-red-500"><polygon points="50,5 95,25 85,80 50,95 15,80 5,25"/><polygon points="50,15 80,30 72,72 50,83 28,72 20,30" fill="#fff" opacity="0.3"/></svg>`,
    description: 'Angular uses the Ivy compiler to generate linear instruction sets (LViews) for each template component. With Modern Angular Signals (`signal()`), template bindings react directly to state changes, triggering change detection only for affected DOM nodes without needing full Virtual DOM trees.',
    pros: [
      'Ivy instruction engine eliminates Virtual DOM object allocation during re-renders',
      'Angular Signals provide fine-grained reactivity directly to DOM text nodes & bindings',
      'Built-in structural directives (`@for`, `@if`) feature built-in tracking heuristics (`track task.id`)',
    ],
    cons: [
      'Zone.js overhead in traditional Angular apps checks entire component tree unless OnPush or Signals are used',
      'Larger baseline bundle size due to extensive built-in framework utilities',
      'Template compilation requires Ahead-Of-Time (AOT) toolchain step',
    ],
    codeSnippets: {
      todoComponent: {
        title: 'Angular - Component Class & Signals',
        language: 'typescript',
        code: `import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Task {
  id: string;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent {
  // Angular Signal holding tasks state array
  tasks: WritableSignal<Task[]> = signal<Task[]>([]);
  taskName = signal('');
  taskPriority = signal<'High' | 'Medium' | 'Low'>('Medium');

  addTask() {
    if (!this.taskName().trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      name: this.taskName(),
      priority: this.taskPriority(),
      completed: false
    };
    this.tasks.update(current => [newTask, ...current]);
    this.taskName.set('');
  }
}`,
        explanation: 'Angular Signals (`signal()`) create reactive state containers. Updating `this.tasks.update()` immediately flags dependent template DOM instructions as dirty.',
      },
      templateView: {
        title: 'Angular - Control Flow Template (@for, @if)',
        language: 'html',
        code: `<!-- Angular 17+ Modern Control Flow with Built-in Tracking -->
<div className="task-form">
  <input [(ngModel)]="taskName" placeholder="Enter task name..." />
  <select [(ngModel)]="taskPriority">
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  </select>
  <button (click)="addTask()">Add Task</button>
</div>

<ul class="task-list">
  @for (task of tasks(); track task.id) {
    <li class="task-item" [class]="task.priority.toLowerCase()">
      <span>{{ task.name }}</span>
      <select [ngModel]="task.priority" (ngModelChange)="updatePriority(task.id, $event)">
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button (click)="removeTask(task.id)">Remove</button>
    </li>
  } @empty {
    <p class="empty-state">No tasks available.</p>
  }
</ul>`,
        explanation: 'Angular’s `@for` control flow directive uses `track task.id` to map data items to DOM nodes directly in the LView node store, avoiding DOM re-creations.',
      },
      stateAndOperations: {
        title: 'Angular - DOM Updates & Binding Mutations',
        language: 'typescript',
        code: `// Selective update on Signal array
updateEvery10th() {
  this.tasks.update(list => 
    list.map((task, idx) => {
      if (idx % 10 === 0) {
        return { 
          ...task, 
          priority: task.priority === 'High' ? 'Low' : 'High',
          name: task.name + ' (Updated)'
        };
      }
      return task;
    })
  );
}

// Remove item with Signal
removeTask(id: string) {
  this.tasks.update(list => list.filter(t => t.id !== id));
}

// Swap items in place
swapRows() {
  this.tasks.update(list => {
    if (list.length < 10) return list;
    const arr = [...list];
    [arr[0], arr[9]] = [arr[9], arr[0]];
    return arr;
  });
}`,
        explanation: 'When a signal updates, Angular executes Ivy template instructions that update specific element properties (`elementProperty` directive) without diffing unrelated DOM subtrees.',
      },
      domOptimization: {
        title: 'Angular - Ivy Engine Optimization',
        language: 'markdown',
        code: `### Angular Ivy Engine Mechanics
1. **LView Storage**: Each component template compiles into an array of DOM references and binding metadata (LView).
2. **Incremental Instructions**: Directives execute linear instructions like \`textBinding(0, task.name)\` during change detection pass.
3. **Tracking**: \`track task.id\` ensures Angular reorders DOM child nodes directly in the container view list without re-rendering node structures.`,
        explanation: 'Angular Ivy compiles templates into executable JavaScript instructions that directly mutate target DOM nodes.',
      },
    },
    keyMechanisms: [
      {
        title: 'Ivy LView Direct Instructions',
        description: 'Template is compiled into static instruction arrays, eliminating dynamic Virtual DOM allocations.',
      },
      {
        title: 'Angular Signals Graph',
        description: 'Tracks state dependencies finely, notifying only affected template expressions for targeted updates.',
      },
      {
        title: 'TrackBy & Track Control Flow',
        description: 'Links DOM elements to data identities for efficient list element movement and DOM reuse.',
      },
    ],
  },
  vue: {
    id: 'vue',
    name: 'Vue',
    version: '3.5',
    tagline: 'Progressive Framework with Fine-Grained Reactive Proxy Engine',
    architecture: 'Reactive Proxy Tracking + Compiler Block Tree Optimization',
    domStrategy: 'Combines transparent ES6 Proxy reactivity with compiler-analyzed Block Trees. Dynamic template parts are tracked in flat arrays, bypassing static DOM nodes during reconciliation.',
    color: 'emerald',
    badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    borderAccent: 'border-emerald-500',
    logoSvg: `<svg viewBox="0 0 100 100" class="w-6 h-6 fill-emerald-500"><path d="M50 85 L90 15 L70 15 L50 50 L30 15 L10 15 Z"/><path d="M50 65 L75 20 L62 20 L50 42 L38 20 L25 20 Z" fill="#34495e"/></svg>`,
    description: 'Vue 3 uses ES6 Proxies (`ref`, `reactive`) to intercept reads/writes. Its template compiler performs static analysis to create "Block Trees", categorizing template nodes as static or dynamic. During updates, Vue diffs *only* dynamic bindings, ignoring static markup completely.',
    pros: [
      'Compiler-informed Virtual DOM ignores static elements, speeding up diffing significantly',
      'Transparent Proxy reactivity eliminates explicit setState or signal getters in code',
      'Extremely efficient memory usage and fast initial mount times',
    ],
    cons: [
      'Proxy wrapper creation has a slight initial memory footprint for thousands of reactive objects',
      'Reassignment of reactive objects requires careful handling (`ref` vs `reactive`)',
      'Requires template compiler step for optimal block tree optimizations',
    ],
    codeSnippets: {
      todoComponent: {
        title: 'Vue 3 - Composition API (<script setup>)',
        language: 'vue',
        code: `<script setup lang="ts">
import { ref, reactive } from 'vue';

export interface Task {
  id: string;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

// Reactive state containers using Vue 3 Composition API
const tasks = ref<Task[]>([]);
const newTaskName = ref('');
const newTaskPriority = ref<'High' | 'Medium' | 'Low'>('Medium');

const addTask = () => {
  if (!newTaskName.value.trim()) return;
  tasks.value.unshift({
    id: crypto.randomUUID(),
    name: newTaskName.value,
    priority: newTaskPriority.value,
    completed: false,
  });
  newTaskName.value = '';
};
</script>`,
        explanation: 'In Vue 3, `ref()` creates a reactive wrapper. Mutating `tasks.value.unshift(...)` automatically triggers dynamic DOM updates registered in Vue’s dependency graph.',
      },
      templateView: {
        title: 'Vue 3 - Dynamic Template Directives (v-for, v-model)',
        language: 'vue',
        code: `<template>
  <div class="todo-app">
    <form @submit.prevent="addTask" class="task-form">
      <input v-model="newTaskName" placeholder="Task description..." />
      <select v-model="newTaskPriority">
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
      <button type="submit">Add Task</button>
    </form>

    <ul class="task-list">
      <!-- Key binding enables Vue's fast keyed array diffing -->
      <li 
        v-for="task in tasks" 
        :key="task.id" 
        :class="['task-item', task.priority.toLowerCase()]"
      >
        <span>{{ task.name }}</span>
        <select v-model="task.priority">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button @click="removeTask(task.id)">Remove</button>
      </li>
    </ul>
  </div>
</template>`,
        explanation: 'Vue’s `v-model` establishes reactive two-way data binding. The compiler marks `{{ task.name }}` and `:class` as dynamic flags, bypassing all static DOM tags during patch cycles.',
      },
      stateAndOperations: {
        title: 'Vue 3 - Array Mutation & Reactive Patches',
        language: 'ts',
        code: `// Selective update directly mutates array items
const updateEvery10th = () => {
  tasks.value.forEach((task, index) => {
    if (index % 10 === 0) {
      task.priority = task.priority === 'High' ? 'Low' : 'High';
      task.name += ' (Updated)';
    }
  });
};

const removeTask = (id: string) => {
  tasks.value = tasks.value.filter(t => t.id !== id);
};

const swapRows = () => {
  if (tasks.value.length >= 10) {
    const temp = tasks.value[0];
    tasks.value[0] = tasks.value[9];
    tasks.value[9] = temp;
  }
};`,
        explanation: 'Because Vue tracks mutations through reactive Proxies, modifying properties directly on `task` triggers targeted DOM updates without needing immutable copies.',
      },
      domOptimization: {
        title: 'Vue 3 - Compiler Block Tree Mechanics',
        language: 'markdown',
        code: `### Vue 3 Block Tree & Patch Flags
1. **Block Analysis**: Template is parsed into blocks; dynamic nodes are stored in a flat array \`dynamicChildren\`.
2. **Patch Flags**: Specific flags like \`TEXT\` (1) or \`CLASS\` (2) tell Vue exactly what property changed on a node.
3. **Direct Patching**: Re-rendering loops *only* through the flat dynamic array, skipping all unchangeable static tags.`,
        explanation: 'Vue combines compiler static analysis with virtual DOM diffing to eliminate static DOM inspection runtime cost.',
      },
    },
    keyMechanisms: [
      {
        title: 'Compiler Block Trees',
        description: 'Separates static markup from dynamic bindings, allowing Vue to skip 80%+ of VDOM node comparisons.',
      },
      {
        title: 'ES6 Proxy Reactivity Engine',
        description: 'Tracks exact data properties accessed during rendering, triggering updates strictly when those properties change.',
      },
      {
        title: 'Patch Flags Optimization',
        description: 'Encodes element mutation types (text, class, style) into bitwise flags for zero-overhead property updates.',
      },
    ],
  },
  svelte: {
    id: 'svelte',
    name: 'Svelte',
    version: '5.0',
    tagline: 'Compile-Time Cybernetically Enhanced Framework without Virtual DOM',
    architecture: 'Compile-Time Direct Imperative DOM Mutations',
    domStrategy: 'Compiles components into minimal, highly optimized JavaScript code that directly updates DOM nodes when state changes. Operates with ZERO Virtual DOM runtime overhead.',
    color: 'amber',
    badgeBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    badgeText: 'text-amber-600 dark:text-amber-400',
    borderAccent: 'border-amber-500',
    logoSvg: `<svg viewBox="0 0 100 100" class="w-6 h-6 fill-amber-500"><path d="M75 20 C60 10, 30 10, 20 25 C10 40, 20 55, 45 60 C70 65, 80 80, 70 90 C60 100, 30 100, 15 85 L25 72 C35 82, 55 82, 60 75 C65 68, 55 58, 35 52 C15 46, 5 30, 15 15 C25 0, 60 0, 75 10 Z"/></svg>`,
    description: 'Svelte shifts framework work from the browser runtime into the build step. Instead of using a Virtual DOM at runtime, Svelte compiles declarative HTML templates into surgically precise JavaScript code that manipulates DOM elements directly (`node.textContent = ...`, `parent.insertBefore(...)`).',
    pros: [
      'Zero Virtual DOM overhead — updates translate directly into native micro DOM operations',
      'Smallest runtime footprint and ultra-fast initial render speed',
      'Concise component syntax with intuitive `$state` runes or `$:` reactive assignments',
    ],
    cons: [
      'Component output size scales linearly with template complexity (compiled JS per component)',
      'Ecosystem is smaller compared to React/Angular',
      'Requires Svelte compilation step in build tools',
    ],
    codeSnippets: {
      todoComponent: {
        title: 'Svelte 5 - Component & Runes Setup',
        language: 'svelte',
        code: `<script lang="ts">
export interface Task {
  id: string;
  name: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

// Svelte 5 Runes for reactive state
let tasks = $state<Task[]>([]);
let name = $state('');
let priority = $state<'High' | 'Medium' | 'Low'>('Medium');

function addTask() {
  if (!name.trim()) return;
  tasks.unshift({
    id: crypto.randomUUID(),
    name,
    priority,
    completed: false
  });
  name = '';
}
</script>`,
        explanation: 'Svelte 5 uses `$state()` runes. When `tasks.unshift()` runs, the compiled Svelte runtime knows exactly which DOM nodes depend on `tasks` and updates them directly.',
      },
      templateView: {
        title: 'Svelte 5 - Block Syntax ({#each}) & Bindings',
        language: 'svelte',
        code: `<div class="todo-app">
  <form onsubmit={preventDefault(addTask)} class="task-form">
    <input bind:value={name} placeholder="Add new task..." />
    <select bind:value={priority}>
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
    <button type="submit">Add Task</button>
  </form>

  <ul class="task-list">
    <!-- Keyed each block ensures precise DOM node reordering -->
    {#each tasks as task (task.id)}
      <li class="task-item {task.priority.toLowerCase()}">
        <span>{task.name}</span>
        <select bind:value={task.priority}>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button onclick={() => removeTask(task.id)}>Remove</button>
      </li>
    {:else}
      <p class="empty">No tasks in list.</p>
    {/each}
  </ul>
</div>`,
        explanation: 'Svelte compiles `{#each tasks as task (task.id)}` into imperative DOM loops that manage node fragments (`create_fragment`, `update_fragment`, `destroy_fragment`) directly.',
      },
      stateAndOperations: {
        title: 'Svelte 5 - Imperative DOM Updates',
        language: 'ts',
        code: `// Updating item priority directly mutates task property
function updateEvery10th() {
  tasks.forEach((task, idx) => {
    if (idx % 10 === 0) {
      task.priority = task.priority === 'High' ? 'Low' : 'High';
      task.name += ' (Updated)';
    }
  });
}

function removeTask(id: string) {
  tasks = tasks.filter(t => t.id !== id);
}

function swapRows() {
  if (tasks.length >= 10) {
    const temp = tasks[0];
    tasks[0] = tasks[9];
    tasks[9] = temp;
  }
}`,
        explanation: 'When properties change, Svelte calls generated update functions like `set_data(text_node, new_value)` directly on native browser DOM nodes.',
      },
      domOptimization: {
        title: 'Svelte - Compiled DOM Mutations',
        language: 'markdown',
        code: `### Svelte Compile-Time DOM Engine
1. **Compilation Step**: Component compiler generates pure JS DOM creation (\`document.createElement\`) and update instructions.
2. **Zero Diffing**: No Virtual DOM trees are created, compared, or discarded in RAM.
3. **Direct Updates**: State updates directly execute browser API calls like \`element.textContent = ...\` with 0ms framework reconciliation latency.`,
        explanation: 'Svelte completely bypasses Virtual DOM diffing by compiling updates into native browser micro-operations.',
      },
    },
    keyMechanisms: [
      {
        title: 'Zero Virtual DOM Runtime',
        description: 'Eliminates VDOM diffing overhead by compiling template declarations into direct DOM JavaScript statements.',
      },
      {
        title: 'Svelte Runes & Signals Compiler',
        description: 'Svelte 5 `$state()` generates fine-grained DOM subscriber bindings at build time.',
      },
      {
        title: 'Direct Fragment Management',
        description: 'Keyed list blocks map data arrays to browser DOM Fragment arrays with direct DOM node insertion/removal.',
      },
    ],
  },
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the primary architectural difference between React and Svelte when updating the DOM?',
    options: [
      'React compiles to WebAssembly while Svelte compiles to Web Components.',
      'React constructs in-memory Virtual DOM trees and diffs them at runtime, whereas Svelte compiles templates into direct imperative DOM mutations.',
      'Svelte uses Shadow DOM exclusively while React uses standard HTML DOM.',
      'React updates the DOM synchronously while Svelte uses web workers for DOM rendering.',
    ],
    correctIndex: 1,
    explanation: 'React uses runtime Virtual DOM reconciliation (Fiber engine) to compute DOM diffs. Svelte eliminates the Virtual DOM entirely by compiling template updates into direct browser DOM manipulation calls at build time.',
  },
  {
    id: 2,
    question: 'Why is specifying a unique key (`key={task.id}` or `@for (...; track task.id)`) crucial when rendering dynamic lists in front-end frameworks?',
    options: [
      'Keys are required by CSS selectors to apply background colors.',
      'Keys allow frameworks to map data items to existing DOM nodes, enabling node reuse and proper reordering without re-creating unchanged DOM elements.',
      'Keys automatically prevent memory leaks by clearing local storage.',
      'Keys compress HTML strings sent to the browser.',
    ],
    correctIndex: 1,
    explanation: 'Without keys, when an array is reordered or filtered, frameworks are forced to mutate or recreate every item node in sequence. Keys allow framework reconciliation algorithms to identify existing DOM nodes and swap/reorder them efficiently.',
  },
  {
    id: 3,
    question: 'How does Vue 3 achieve faster reconciliation times compared to traditional Virtual DOM algorithms?',
    options: [
      'Vue 3 converts all templates to canvas drawing commands.',
      'Vue 3 uses Compiler Block Trees and Patch Flags to separate static DOM markup from dynamic bindings, diffing ONLY dynamic nodes during re-renders.',
      'Vue 3 disables change detection for lists with over 1,000 items.',
      'Vue 3 runs DOM reconciliation on a remote server.',
    ],
    correctIndex: 1,
    explanation: 'Vue 3’s compiler analyzes template structure during compilation and tags dynamic elements with Bitwise Patch Flags. During updates, Vue bypasses static tags and iterates solely over dynamic properties.',
  },
  {
    id: 4,
    question: 'In Angular, how do Signals (`signal()`) and Ivy LViews optimize DOM updates?',
    options: [
      'Signals force a complete page reload on every input change.',
      'Signals establish a fine-grained reactive graph that notifies specific Ivy template binding instructions, patching exact DOM text/property bindings without broad component tree checks.',
      'Ivy LViews create a full Virtual DOM copy for each component instance.',
      'Signals eliminate the need for HTML templates in Angular.',
    ],
    correctIndex: 1,
    explanation: 'Angular Signals create fine-grained reactivity. When a signal updates, Angular executes target Ivy template instructions (LViews) directly on the affected DOM bindings without needing full dirty-checking cycles across unrelated components.',
  },
  {
    id: 5,
    question: 'In a benchmark test with 10,000 tasks, which framework operation typically causes the highest CPU scripting overhead?',
    options: [
      'Directly changing a CSS class name.',
      'Allocating thousands of temporary Virtual DOM object nodes in memory and computing recursive tree diffs before applying DOM patches.',
      'Executing `console.log()` inside a click listener.',
      'Setting `document.title`.',
    ],
    correctIndex: 1,
    explanation: 'Allocating thousands of JavaScript objects (VNodes) and comparing deep object trees places heavy load on the JavaScript engine scripting thread and garbage collector, creating runtime overhead before DOM updates are flushed.',
  },
];
