'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { ShineBorder } from '@/components/magicui/shine-border'
import { PulsatingButton } from '@/components/magicui/pulsating-button'
import { DisclaimerModal, useFirstVisitModal } from '@/components/ui/disclaimer-modal'
import Link from 'next/link'

export default function Home() {
  const { isModalOpen, closeModal } = useFirstVisitModal()

  return (
    <div>
      <DisclaimerModal isOpen={isModalOpen} onClose={closeModal} />

      {/* Hero Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                FeedbackIQ<br />
                <span className="text-orange-600">for Business</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Create powerful surveys, collect valuable feedback, and grow your business with intelligent insights.
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
              <Link href="/auth">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-500 text-white">
                  Start Your Business Account
                </Button>
              </Link>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Learn more
              </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/images/dashboard_banner.jpg"
                  alt="FeedbackIQ Business Dashboard Preview"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute top-2 right-2">
                  <PulsatingButton 
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 rounded-md"
                    pulseColor="#f97316"
                    duration="2s"
                  >
                    @0xTNT888
                  </PulsatingButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Everything Your Business Needs
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Powerful survey tools designed specifically for businesses to collect, analyze, and act on customer feedback.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-orange-500 rounded"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Survey Builder</h3>
                <p className="text-sm text-gray-600">Create professional surveys with drag-and-drop simplicity</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-500 rounded"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-sm text-gray-600">Get real-time insights and detailed analytics</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="w-8 h-8 bg-green-500 rounded"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Easy Sharing</h3>
                <p className="text-sm text-gray-600">Share via QR codes, links, or embed on your website</p>
              </div>
            </div>
            
            <Link href="/auth">
              <Button className="bg-orange-600 hover:bg-orange-500 text-white" size="lg">
                Start Building Surveys
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Business Benefits Section */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Businesses Choose FeedbackIQ
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of businesses already collecting valuable feedback
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Satisfaction</h3>
              <p className="text-sm text-gray-600 mb-4">Measure and improve customer satisfaction with targeted surveys</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-green-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Product Feedback</h3>
              <p className="text-sm text-gray-600 mb-4">Gather insights on your products and services to drive innovation</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Market Research</h3>
              <p className="text-sm text-gray-600 mb-4">Understand your market and identify new opportunities</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-orange-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Employee Engagement</h3>
              <p className="text-sm text-gray-600 mb-4">Boost team morale with internal feedback and pulse surveys</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-red-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Event Feedback</h3>
              <p className="text-sm text-gray-600 mb-4">Collect feedback from events, workshops, and training sessions</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-indigo-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Brand Perception</h3>
              <p className="text-sm text-gray-600 mb-4">Monitor how your brand is perceived in the market</p>
            </Card>
          </div>
        </div>
      </section>


      {/* Feedback Section */}
      <section id="feedback" className="py-16 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Have Feedback for Us?
            </h2>
            <p className="text-lg text-gray-600">
              Not ready for a business account? Share your thoughts with us - no registration required.
            </p>
          </div>
          
          <Card className="p-6">
            <form className="space-y-4">
              <div>
                <label htmlFor="feedback-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Optional)
                </label>
                <input
                  id="feedback-name"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Feedback *
                </label>
                <textarea
                  id="feedback-message"
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Tell us what you think about FeedbackIQ or share any suggestions..."
                ></textarea>
              </div>
              
              <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white">
                Send Feedback
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-3xl text-white p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Collecting Feedback?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Join businesses worldwide who trust FeedbackIQ to gather valuable insights and drive growth.
            </p>
            
            <Link href="/auth">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-500 text-white">
                Create Your Business Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
