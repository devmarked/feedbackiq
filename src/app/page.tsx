'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { ShineBorder } from '@/components/magicui/shine-border'
import { PulsatingButton } from '@/components/magicui/pulsating-button'

import Link from 'next/link'
import { Highlighter } from "@/components/magicui/highlighter";
import { WordRotate } from "@/components/magicui/word-rotate";
import { Sparkles, Heart, Lightbulb, TrendingUp, Users, Calendar, Star } from 'lucide-react'

export default function Home() {
  return (
    <div>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
          <div className="mt-6 sm:mt-0 mb-12">
              <div className="relative inline-block">
                <Button 
                  className="relative text-base px-2 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slide" 
                       style={{
                         background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                         backgroundSize: '200% 100%',
                         animation: 'shimmer-slide 2s infinite linear'
                       }}
                  />
                  <div className="relative z-10 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    AI Powered
                  </div>
                </Button>
              </div>
            
          </div>
                          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                FeedbackIQ<br />
                {"  "}for your{"  "}
                <span className="text-[white]">
                  <WordRotate 
                    words={[" Business ", " Restaurant ", " Software ", " Product ", " App "]} 
                    duration={5000}
                    className="font-bold"
                    highlightColor="#25056f"
                  />
                </span>{" "}
              </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create powerful surveys, collect valuable feedback, and grow your business with intelligent insights.
            </p>

            <div className="flex justify-center space-x-4 mb-12">
              <Link href="/auth">
                <Button size="lg" className="bg-primary">
                  Start Your Business Account
                </Button>
              </Link>
              <Button size="lg" variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Learn more
              </Button>
            </div>
            
            {/* App Screenshot */}
            <div className="mb-8 flex justify-center">
              <Image
                src="/images/create-survey.png"
                alt="FeedbackIQ App Screenshot"
                width={800}
                height={600}
                className="rounded-2xl shadow-2xl object-contain max-w-full h-auto"
                priority
                unoptimized
              />
            </div>
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
                <Heart className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Satisfaction</h3>
              <p className="text-sm text-gray-600 mb-4">Measure and improve customer satisfaction with targeted surveys</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Product Feedback</h3>
              <p className="text-sm text-gray-600 mb-4">Gather insights on your products and services to drive innovation</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Market Research</h3>
              <p className="text-sm text-gray-600 mb-4">Understand your market and identify new opportunities</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Employee Engagement</h3>
              <p className="text-sm text-gray-600 mb-4">Boost team morale with internal feedback and pulse surveys</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Event Feedback</h3>
              <p className="text-sm text-gray-600 mb-4">Collect feedback from events, workshops, and training sessions</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-indigo-500" />
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
              
              <Button type="submit" className="w-full bg-primary text-white">
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
              <Button size="lg" className="bg-primary text-white">
                Create Your Business Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
