/**
 * Task Manager Application
 * Material Design 3 Implementation
 */

import { SupabaseService } from './services/supabase.js';
import { UIManager } from './ui/manager.js';
import { TaskRenderer } from './ui/taskRenderer.js';
import { Snackbar } from './ui/snackbar.js';

class TaskApp {
  constructor(supabaseUrl, supabaseKey) {
    this.db = new SupabaseService(supabaseUrl, supabaseKey);
    this.ui = new UIManager();
    this.renderer = new TaskRenderer();
    this.snackbar = new Snackbar();
    
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.loadTasks();
    this.observeScroll();
  }

  attachEventListeners() {
    // Task form submission
    this.ui.elements.taskForm.addEventListener('submit', (e) => this.handleAddTask(e));
    
    // FAB click
    this.ui.elements.fabAdd.addEventListener('click', () => this.ui.focusInput());
    
    // Search functionality (placeholder)
    this.ui.elements.searchButton?.addEventListener('click', () => {
      this.snackbar.show('Search coming soon!');
    });
  }

  observeScroll() {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll && currentScroll > 64) {
        this.ui.elements.appBar.classList.add('elevated');
      } else {
        this.ui.elements.appBar.classList.remove('elevated');
      }
      lastScroll = currentScroll;
    });
  }

  async loadTasks() {
    try {
      const tasks = await this.db.getTasks();
      this.renderer.render(tasks, {
        onToggle: (id, state) => this.handleToggleTask(id, state),
        onDelete: (id) => this.handleDeleteTask(id)
      });
    } catch (error) {
      console.error('Failed to load tasks:', error);
      this.snackbar.show('Failed to load tasks', 'error');
    }
  }

  async handleAddTask(event) {
    event.preventDefault();
    
    const task = this.ui.getInputValue();
    if (!task) return;

    try {
      this.ui.disableSubmit();
      await this.db.addTask(task);
      this.ui.clearInput();
      await this.loadTasks();
      this.snackbar.show('Task added successfully');
    } catch (error) {
      console.error('Failed to add task:', error);
      this.snackbar.show('Failed to add task', 'error');
    } finally {
      this.ui.enableSubmit();
    }
  }

  async handleToggleTask(id, currentState) {
    try {
      await this.db.toggleTask(id, currentState);
      await this.loadTasks();
      this.snackbar.show(currentState ? 'Task marked incomplete' : 'Task completed');
    } catch (error) {
      console.error('Failed to toggle task:', error);
      this.snackbar.show('Failed to update task', 'error');
    }
  }

  async handleDeleteTask(id) {
    try {
      await this.db.deleteTask(id);
      await this.loadTasks();
      this.snackbar.show('Task deleted');
    } catch (error) {
      console.error('Failed to delete task:', error);
      this.snackbar.show('Failed to delete task', 'error');
    }
  }
}

// Initialize app when DOM is ready and config is available
if (window.SUPABASE_CONFIG) {
  window.addEventListener('DOMContentLoaded', () => {
    const { url, key } = window.SUPABASE_CONFIG;
    window.taskApp = new TaskApp(url, key);
  });
}

export default TaskApp;
