/**
 * Snackbar Component
 * Material Design 3 toast notifications
 */

export class Snackbar {
  constructor() {
    this.element = document.getElementById('snackbar');
    this.timeout = null;
  }

  show(message, type = 'info') {
    if (!this.element) return;

    // Clear existing timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // Set icon based on type
    const icon = this.getIcon(type);
    
    this.element.innerHTML = `
      ${icon ? `<span class="material-icons snackbar-icon">${icon}</span>` : ''}
      <span>${message}</span>
    `;

    // Show snackbar
    this.element.classList.add('show');

    // Auto-hide after 3 seconds
    this.timeout = setTimeout(() => {
      this.hide();
    }, 3000);
  }

  hide() {
    if (this.element) {
      this.element.classList.remove('show');
    }
  }

  getIcon(type) {
    const icons = {
      info: 'info',
      success: 'check_circle',
      error: 'error',
      warning: 'warning'
    };
    return icons[type] || null;
  }
}
