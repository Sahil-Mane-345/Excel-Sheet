# Excel Sheet Clone

A lightweight spreadsheet application built using **TypeScript** and the **HTML5 Canvas API**. The project demonstrates how spreadsheet applications such as Microsoft Excel or Google Sheets work internally by implementing rendering, virtualization, cell selection, editing, resizing, and command-based undo/redo without using any frontend framework.

---

## Features

### Spreadsheet Rendering
- Canvas-based rendering
- Virtualized rendering for large datasets
- Row and column headers
- Infinite scrolling experience
- Configurable row heights and column widths

### Cell Operations
- Single cell selection
- Multi-cell range selection
- Row selection
- Column selection
- Select entire sheet
- Cell editing through input bar

### Resize Support
- Resize rows
- Resize columns
- Dynamic scroll area updates
- Minimum row and column size validation

### Undo / Redo
Implements the Command Pattern for:
- Cell edits
- Row resizing
- Column resizing

Keyboard shortcuts:

| Shortcut | Action |
|----------|--------|
| Ctrl + Z | Undo |
| Ctrl + Y | Redo |
| Ctrl + Shift + Z | Redo |

### Selection Statistics
Displays statistics for selected cells:

- Count
- Sum
- Average
- Minimum
- Maximum

### Import Support
Load spreadsheet data from a JSON file.

---

# Project Structure

```
src/
│
├── Commands/
│   ├── Command.ts
│   ├── CommandManager.ts
│   ├── EditCellCommand.ts
│   ├── ResizeCommand.ts
│   └── SelectionCommand.ts
│
├── Grid/
│   ├── Grid.ts
│   ├── Renderer.ts
│   ├── EventManager.ts
│   ├── Viewport.ts
│   ├── CellEditor.ts
│   ├── SelectionManager.ts
│   ├── SelectionStatsManager.ts
│   └── ResizeHandler.ts
│
├── Model/
│
├── Utils/
│
├── main.ts
└── style.css
```

---

# Architecture

The project is divided into independent modules.

## Screenshots

![App Screenshot](src\assets\class.drawio.png)



## Renderer

Responsible for drawing:

- Grid lines
- Cells
- Headers
- Selection
- Selection borders
- Statistics bar

---

## Viewport

Manages:

- Scroll position
- Visible rows
- Visible columns
- Variable row heights
- Variable column widths

Only visible cells are rendered for better performance.

---

## Event Manager

Handles all user interactions.

Supported events:

- Mouse click
- Drag selection
- Resize
- Keyboard shortcuts
- Input editing
- File import
- Auto scrolling while dragging

---

## Cell Editor

Stores spreadsheet data using a Map.

Responsibilities:

- Read cell values
- Write cell values
- Delete cells
- Import records
- Export cells

---

## Selection Manager

Maintains selection state.

Supports:

- Cell
- Range
- Row
- Column
- Entire sheet

---

## Command Manager

Implements the Command Pattern.

Supported commands:

- EditCellCommand
- ResizeCommand
- SelectionCommand

Provides Undo and Redo functionality.

---

## Selection Statistics Manager

Calculates:

- Count
- Numeric Count
- Sum
- Average
- Minimum
- Maximum

---

# Technologies Used

- TypeScript
- HTML5 Canvas
- HTML
- CSS
- Vite

---

# Installation

Clone the repository.

```bash
git clone <repository-url>
```

Install dependencies.

```bash
npm install
```

Start development server.

```bash
npm run dev
```

Build production version.

```bash
npm run build
```

Preview production build.

```bash
npm run preview
```

---

# Supported Operations

- Select single cell
- Select multiple cells
- Select rows
- Select columns
- Select all cells
- Edit cells
- Resize rows
- Resize columns
- Undo changes
- Redo changes
- Import JSON data (tested over 50,000 JSON objects)
- View selection statistics (Count of cells, Sum , Average , Min and Max over selected range of numeric inputs)

---

# Performance

The spreadsheet uses viewport-based rendering, meaning only visible rows and columns are drawn on the canvas.

Current configuration:

- 100,000 Rows
- 500 Columns

This significantly reduces rendering overhead compared to drawing the entire spreadsheet.

---

# Future Improvements

- Copy/Paste
- Cut
- Fill Handle
- Cell Formatting
- Formula Engine
- Clipboard Support
- Multiple Worksheets
- Frozen Rows and Columns
- Search and Replace
- CSV Import/Export
- Keyboard Navigation
- Text Clipping and Ellipsis
- Accessibility Improvements
- Context Menu
- Merged Cells
- Formula Dependency Graph

---

# Learning Objectives

This project demonstrates practical implementation of:

- Canvas Rendering
- Virtual Scrolling
- Command Pattern
- Separation of Concerns
- Object-Oriented Design
- State Management
- Event Handling
- Spreadsheet Data Structures
- Undo/Redo Architecture
- Large Dataset Rendering

---

# License

This project is intended for educational and learning purposes.