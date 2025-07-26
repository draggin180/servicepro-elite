import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Building2, 
  MapPin, 
  Upload, 
  Palette, 
  Users, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Camera
} from 'lucide-react'

const OnboardingWizard = () => {
  const { completeOnboarding } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [onboardingData, setOnboardingData] = useState({
    // Step 1: Business Information
    businessName: '',
    businessType: '',
    businessDescription: '',
    
    // Step 2: Service Areas
    primaryLocation: '',
    serviceRadius: '',
    serviceAreas: [],
    
    // Step 3: Services Offered
    services: [],
    customServices: '',
    
    // Step 4: Branding
    logo: null,
    primaryColor: '#2563eb',
    businessPhone: '',
    businessEmail: '',
    
    // Step 5: Team Setup
    teamSize: '',
    roles: []
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const businessTypes = [
    'Pressure Washing',
    'Window Cleaning',
    'Landscaping',
    'Lawn Care',
    'Home Maintenance',
    'Cleaning Services',
    'Handyman Services',
    'Pool Services',
    'HVAC Services',
    'Plumbing',
    'Electrical',
    'Other'
  ]

  const commonServices = [
    'Pressure Washing',
    'Window Cleaning',
    'Gutter Cleaning',
    'Roof Cleaning',
    'Driveway Cleaning',
    'Deck Cleaning',
    'House Washing',
    'Commercial Cleaning',
    'Lawn Mowing',
    'Landscaping',
    'Tree Trimming',
    'Snow Removal',
    'Handyman Repairs',
    'Painting',
    'Maintenance'
  ]

  const teamRoles = [
    'Owner/Manager',
    'Field Technician',
    'Sales Representative',
    'Customer Service',
    'Administrative Assistant'
  ]

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleServiceToggle = (service) => {
    const services = onboardingData.services.includes(service)
      ? onboardingData.services.filter(s => s !== service)
      : [...onboardingData.services, service]
    
    setOnboardingData({ ...onboardingData, services })
  }

  const handleServiceAreaAdd = (area) => {
    if (area && !onboardingData.serviceAreas.includes(area)) {
      setOnboardingData({
        ...onboardingData,
        serviceAreas: [...onboardingData.serviceAreas, area]
      })
    }
  }

  const handleServiceAreaRemove = (area) => {
    setOnboardingData({
      ...onboardingData,
      serviceAreas: onboardingData.serviceAreas.filter(a => a !== area)
    })
  }

  const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setOnboardingData({
          ...onboardingData,
          logo: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Complete onboarding
    completeOnboarding(onboardingData)
    
    setIsLoading(false)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return onboardingData.businessName && onboardingData.businessType
      case 2:
        return onboardingData.primaryLocation && onboardingData.serviceRadius
      case 3:
        return onboardingData.services.length > 0
      case 4:
        return onboardingData.businessPhone && onboardingData.businessEmail
      case 5:
        return onboardingData.teamSize
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SP</span>
            </div>
            <span className="font-bold text-2xl text-gray-900">ServicePro Elite</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ServicePro Elite!</h1>
          <p className="text-gray-600">Let's set up your account in just a few minutes</p>
          
          <div className="mt-6">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-gray-500 mt-2">Step {currentStep} of {totalSteps}</p>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {currentStep === 1 && <><Building2 className="h-5 w-5" /> <span>Business Information</span></>}
              {currentStep === 2 && <><MapPin className="h-5 w-5" /> <span>Service Areas</span></>}
              {currentStep === 3 && <><CheckCircle className="h-5 w-5" /> <span>Services Offered</span></>}
              {currentStep === 4 && <><Palette className="h-5 w-5" /> <span>Branding & Contact</span></>}
              {currentStep === 5 && <><Users className="h-5 w-5" /> <span>Team Setup</span></>}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your business"}
              {currentStep === 2 && "Where do you provide services?"}
              {currentStep === 3 && "What services do you offer?"}
              {currentStep === 4 && "Customize your brand and contact info"}
              {currentStep === 5 && "Set up your team structure"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    placeholder="Enter your business name"
                    value={onboardingData.businessName}
                    onChange={(e) => setOnboardingData({...onboardingData, businessName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select 
                    value={onboardingData.businessType} 
                    onValueChange={(value) => setOnboardingData({...onboardingData, businessType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Business Description</Label>
                  <Textarea
                    id="businessDescription"
                    placeholder="Briefly describe your business and what makes you unique"
                    value={onboardingData.businessDescription}
                    onChange={(e) => setOnboardingData({...onboardingData, businessDescription: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Service Areas */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryLocation">Primary Location *</Label>
                  <Input
                    id="primaryLocation"
                    placeholder="City, State (e.g., Austin, TX)"
                    value={onboardingData.primaryLocation}
                    onChange={(e) => setOnboardingData({...onboardingData, primaryLocation: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serviceRadius">Service Radius *</Label>
                  <Select 
                    value={onboardingData.serviceRadius} 
                    onValueChange={(value) => setOnboardingData({...onboardingData, serviceRadius: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How far do you travel?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">Within 10 miles</SelectItem>
                      <SelectItem value="25">Within 25 miles</SelectItem>
                      <SelectItem value="50">Within 50 miles</SelectItem>
                      <SelectItem value="100">Within 100 miles</SelectItem>
                      <SelectItem value="unlimited">No limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Additional Service Areas</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add city or zip code"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleServiceAreaAdd(e.target.value)
                          e.target.value = ''
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={(e) => {
                        const input = e.target.parentElement.querySelector('input')
                        handleServiceAreaAdd(input.value)
                        input.value = ''
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {onboardingData.serviceAreas.map((area, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer">
                        {area}
                        <button
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          onClick={() => handleServiceAreaRemove(area)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Services Offered */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Services You Offer *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {commonServices.map((service) => (
                      <div
                        key={service}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          onboardingData.services.includes(service)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleServiceToggle(service)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{service}</span>
                          {onboardingData.services.includes(service) && (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customServices">Other Services</Label>
                  <Textarea
                    id="customServices"
                    placeholder="List any additional services you offer"
                    value={onboardingData.customServices}
                    onChange={(e) => setOnboardingData({...onboardingData, customServices: e.target.value})}
                    rows={2}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Branding & Contact */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Logo</Label>
                  <div className="flex items-center space-x-4">
                    {onboardingData.logo ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border">
                        <img 
                          src={onboardingData.logo} 
                          alt="Logo" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <Camera className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    
                    <div>
                      <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <Label htmlFor="logo-upload" className="cursor-pointer">
                        <Button variant="outline" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Logo
                          </span>
                        </Button>
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Brand Color</Label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      id="primaryColor"
                      value={onboardingData.primaryColor}
                      onChange={(e) => setOnboardingData({...onboardingData, primaryColor: e.target.value})}
                      className="w-12 h-12 rounded-lg border cursor-pointer"
                    />
                    <Input
                      value={onboardingData.primaryColor}
                      onChange={(e) => setOnboardingData({...onboardingData, primaryColor: e.target.value})}
                      className="w-24"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Business Phone *</Label>
                    <Input
                      id="businessPhone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={onboardingData.businessPhone}
                      onChange={(e) => setOnboardingData({...onboardingData, businessPhone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessEmail">Business Email *</Label>
                    <Input
                      id="businessEmail"
                      type="email"
                      placeholder="contact@yourbusiness.com"
                      value={onboardingData.businessEmail}
                      onChange={(e) => setOnboardingData({...onboardingData, businessEmail: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Team Setup */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size *</Label>
                  <Select 
                    value={onboardingData.teamSize} 
                    onValueChange={(value) => setOnboardingData({...onboardingData, teamSize: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="How many people work in your business?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Just me</SelectItem>
                      <SelectItem value="2-5">2-5 people</SelectItem>
                      <SelectItem value="6-10">6-10 people</SelectItem>
                      <SelectItem value="11-25">11-25 people</SelectItem>
                      <SelectItem value="25+">25+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Team Roles (Optional)</Label>
                  <p className="text-sm text-gray-500">Select the roles you need to manage</p>
                  <div className="grid grid-cols-1 gap-2">
                    {teamRoles.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={role}
                          checked={onboardingData.roles.includes(role)}
                          onChange={(e) => {
                            const roles = e.target.checked
                              ? [...onboardingData.roles, role]
                              : onboardingData.roles.filter(r => r !== role)
                            setOnboardingData({...onboardingData, roles})
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={role} className="text-sm">{role}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">🎉 You're almost done!</h3>
                  <p className="text-sm text-blue-700">
                    Once you complete setup, you'll have access to all ServicePro Elite features 
                    including AI-powered quotes, smart scheduling, and comprehensive analytics.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!isStepValid() || isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Setting up...</span>
                </>
              ) : (
                <>
                  <span>Complete Setup</span>
                  <CheckCircle className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OnboardingWizard

