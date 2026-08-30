/**
 * Task Renderer
 * Handles rendering tasks to the DOM
 */

export class TaskRenderer {
  constructor() {
    this.container = document.getElementById('tasks-grid');
    this.emptyState = document.getElementById('empty-state');
  }

  render(tasks, callbacks) {
    if (!tasks || tasks.length === 0) {
      this.showEmptyState();
      return;
    }

    this.hideEmptyState();
    this.container.innerHTML = '';

    tasks.forEach(task => {
      const card = this.createTaskCard(task, callbacks);
      this.container.appendChild(card);
    });
  }

  createTaskCard(task, callbacks) {
    const card = document.createElement('div');
    card.className = `task-card${task.is_complete ? ' completed' : ''}`;
    card.dataset.taskId = task.id;

    // Task content
    const content = document.createElement('div');
    content.className = 'task-content';
    content.textContent = task.task;

    // Task meta (timestamp)
    const meta = document.createElement('div');
    meta.className = 'task-meta';
    const date = new Date(task.created_at);
    meta.innerHTML = `
      <span class="material-icons" style="font-size: 14px;">schedule</span>
      <span>${this.formatDate(date)}</span>
    `;

    // Task actions
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    // Toggle button
    const toggleBtn = this.createIconButton(
      task.is_complete ? 'undo' : 'check_circle',
      task.is_complete ? 'Mark incomplete' : 'Mark complete',
      () => callbacks.onToggle(task.id, task.is_complete)
    );

    // Delete button
    const deleteBtn = this.createIconButton(
      'delete',
      'Delete task',
      () => callbacks.onDelete(task.id)
    );

    actions.appendChild(toggleBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(content);
    card.appendChild(meta);
    card.appendChild(actions);

    return card;
  }

  createIconButton(icon, title, onClick) {
    const button = document.createElement('md-icon-button');
    button.title = title;
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });

    const iconSpan = document.createElement('span');
    iconSpan.className = 'material-icons';
    iconSpan.slot = 'icon';
    iconSpan.textContent = icon;
    button.appendChild(iconSpan);

    return button;
  }

  formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  showEmptyState() {
    this.emptyState.style.display = 'block';
    this.container.style.display = 'none';
  }

  hideEmptyState() {
    this.emptyState.style.display = 'none';
    this.container.style.display = 'grid';
  }
}
