const API_BASE_URL = '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async completeOnboarding(onboardingData) {
    return this.request('/auth/complete-onboarding', {
      method: 'POST',
      body: JSON.stringify(onboardingData),
    });
  }

  async updateProfile(profileData) {
    return this.request('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  async verifyToken(token) {
    return this.request('/auth/verify-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getRevenueChart(period = 'month') {
    return this.request(`/dashboard/revenue-chart?period=${period}`);
  }

  async getJobStatusChart() {
    return this.request('/dashboard/job-status-chart');
  }

  async getQuoteConversionChart() {
    return this.request('/dashboard/quote-conversion-chart');
  }

  async getTopCustomers(limit = 5) {
    return this.request(`/dashboard/top-customers?limit=${limit}`);
  }

  async getRecentActivity(limit = 10) {
    return this.request(`/dashboard/recent-activity?limit=${limit}`);
  }

  // Customer endpoints
  async getCustomers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/customers?${queryString}`);
  }

  async createCustomer(customerData) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  }

  async getCustomer(customerId) {
    return this.request(`/customers/${customerId}`);
  }

  async updateCustomer(customerId, customerData) {
    return this.request(`/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  }

  async deleteCustomer(customerId) {
    return this.request(`/customers/${customerId}`, {
      method: 'DELETE',
    });
  }

  async searchCustomers(query, limit = 10) {
    return this.request(`/customers/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  // Quote endpoints
  async getQuotes(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/quotes?${queryString}`);
  }

  async createQuote(quoteData) {
    return this.request('/quotes', {
      method: 'POST',
      body: JSON.stringify(quoteData),
    });
  }

  async getQuote(quoteId) {
    return this.request(`/quotes/${quoteId}`);
  }

  async updateQuote(quoteId, quoteData) {
    return this.request(`/quotes/${quoteId}`, {
      method: 'PUT',
      body: JSON.stringify(quoteData),
    });
  }

  async deleteQuote(quoteId) {
    return this.request(`/quotes/${quoteId}`, {
      method: 'DELETE',
    });
  }

  async sendQuote(quoteId) {
    return this.request(`/quotes/${quoteId}/send`, {
      method: 'POST',
    });
  }

  async acceptQuote(quoteId) {
    return this.request(`/quotes/${quoteId}/accept`, {
      method: 'POST',
    });
  }

  async rejectQuote(quoteId) {
    return this.request(`/quotes/${quoteId}/reject`, {
      method: 'POST',
    });
  }

  async getQuoteStats() {
    return this.request('/quotes/stats');
  }

  // Job endpoints
  async getJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/jobs?${queryString}`);
  }

  async createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async getJob(jobId) {
    return this.request(`/jobs/${jobId}`);
  }

  async updateJob(jobId, jobData) {
    return this.request(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(jobId) {
    return this.request(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
  }

  async startJob(jobId) {
    return this.request(`/jobs/${jobId}/start`, {
      method: 'POST',
    });
  }

  async completeJob(jobId) {
    return this.request(`/jobs/${jobId}/complete`, {
      method: 'POST',
    });
  }

  async cancelJob(jobId) {
    return this.request(`/jobs/${jobId}/cancel`, {
      method: 'POST',
    });
  }

  async getCalendarJobs(start, end) {
    return this.request(`/jobs/calendar?start=${start}&end=${end}`);
  }

  async getJobStats() {
    return this.request('/jobs/stats');
  }

  // Invoice endpoints
  async getInvoices(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/invoices?${queryString}`);
  }

  async createInvoice(invoiceData) {
    return this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  async getInvoice(invoiceId) {
    return this.request(`/invoices/${invoiceId}`);
  }

  async updateInvoice(invoiceId, invoiceData) {
    return this.request(`/invoices/${invoiceId}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData),
    });
  }

  async deleteInvoice(invoiceId) {
    return this.request(`/invoices/${invoiceId}`, {
      method: 'DELETE',
    });
  }

  async sendInvoice(invoiceId) {
    return this.request(`/invoices/${invoiceId}/send`, {
      method: 'POST',
    });
  }

  async markInvoicePaid(invoiceId) {
    return this.request(`/invoices/${invoiceId}/mark-paid`, {
      method: 'POST',
    });
  }

  async getOverdueInvoices() {
    return this.request('/invoices/overdue');
  }

  async getInvoiceStats() {
    return this.request('/invoices/stats');
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();

