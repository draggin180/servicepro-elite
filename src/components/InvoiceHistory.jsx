import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const InvoiceHistory = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>View and manage your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Invoice history features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default InvoiceHistory

