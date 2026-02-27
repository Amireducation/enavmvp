'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Phone, Mail, Clock, DollarSign, FileText, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { apiClient } from '@/lib/api-client'

interface ServiceDetail {
  id: string
  name: string
  name_am: string
  name_or: string
  description: string
  description_am: string
  description_or: string
  category: string
  service_fee: number
  estimated_processing_days: number
  estimated_processing_time: string
  online_available: boolean
  agency: string
  contact_email: string
  contact_phone: string
  requirements: string[]
  status: string
}

interface RelatedService {
  id: string
  name: string
  description: string
}

interface ReviewStats {
  average: string
  totalReviews: number
}

interface FAQ {
  question: string
  question_am: string
  question_or: string
  answer: string
  answer_am: string
  answer_or: string
}

export default function ServiceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [service, setService] = useState<ServiceDetail | null>(null)
  const [relatedServices, setRelatedServices] = useState<RelatedService[]>([])
  const [ratings, setRatings] = useState<ReviewStats | null>(null)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchServiceDetails()
  }, [params.id])

  const fetchServiceDetails = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get(`/services/${params.id}`)
      setService(data.service)
      setRelatedServices(data.relatedServices || [])
      setRatings(data.ratings)
      setFaqs(data.faqs || [])
    } catch (error) {
      console.error('Failed to fetch service details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          <p className="mt-4 text-slate-300">Loading service details...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-slate-300 text-center mb-6">Service not found</p>
          <Button onClick={() => router.back()} className="w-full bg-amber-500 hover:bg-amber-600 text-black">
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-slate-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white text-balance">{service.name}</h1>
            <p className="text-slate-400 text-sm mt-1">{service.category}</p>
          </div>
          <Badge variant="secondary" className={`${service.online_available ? 'bg-green-500/20 text-green-300' : 'bg-slate-600 text-slate-300'}`}>
            {service.online_available ? '✓ Online Available' : 'Office Only'}
          </Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide font-medium">Processing Time</p>
                <p className="text-xl font-bold text-white mt-2">{service.estimated_processing_days}</p>
                <p className="text-slate-400 text-xs mt-1">business days</p>
              </div>
              <Clock className="w-6 h-6 text-blue-400/30" />
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide font-medium">Service Fee</p>
                <p className="text-xl font-bold text-white mt-2">ETB {Number(service.service_fee).toFixed(2)}</p>
                <p className="text-slate-400 text-xs mt-1">one-time</p>
              </div>
              <DollarSign className="w-6 h-6 text-green-400/30" />
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide font-medium">Rating</p>
                <p className="text-xl font-bold text-white mt-2">{ratings?.average || 'N/A'}</p>
                <p className="text-slate-400 text-xs mt-1">{ratings?.totalReviews || 0} reviews</p>
              </div>
              <CheckCircle className="w-6 h-6 text-amber-400/30" />
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide font-medium">Service Type</p>
                <p className="text-white font-medium mt-2 text-sm">{service.status}</p>
                <p className="text-slate-400 text-xs mt-1">{service.agency}</p>
              </div>
              <FileText className="w-6 h-6 text-purple-400/30" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-slate-800 border border-slate-700 grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">Overview</TabsTrigger>
                <TabsTrigger value="requirements" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">Requirements</TabsTrigger>
                <TabsTrigger value="faq" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">FAQs</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Service Description</h2>
                  <p className="text-slate-300 leading-relaxed">{service.description}</p>
                </Card>

                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Description (ኢትዮጲያ)</h2>
                  <p className="text-slate-300 leading-relaxed font-amharic text-right">{service.description_am}</p>
                </Card>

                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Description (Oromo)</h2>
                  <p className="text-slate-300 leading-relaxed">{service.description_or}</p>
                </Card>
              </TabsContent>

              {/* Requirements Tab */}
              <TabsContent value="requirements" className="space-y-6">
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Required Documents</h2>
                  <div className="space-y-3">
                    {service.requirements && service.requirements.length > 0 ? (
                      service.requirements.map((req: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-300">{req}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-400">No specific requirements listed</p>
                    )}
                  </div>
                </Card>

                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Application Steps</h2>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">1</span>
                      <div>
                        <p className="font-medium text-white">Prepare Documents</p>
                        <p className="text-sm text-slate-400">Gather all required documents and information</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">2</span>
                      <div>
                        <p className="font-medium text-white">{service.online_available ? 'Submit Online' : 'Visit Office'}</p>
                        <p className="text-sm text-slate-400">{service.online_available ? 'Submit your application through our online portal' : 'Visit the office with your documents'}</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">3</span>
                      <div>
                        <p className="font-medium text-white">Pay Fee</p>
                        <p className="text-sm text-slate-400">Pay the service fee of ETB {Number(service.service_fee).toFixed(2)}</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm">4</span>
                      <div>
                        <p className="font-medium text-white">Wait for Processing</p>
                        <p className="text-sm text-slate-400">Your application will be processed within {service.estimated_processing_days} business days</p>
                      </div>
                    </li>
                  </ol>
                </Card>
              </TabsContent>

              {/* FAQ Tab */}
              <TabsContent value="faq" className="space-y-4">
                {faqs.length > 0 ? (
                  faqs.map((faq, idx) => (
                    <Card key={idx} className="bg-slate-800 border-slate-700 p-6">
                      <details className="group">
                        <summary className="flex cursor-pointer items-center justify-between font-medium text-white hover:text-amber-300 transition-colors">
                          {faq.question}
                          <span className="transition-transform group-open:rotate-180">▼</span>
                        </summary>
                        <div className="mt-4 space-y-2 text-slate-300">
                          <p className="pb-2 border-b border-slate-700">{faq.answer}</p>
                          <p className="pt-2 text-sm italic">{faq.question_am}</p>
                        </div>
                      </details>
                    </Card>
                  ))
                ) : (
                  <Card className="bg-slate-800 border-slate-700 p-6 text-center">
                    <p className="text-slate-400">No FAQs available for this service yet</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Contact & Related */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border-amber-700/50 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Get Help</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase text-slate-400 font-medium mb-1">Agency</p>
                  <p className="text-amber-100 font-medium">{service.agency}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400 font-medium mb-1">Email</p>
                  <a href={`mailto:${service.contact_email}`} className="text-amber-300 hover:text-amber-200 flex items-center gap-2 break-all">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    {service.contact_email}
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase text-slate-400 font-medium mb-1">Phone</p>
                  <a href={`tel:${service.contact_phone}`} className="text-amber-300 hover:text-amber-200 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {service.contact_phone}
                  </a>
                </div>
              </div>
              <Button className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-black font-medium">
                Start Application
              </Button>
            </Card>

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Related Services</h3>
                <div className="space-y-3">
                  {relatedServices.map((relService) => (
                    <button
                      key={relService.id}
                      onClick={() => router.push(`/citizen/services/${relService.id}`)}
                      className="w-full text-left p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors group"
                    >
                      <p className="font-medium text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                        {relService.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{relService.description}</p>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Chat Assistant Card */}
            <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-2">Need More Help?</h3>
              <p className="text-sm text-slate-300 mb-4">Chat with our AI assistant to get detailed guidance about this service</p>
              <Button onClick={() => router.push('/citizen/chatbot')} className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Ask AI Assistant
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
