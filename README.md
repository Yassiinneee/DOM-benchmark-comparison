# Front-End DOM Benchmark Comparison

> A controlled performance laboratory for comparing DOM rendering, updating, and deletion performance across **React, Angular, Vue 3, and Svelte**.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=white)](https://react.dev/)
[![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular\&logoColor=white)](https://angular.dev/)
[![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js\&logoColor=white)](https://vuejs.org/)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte\&logoColor=white)](https://svelte.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite\&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)

---

## Table of Contents

* [Overview](#overview)
* [Objectives](#objectives)
* [Frameworks Compared](#frameworks-compared)
* [Benchmark Scenarios](#benchmark-scenarios)
* [Performance Results](#performance-results)
* [Architecture](#architecture)
* [Repository Structure](#repository-structure)
* [Key Implementation Concepts](#key-implementation-concepts)
* [Getting Started](#getting-started)
* [Running the Benchmarks](#running-the-benchmarks)
* [Interpreting the Results](#interpreting-the-results)
* [Performance Analysis](#performance-analysis)
* [Screenshots and Documentation](#screenshots-and-documentation)
* [Engineering Reflection](#engineering-reflection)
* [Limitations](#limitations)
* [Future Improvements](#future-improvements)
* [Conclusion](#conclusion)
* [Author](#author)
* [License](#license)

---

## Overview

**Front-End DOM Benchmark Comparison** is a comparative performance laboratory designed to investigate how modern front-end frameworks handle intensive DOM workloads.

The project implements equivalent benchmark experiences in:

* **React**
* **Angular**
* **Vue 3**
* **Svelte**

Each implementation provides a consistent workbench for testing DOM-heavy operations while exposing the architectural differences behind each framework's rendering strategy.

The experiment focuses on three practical workload categories:

1. **Initial rendering** of large collections.
2. **In-place DOM updates** affecting multiple existing elements.
3. **DOM deletion** and the resulting element removal workload.

The project is intended to move beyond theoretical framework comparisons by providing an interactive environment where rendering behavior can be measured and analyzed using concrete workloads.

---

## Objectives

The primary objectives of this project are to:

* Compare DOM performance across four major front-end frameworks.
* Measure rendering performance at different workload sizes.
* Evaluate the cost of granular DOM updates.
* Measure element deletion performance.
* Observe memory consumption during large initial renders.
* Connect benchmark results to each framework's rendering architecture.
* Identify workload-specific strengths rather than declaring a single universally superior framework.
* Provide an interactive laboratory for front-end performance analysis.
* Document the optimization techniques used by each framework implementation.

---

## Frameworks Compared

| Framework   | Rendering Model                            | Primary Optimization Approach                                  |
| ----------- | ------------------------------------------ | -------------------------------------------------------------- |
| **React**   | Virtual DOM + Fiber reconciliation         | Keyed reconciliation and controlled component updates          |
| **Angular** | Ivy rendering + reactive change detection  | Signals and optimized change-detection boundaries              |
| **Vue 3**   | Reactive renderer + compiler optimizations | Proxy-based reactivity and dynamic node tracking               |
| **Svelte**  | Compile-time generated DOM operations      | Direct imperative DOM updates with minimal runtime abstraction |

### React

React uses a Virtual DOM and Fiber-based reconciliation architecture. Application state changes are represented as a new render result, which React reconciles against the existing tree before applying the required DOM changes.

The benchmark therefore pays particular attention to the cost of rendering large collections and reconciling changes efficiently.

### Angular

Angular uses its Ivy rendering engine together with a sophisticated reactive and change-detection model.

The implementation considers the importance of limiting unnecessary change detection and uses modern Angular reactive concepts such as Signals where appropriate.

### Vue 3

Vue 3 combines a reactive Proxy system with compiler-assisted rendering optimizations.

Its renderer can identify dynamic portions of a component tree and avoid unnecessary processing of static content, making it particularly relevant for fine-grained update workloads.

### Svelte

Svelte takes a fundamentally different approach by performing substantial optimization during compilation.

Instead of maintaining a runtime Virtual DOM, the compiler generates JavaScript capable of updating the relevant DOM nodes directly. This can significantly reduce runtime rendering overhead.

---

## Benchmark Scenarios

The benchmark suite evaluates three primary scenarios.

### 1. Initial Rendering

The first scenario measures the cost of creating a DOM tree from scratch.

Tested workloads:

* **100 tasks**
* **500 tasks**
* **1,000 tasks**

Metrics recorded:

* Execution time
* Average memory consumption

This scenario is especially useful for evaluating how each framework scales when the number of DOM nodes increases significantly.

---

### 2. DOM Updates

The second scenario measures localized updates to an existing DOM tree.

Workload:

* **50 tasks**
* Priority/status update operation

The objective is to evaluate how efficiently each framework identifies and updates already-rendered elements without unnecessarily recreating unrelated DOM nodes.

---

### 3. DOM Deletion

The third scenario measures the cost of removing existing elements.

Workload:

* **50 task deletions**

This scenario evaluates:

* Element removal
* Renderer overhead
* DOM mutation cost
* Resulting layout/re-flow implications

---

# Performance Results

The benchmark results were generated on **August 11, 2026** and are documented in `Benchmark.txt`.

> **Important:** Benchmark values are environment-dependent. They should be interpreted as measurements of this specific implementation and execution environment, not as universal framework performance rankings.

---

## Initial Rendering

| Framework  |  100 Tasks |   500 Tasks | 1,000 Tasks | Avg. Memory |
| ---------- | ---------: | ----------: | ----------: | ----------: |
| React      |    12.4 ms |     38.6 ms |     82.1 ms |    1,240 KB |
| Angular    |    14.1 ms |     42.8 ms |     89.5 ms |    1,480 KB |
| Vue 3      |     9.8 ms |     29.2 ms |     61.4 ms |      920 KB |
| **Svelte** | **6.2 ms** | **18.5 ms** | **39.8 ms** |  **610 KB** |

### Winner: Svelte

Svelte produced the lowest measured initial-render time at all tested collection sizes and also recorded the lowest average memory usage.

---

## DOM Updates

| Framework | Operation       |   Target |    Duration |
| --------- | --------------- | -------: | ----------: |
| **React** | Update Priority | 50 tasks | **65.8 ms** |
| Angular   | Update Priority | 50 tasks |    176.0 ms |
| Vue 3     | Update Priority | 50 tasks |    115.4 ms |
| Svelte    | Update Priority | 50 tasks |     91.4 ms |

### Winner: React

In the supplied benchmark results, React recorded the shortest duration for the 50-task priority-update workload.

---

## DOM Deletion

| Framework  | Operation    |   Target |    Duration |
| ---------- | ------------ | -------: | ----------: |
| React      | Remove Tasks | 50 tasks |     96.4 ms |
| Angular    | Remove Tasks | 50 tasks |     80.8 ms |
| Vue 3      | Remove Tasks | 50 tasks |     85.2 ms |
| **Svelte** | Remove Tasks | 50 tasks | **48.0 ms** |

### Winner: Svelte

Svelte recorded the lowest deletion duration in the supplied benchmark results.

---

# Overall Benchmark Ranking

### Initial Rendering

**Svelte → Vue 3 → React → Angular**

Svelte achieved the best measured result at the 1,000-item workload with **39.8 ms**.

### DOM Updates

**React → Svelte → Vue 3 → Angular**

React achieved the best measured result with **65.8 ms** for the 50-task update scenario.

### DOM Deletion

**Svelte → Angular → Vue 3 → React**

Svelte achieved the best measured result with **48.0 ms**.

### Overall Interpretation

The results demonstrate that framework performance is **workload-dependent**.

There is no single framework that should be selected solely from one benchmark number.

Initial rendering, granular updates, deletion, memory behavior, application complexity, developer experience, ecosystem maturity, and architectural requirements all influence an appropriate framework decision.

---

# Architecture

The repository intentionally keeps the four implementations as separate applications.

Each framework follows a similar conceptual architecture:

```text
Framework Application
│
├── UI Components
│   ├── Header
│   ├── Framework Workbench
│   ├── Benchmark Suite
│   ├── Interactive Sandbox
│   ├── Architecture Comparison
│   └── Lab Report Modal
│
├── Data Layer
│   └── Framework Performance / Comparison Data
│
├── Benchmark Service
│   └── DOM Benchmark Engine
│
├── Shared Types
│   └── Benchmark / Framework Type Definitions
│
└── Application Entry Point
```

The central idea is to maintain comparable benchmark functionality while allowing each framework to use its native rendering model.

---

# Repository Structure

```text
DOM-benchmark-comparison-main/
│
├── Angular/
│   ├── public/
│   │   ├── Benchmark.txt
│   │   └── Reflection.md
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── architecture-comparison.component.ts
│   │   │   │   ├── benchmark-suite.component.ts
│   │   │   │   ├── framework-workbench.component.ts
│   │   │   │   ├── header.component.ts
│   │   │   │   ├── interactive-sandbox.component.ts
│   │   │   │   └── lab-report-modal.component.ts
│   │   │   │
│   │   │   └── app.component.ts
│   │   │
│   │   ├── data/
│   │   │   └── frameworksData.ts
│   │   │
│   │   ├── services/
│   │   │   └── domBenchmarkEngine.ts
│   │   │
│   │   ├── globals.d.ts
│   │   ├── index.css
│   │   ├── main.ts
│   │   └── types.ts
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── React/
│   ├── public/
│   │   ├── Benchmark.txt
│   │   └── Reflection.md
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArchitectureComparison.tsx
│   │   │   ├── BenchmarkSuite.tsx
│   │   │   ├── FrameworkWorkbench.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── InteractiveSandbox.tsx
│   │   │   └── LabReportModal.tsx
│   │   │
│   │   ├── data/
│   │   │   └── frameworksData.ts
│   │   │
│   │   ├── services/
│   │   │   └── domBenchmarkEngine.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── types.ts
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── Vue/
│   ├── public/
│   │   ├── Benchmark.txt
│   │   └── Reflection.md
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArchitectureComparison.vue
│   │   │   ├── BenchmarkSuite.vue
│   │   │   ├── FrameworkWorkbench.vue
│   │   │   ├── Header.vue
│   │   │   ├── InteractiveSandbox.vue
│   │   │   └── LabReportModal.vue
│   │   │
│   │   ├── data/
│   │   │   └── frameworksData.ts
│   │   │
│   │   ├── services/
│   │   │   └── domBenchmarkEngine.ts
│   │   │
│   │   ├── App.vue
│   │   ├── index.css
│   │   ├── main.ts
│   │   └── types.ts
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── Svelte/
│   ├── public/
│   │   ├── Benchmark.txt
│   │   └── Reflection.md
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArchitectureComparison.svelte
│   │   │   ├── BenchmarkSuite.svelte
│   │   │   ├── FrameworkWorkbench.svelte
│   │   │   ├── Header.svelte
│   │   │   ├── InteractiveSandbox.svelte
│   │   │   └── LabReportModal.svelte
│   │   │
│   │   ├── data/
│   │   │   └── frameworksData.ts
│   │   │
│   │   ├── services/
│   │   │   └── domBenchmarkEngine.ts
│   │   │
│   │   ├── App.svelte
│   │   ├── index.css
│   │   ├── main.ts
│   │   └── types.ts
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── Screenshots/
│   ├── Angular DOM Manipulation.png
│   ├── DOM Manopulation architecture.png
│   ├── DOM deletion 50 tasks.png
│   ├── DOM updates 50 tasks.png
│   ├── Initial rendering 100 tasks.png
│   ├── React DOM Manipulation.png
│   ├── Simultaneous DOM execution.png
│   ├── Svelte DOM Manipulation.png
│   └── Vue DOM Manipulation.png
│
├── Benchmark.txt
└── Reflection.md
```

---

# Key Implementation Concepts

## DOM Benchmark Engine

Each application contains a dedicated:

```text
src/services/domBenchmarkEngine
```

This service centralizes benchmark execution and measurement logic.

Keeping benchmark logic separate from UI components improves:

* Maintainability
* Testability
* Reusability
* Separation of concerns
* Comparability between framework implementations

---

## Framework Workbench

The framework workbench acts as the primary interactive environment for experimenting with DOM operations.

It provides a controlled interface for:

* Rendering task collections
* Updating task properties
* Deleting tasks
* Comparing workload sizes
* Observing execution behavior

---

## Benchmark Suite

The benchmark suite provides structured performance scenarios instead of relying exclusively on manual interaction.

This makes the experiment repeatable and allows results to be recorded consistently.

---

## Architecture Comparison

The architecture comparison component provides contextual information explaining why each framework behaves differently.

This is important because benchmark numbers without architectural context can easily lead to misleading conclusions.

---

## Interactive Sandbox

The sandbox provides a practical environment for testing DOM behavior outside the predefined benchmark scenarios.

It helps demonstrate the relationship between application state, framework rendering, and actual DOM operations.

---

## Lab Report

The project includes a dedicated reflection/report layer documenting:

* Optimization challenges
* Framework rendering strategies
* DOM update behavior
* Performance observations
* Scenario-specific conclusions

The complete written reflection is available in:

```text
Reflection.md
```

---

# Getting Started

## Prerequisites

Install the following software before running the project:

* **Node.js** — recommended current LTS release
* **npm**
* A modern browser such as Chrome, Edge, or Firefox
* Git, if cloning the repository

Verify your environment:

```bash
node --version
npm --version
```

---

# Running the Applications

Each framework is an independent Vite application.

## React

```bash
cd React
npm install
npm run dev
```

The configured development server uses:

```text
http://localhost:3000
```

---

## Angular

```bash
cd Angular
npm install
npm run dev
```

---

## Vue 3

```bash
cd Vue
npm install
npm run dev
```

---

## Svelte

```bash
cd Svelte
npm install
npm run dev
```

> Because the four applications use the same default development port, run them **one at a time** unless you intentionally configure different ports.

---

# Production Build

Each application provides a production build script.

Example:

```bash
cd React
npm install
npm run build
```

The same process applies to:

```text
Angular/
Vue/
Svelte/
```

To preview a production build:

```bash
npm run preview
```

---

# Running the Benchmarks

For reliable comparisons, use the same browser and similar system conditions for all four frameworks.

Recommended workflow:

1. Start one framework application.
2. Open the benchmark interface.
3. Run the initial-render scenarios.
4. Run the 50-task update scenario.
5. Run the 50-task deletion scenario.
6. Record the measured values.
7. Stop the application.
8. Start the next framework.
9. Repeat the exact same workload.
10. Compare the results.

For more reliable experimental data:

* Close unnecessary applications.
* Use the same browser version.
* Avoid background CPU-intensive workloads.
* Run multiple iterations.
* Ignore obvious outliers.
* Use medians or averages across repeated runs.
* Keep workload sizes identical.
* Avoid comparing results obtained under significantly different system conditions.

---

# Interpreting the Results

DOM benchmarks should be interpreted as **workload-specific measurements**.

A framework that performs best for one operation may not perform best for another.

For example:

* Svelte performed exceptionally well during initial rendering.
* React recorded the best supplied update measurement.
* Svelte recorded the best deletion measurement.
* Angular showed the highest measured average memory consumption in the initial-render test.
* Vue 3 provided consistently competitive rendering behavior.

This reinforces an important engineering principle:

> **Framework performance is contextual, not absolute.**

The correct framework choice depends on the characteristics of the application and its dominant workloads.

---

# Performance Analysis

## React

React's Virtual DOM and Fiber architecture provide a robust reconciliation system.

The major performance consideration is the additional runtime representation between application state and the browser DOM.

For large collections, efficient keys and controlled updates are essential.

### Strengths

* Strong update performance in the supplied benchmark.
* Mature reconciliation architecture.
* Predictable component model.
* Large ecosystem.

### Primary Consideration

Virtual DOM allocation and reconciliation can introduce runtime overhead.

---

## Angular

Angular provides a comprehensive application framework with a powerful rendering and dependency-management ecosystem.

Its change-detection architecture can perform additional work when updates are not sufficiently scoped.

Signals and optimized change-detection strategies can help reduce unnecessary work.

### Strengths

* Full-featured application architecture.
* Powerful dependency and reactive systems.
* Strong tooling for large applications.

### Primary Consideration

Broader framework infrastructure can introduce additional runtime and memory overhead.

---

## Vue 3

Vue 3 combines runtime reactivity with compiler-assisted rendering.

The framework can identify dynamic sections and reduce unnecessary rendering work.

### Strengths

* Strong balance between simplicity and performance.
* Fine-grained reactivity.
* Compiler-assisted rendering optimizations.
* Competitive initial rendering measurements.

### Primary Consideration

Reactive tracking and rendering infrastructure still introduce runtime work.

---

## Svelte

Svelte moves significant optimization work to compile time.

The generated output can perform direct DOM operations without maintaining a traditional runtime Virtual DOM.

### Strengths

* Excellent initial rendering results.
* Lowest supplied deletion measurement.
* Low measured memory footprint.
* Reduced runtime abstraction for DOM operations.

### Primary Consideration

Compile-time optimization does not automatically eliminate all DOM costs; inefficient application-level updates can still create performance problems.

---

# Screenshots and Documentation

The repository contains visual evidence of the benchmark environment and test results.

Available screenshots include:

* Initial rendering
* DOM updates
* DOM deletion
* React DOM manipulation
* Angular DOM manipulation
* Vue DOM manipulation
* Svelte DOM manipulation
* DOM manipulation architecture
* Simultaneous DOM execution

These assets are located in:

```text
Screenshots/
```

Additional project documentation:

```text
Benchmark.txt
Reflection.md
```

---

# Engineering Reflection

The experiment demonstrates several important front-end engineering principles.

## 1. Rendering Architecture Matters

Different frameworks solve the same UI problem using different execution models.

Understanding those models is essential when diagnosing performance.

## 2. DOM Work Is Expensive

Regardless of the framework, unnecessary DOM operations can become a significant bottleneck.

Reducing the number of operations is often more valuable than optimizing application code around them.

## 3. Benchmark the Real Workload

A framework benchmark should reflect the actual workload an application performs.

Initial rendering, updates, deletion, event handling, and memory behavior can produce very different results.

## 4. Optimization Is Contextual

There is no universal winner.

A framework should be evaluated according to:

* Application requirements
* Rendering patterns
* Update frequency
* Data volume
* Memory constraints
* Team expertise
* Ecosystem requirements
* Maintainability

## 5. Measurement Should Guide Decisions

Architectural opinions are useful, but actual measurements provide stronger evidence for performance-sensitive decisions.

---

# Limitations

This project is an experimental benchmark and should not be interpreted as a universal framework leaderboard.

Potential sources of variation include:

* Browser version
* Operating system
* CPU and RAM
* Background processes
* Browser extensions
* Warm versus cold browser state
* JavaScript engine behavior
* Garbage collection
* Thermal throttling
* Number of benchmark repetitions
* Implementation-specific optimization choices

The measured values therefore represent the supplied implementation and test environment rather than an absolute statement about framework performance.

---

# Future Improvements

Possible extensions include:

* Automated repeated benchmark runs.
* Median, minimum, maximum, and standard-deviation reporting.
* Automated memory profiling.
* CPU utilization measurements.
* FPS and frame-time measurements.
* Larger datasets such as 5,000 and 10,000 DOM nodes.
* Mixed workloads combining rendering, updates, and deletion.
* Automated benchmark result export to JSON or CSV.
* Cross-browser benchmarking.
* Mobile-device benchmarking.
* Headless browser automation.
* CI-based performance regression testing.
* Historical benchmark comparison.
* Interactive performance charts.
* More detailed garbage-collection analysis.
* Benchmark normalization across hardware configurations.

A future version could also introduce a dedicated automated benchmark runner using browser automation to reduce manual measurement variability.

---

# Conclusion

The **Front-End DOM Benchmark Comparison** project provides a practical investigation into how React, Angular, Vue 3, and Svelte handle DOM-intensive workloads.

The supplied measurements show:

* **Svelte** leading initial rendering and deletion workloads.
* **React** leading the supplied 50-task update workload.
* **Vue 3** maintaining competitive rendering performance.
* **Angular** providing a comprehensive architecture with comparatively higher measured memory usage in this experiment.

The most important conclusion is not simply which framework achieved the lowest number.

The experiment demonstrates that **rendering architecture directly influences runtime behavior**, and that effective front-end optimization requires understanding the complete path from application state to framework renderer to browser DOM.

For performance-sensitive applications, framework selection should therefore be based on **measured workload characteristics, architectural requirements, maintainability, and the broader needs of the project** rather than on isolated benchmark rankings.

---

# Author

**Yassine Kaltoum**

Software & Network Engineering

### Focus Areas

* Software Engineering
* Front-End Development
* Web Performance
* UI/UX Engineering
* System Architecture
* Network Engineering
* Cybersecurity

---

# License

This project is intended for educational, benchmarking, and research purposes.

If a specific open-source license is required for public distribution, add the corresponding `LICENSE` file to the repository and update this section accordingly.

---

# Acknowledgments

This project was developed as part of a front-end engineering and performance benchmarking study, with the goal of transforming framework-level rendering concepts into measurable, practical experiments.

Special recognition goes to the open-source communities behind React, Angular, Vue, Svelte, Vite, and the wider JavaScript ecosystem.
