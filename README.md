# Workspace Tasks

A clean, minimal task manager built with vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies — just a focused tool for managing your work.

![Dark premium design with gold accents](https://via.placeholder.com/800x400/161820/d4af37?text=Workspace+Tasks)

## Features

- **Add tasks** with an optional due date
- **Complete tasks** by clicking the checkbox or the task row
- **Delete tasks** with the × button
- **Filter tasks** by All, Active, or Completed
- **Due date indicators** — overdue tasks flag in red, today's in amber, upcoming in muted gray
- **Persistent storage** — tasks survive page refreshes via `localStorage`

## Getting Started

No build step or install required. Just clone and open.

```bash
git clone https://github.com/your-username/workspace-tasks.git
cd workspace-tasks
```

Then open `index.html` in your browser — that's it.

## Project Structure

```
workspace-tasks/
├── index.html      # Markup and layout
├── style.css       # Dark premium theme and component styles
└── script.js       # App logic, state management, and rendering
```

## How It Works

### State

All tasks are stored in a plain JavaScript array and synced to `localStorage` on every change. Each task object looks like this:

```js
{
  id: "1717430400000",   // Date.now() string — unique identifier
  title: "Review Q3 report",
  completed: false,
  dueDate: "2024-06-10"  // ISO date string, or null if not set
}
```

### Due Date Logic

Due dates are compared against today's date (ISO string) at render time:

| Status | Condition | Color |
|--------|-----------|-------|
| Overdue | `dueDate < today` | Red |
| Due today | `dueDate === today` | Amber |
| Upcoming | `dueDate > today` | Muted gray |

### Event Delegation

Rather than attaching listeners to every task item, a single click listener on the `#task-list` element handles both checkbox toggles and delete actions via `e.target` checks. This keeps things efficient as the list grows.

## Customization

All colors are defined as CSS variables in `:root` inside `style.css`, making it easy to retheme:

```css
:root {
    --accent-gold: #d4af37;   /* Primary accent — buttons, active states */
    --bg-main: #0d0e12;       /* Page background */
    --bg-card: #161820;       /* App container */
    --bg-input: #1f222e;      /* Input fields and task items */
    --accent-red: #cf6679;    /* Overdue indicator */
}
```

## Browser Support

Works in all modern browsers. The `color-scheme: dark` property on the date input ensures the native date picker matches the dark theme in supported browsers.

## License

MIT
