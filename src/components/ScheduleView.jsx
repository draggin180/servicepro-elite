import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import apiService from '../services/api'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  User,
  MapPin,
  DollarSign,
  Play,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Filter
} from 'lucide-react'

const ScheduleView = () => {
  const [jobs, setJobs] = useState([])
  const [customers, setCustomers] = useState([])
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    per_page: 20
  })

  const [formData, setFormData] = useState({
    customer_id: '',
    quote_id: '',
    title: '',
    description: '',
    scheduled_date: '',
    scheduled_time: '',
    duration_hours: '',
    total_amount: '',
    notes: ''
  })

  useEffect(() => {
    loadJobs()
    loadCustomers()
    loadQuotes()
  }, [searchTerm, statusFilter, dateFilter, pagination.page])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        per_page: pagination.per_page
      }
      
      if (searchTerm) params.search = searchTerm
      if (statusFilter) params.status = statusFilter
      if (dateFilter) {
        const date = new Date(dateFilter)
        params.date_from = date.toISOString()
        params.date_to = new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString()
      }

      const response = await apiService.getJobs(params)
      
      if (response.success) {
        setJobs(response.jobs)
        setPagination(response.pagination)
      } else {
        setError('Failed to load jobs')
      }
    } catch (error) {
      console.error('Load jobs error:', error)
      setError(error.message || 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const loadCustomers = async () => {
    try {
      const response = await apiService.getCustomers({ per_page: 100 })
      if (response.success) {
        setCustomers(response.customers)
      }
    } catch (error) {
      console.error('Load customers error:', error)
    }
  }

  const loadQuotes = async () => {
    try {
      const response = await apiService.getQuotes({ per_page: 100, status: 'accepted' })
      if (response.success) {
        setQuotes(response.quotes)
      }
    } catch (error) {
      console.error('Load quotes error:', error)
    }
  }

  const handleCreateJob = async (e) => {
    e.preventDefault()
    try {
      setFormLoading(true)
      
      const jobData = {
        ...formData,
        total_amount: parseFloat(formData.total_amount || 0),
        duration_hours: parseFloat(formData.duration_hours || 0) || null
      }

      const response = await apiService.createJob(jobData)
      
      if (response.success) {
        setIsCreateDialogOpen(false)
        resetForm()
        loadJobs()
      } else {
        setError(response.error || 'Failed to create job')
      }
    } catch (error) {
      console.error('Create job error:', error)
      setError(error.message || 'Failed to create job')
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateJob = async (e) => {
    e.preventDefault()
    if (!selectedJob) return

    try {
      setFormLoading(true)
      
      const jobData = {
        ...formData,
        total_amount: parseFloat(formData.total_amount || 0),
        duration_hours: parseFloat(formData.duration_hours || 0) || null
      }

      const response = await apiService.updateJob(selectedJob.id, jobData)
      
      if (response.success) {
        setIsEditDialogOpen(false)
        resetForm()
        setSelectedJob(null)
        loadJobs()
      } else {
        setError(response.error || 'Failed to update job')
      }
    } catch (error) {
      console.error('Update job error:', error)
      setError(error.message || 'Failed to update job')
    } finally {
      setFormLoading(false)
    }
  }

  const handleJobAction = async (job, action) => {
    try {
      let response
      switch (action) {
        case 'start':
          response = await apiService.startJob(job.id)
          break
        case 'complete':
          response = await apiService.completeJob(job.id)
          break
        case 'cancel':
          if (!confirm(`Are you sure you want to cancel job ${job.job_number}?`)) return
          response = await apiService.cancelJob(job.id)
          break
        default:
          return
      }
      
      if (response.success) {
        loadJobs()
      } else {
        setError(response.error || `Failed to ${action} job`)
      }
    } catch (error) {
      console.error(`${action} job error:`, error)
      setError(error.message || `Failed to ${action} job`)
    }
  }

  const handleDeleteJob = async (job) => {
    if (!confirm(`Are you sure you want to delete job ${job.job_number}?`)) {
      return
    }

    try {
      const response = await apiService.deleteJob(job.id)
      
      if (response.success) {
        loadJobs()
      } else {
        setError(response.error || 'Failed to delete job')
      }
    } catch (error) {
      console.error('Delete job error:', error)
      setError(error.message || 'Failed to delete job')
    }
  }

  const openEditDialog = (job) => {
    setSelectedJob(job)
    setFormData({
      customer_id: job.customer_id.toString(),
      quote_id: job.quote_id ? job.quote_id.toString() : '',
      title: job.title || '',
      description: job.description || '',
      scheduled_date: job.scheduled_date ? job.scheduled_date.split('T')[0] : '',
      scheduled_time: job.scheduled_time || '',
      duration_hours: job.duration_hours || '',
      total_amount: job.total_amount || '',
      notes: job.notes || ''
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      customer_id: '',
      quote_id: '',
      title: '',
      description: '',
      scheduled_date: '',
      scheduled_time: '',
      duration_hours: '',
      total_amount: '',
      notes: ''
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCustomerChange = (customerId) => {
    setFormData(prev => ({
      ...prev,
      customer_id: customerId,
      quote_id: '' // Reset quote when customer changes
    }))
  }

  const handleQuoteChange = (quoteId) => {
    const selectedQuote = quotes.find(q => q.id.toString() === quoteId)
    setFormData(prev => ({
      ...prev,
      quote_id: quoteId,
      title: selectedQuote ? selectedQuote.title : prev.title,
      description: selectedQuote ? selectedQuote.description : prev.description,
      total_amount: selectedQuote ? selectedQuote.total : prev.total_amount
    }))
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return 'Not scheduled'
    
    const date = formatDate(dateString)
    return timeString ? `${date} at ${timeString}` : date
  }

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    const icons = {
      scheduled: Calendar,
      in_progress: Clock,
      completed: CheckCircle,
      cancelled: XCircle
    }
    const Icon = icons[status] || Calendar
    return <Icon className="h-4 w-4" />
  }

  const getCustomerQuotes = (customerId) => {
    return quotes.filter(quote => quote.customer_id.toString() === customerId)
  }

  if (loading && jobs.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Scheduling</h1>
          <p className="text-gray-600 mt-1">
            Schedule and manage your service jobs and appointments.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Schedule New Job</DialogTitle>
              <DialogDescription>
                Create a new job and schedule it for a customer.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateJob}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_id">Customer *</Label>
                    <Select
                      value={formData.customer_id}
                      onValueChange={handleCustomerChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quote_id">Related Quote (Optional)</Label>
                    <Select
                      value={formData.quote_id}
                      onValueChange={handleQuoteChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select quote" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No quote</SelectItem>
                        {getCustomerQuotes(formData.customer_id).map((quote) => (
                          <SelectItem key={quote.id} value={quote.id.toString()}>
                            {quote.quote_number} - {formatCurrency(quote.total)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Pressure Washing Service"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detailed description of the work to be performed..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scheduled_date">Scheduled Date</Label>
                    <Input
                      id="scheduled_date"
                      name="scheduled_date"
                      type="date"
                      value={formData.scheduled_date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduled_time">Time</Label>
                    <Input
                      id="scheduled_time"
                      name="scheduled_time"
                      type="time"
                      value={formData.scheduled_time}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration_hours">Duration (hours)</Label>
                    <Input
                      id="duration_hours"
                      name="duration_hours"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.duration_hours}
                      onChange={handleInputChange}
                      placeholder="2.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="total_amount">Total Amount</Label>
                    <Input
                      id="total_amount"
                      name="total_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.total_amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Additional notes..."
                      rows={2}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Schedule Job
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40"
          />
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {pagination.total} jobs
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <p className="font-semibold text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto"
                onClick={() => setError(null)}
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Jobs</CardTitle>
          <CardDescription>
            Manage your scheduled jobs and track their progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-mono">
                        {job.job_number}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          {job.customer?.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{job.title}</p>
                          {job.description && (
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {job.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          {formatDateTime(job.scheduled_date, job.scheduled_time)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                          {formatCurrency(job.total_amount)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(job.status)}>
                          <div className="flex items-center">
                            {getStatusIcon(job.status)}
                            <span className="ml-1">{job.status}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {job.status === 'scheduled' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleJobAction(job, 'start')}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          {(job.status === 'scheduled' || job.status === 'in_progress') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleJobAction(job, 'complete')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(job)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {job.status !== 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleJobAction(job, 'cancel')}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteJob(job)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Showing {((pagination.page - 1) * pagination.per_page) + 1} to {Math.min(pagination.page * pagination.per_page, pagination.total)} of {pagination.total} jobs
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.has_prev}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.has_next}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter || dateFilter ? 'No jobs match your filters.' : 'Get started by scheduling your first job.'}
              </p>
              {!searchTerm && !statusFilter && !dateFilter && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Job
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update job details and scheduling information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateJob}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-customer_id">Customer *</Label>
                  <Select
                    value={formData.customer_id}
                    onValueChange={handleCustomerChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id.toString()}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-quote_id">Related Quote (Optional)</Label>
                  <Select
                    value={formData.quote_id}
                    onValueChange={handleQuoteChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quote" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No quote</SelectItem>
                      {getCustomerQuotes(formData.customer_id).map((quote) => (
                        <SelectItem key={quote.id} value={quote.id.toString()}>
                          {quote.quote_number} - {formatCurrency(quote.total)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-title">Job Title *</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-scheduled_date">Scheduled Date</Label>
                  <Input
                    id="edit-scheduled_date"
                    name="scheduled_date"
                    type="date"
                    value={formData.scheduled_date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-scheduled_time">Time</Label>
                  <Input
                    id="edit-scheduled_time"
                    name="scheduled_time"
                    type="time"
                    value={formData.scheduled_time}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration_hours">Duration (hours)</Label>
                  <Input
                    id="edit-duration_hours"
                    name="duration_hours"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.duration_hours}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-total_amount">Total Amount</Label>
                  <Input
                    id="edit-total_amount"
                    name="total_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.total_amount}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Update Job
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ScheduleView

