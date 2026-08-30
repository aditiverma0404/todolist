/**
 * UI Manager
 * Manages UI elements and interactions
 */

export class UIManager {
  constructor() {
    this.elements = {
      taskForm: document.getElementById('task-form'),
      taskInput: document.getElementById('task-input'),
      submitButton: document.querySelector('md-filled-button[type="submit"]'),
      fabAdd: document.getElementById('fab-add'),
      appBar: document.querySelector('.app-bar'),
      searchButton: document.querySelector('.icon-button[title="Search"]')
    };
  }

  getInputValue() {
    return this.elements.taskInput?.value?.trim() || '';
  }

  clearInput() {
    if (this.elements.taskInput) {
      this.elements.taskInput.value = '';
    }
  }

  focusInput() {
    this.elements.taskInput?.focus();
  }

  disableSubmit() {
    if (this.elements.submitButton) {
      this.elements.submitButton.disabled = true;
    }
  }

  enableSubmit() {
    if (this.elements.submitButton) {
      this.elements.submitButton.disabled = false;
    }
  }
}
