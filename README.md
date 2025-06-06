Video Link: https://drive.google.com/file/d/1D6lEAndJWA2WEzQsfDsw8bnUcLnhN922/view?usp=sharing
 
![Test_Image](https://github.com/user-attachments/assets/d47c0607-062c-4a65-9795-d5944eb91b8f)


# Multi-List Todo App

A React application that allows users to manage multiple todo lists, each with its own set of tasks. Tasks can be added, marked complete, deleted, and even dragged between lists or reordered within the same list.

## Objective

Create a React app where users can:

- Create multiple todo lists
- Add tasks to individual lists
- Mark tasks as completed
- Delete tasks
- Drag tasks between different lists

## Features

### 1. Core Functionality

- Create, rename, and delete multiple todo lists
- Add tasks via input field in each list
- Mark tasks as complete/incomplete
- Delete tasks from any list

### 2. Drag-and-Drop

- Drag tasks between different todo lists
- Reorder tasks within a single list
- Built using `react-beautiful-dnd`

### 3. State Management

- State handled using Redux (preferred)
- Data persisted using `localStorage`

### 4. UI/UX Design

- Responsive layout using Bootstrap
- Modular reusable components:
  - `App`
  - `TodoList`
  - `Task`
- Clean and user-friendly design

### 5. Bonus Feature

- Global search bar to filter tasks across all lists

## Getting Started

> **Prerequisites:**  
> Make sure [Node.js](https://nodejs.org/) is installed on your system.

### Installation

```bash
npm install
npm run dev
