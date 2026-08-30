/**
 * Supabase Service
 * Handles all database operations
 */

export class SupabaseService {
  constructor(url, key) {
    const { createClient } = window.supabase;
    this.client = createClient(url, key);
  }

  async getTasks() {
    const { data, error } = await this.client
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async addTask(task) {
    const { data, error } = await this.client
      .from('todos')
      .insert({ task, is_complete: false });
    
    if (error) throw error;
    return data;
  }

  async toggleTask(id, currentState) {
    const { data, error } = await this.client
      .from('todos')
      .update({ is_complete: !currentState })
      .eq('id', id);
    
    if (error) throw error;
    return data;
  }

  async deleteTask(id) {
    const { data, error } = await this.client
      .from('todos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return data;
  }

  async updateTask(id, updates) {
    const { data, error } = await this.client
      .from('todos')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    return data;
  }
}
