# FeedbackIQ

> **Transform customer feedback into business growth with intelligent survey analytics**

FeedbackIQ is a comprehensive survey platform designed specifically for businesses to create, distribute, and analyze customer feedback with AI-powered insights. Built with modern web technologies and a focus on user experience, it empowers businesses to make data-driven decisions.

## 🚀 Features

### Core Platform
- **🎯 Multi-Role System**: Support for admins, businesses, and end users with role-based access control
- **📊 Business Dashboard**: Professional analytics dashboard with real-time insights
- **🔐 Secure Authentication**: Enterprise-grade security with Supabase Auth
- **📱 Responsive Design**: Mobile-first approach with beautiful, modern UI

### Survey Management
- **📝 Survey Builder**: Drag-and-drop survey creation with multiple question types
- **🎨 Custom Templates**: Pre-built templates for common business use cases
- **🔗 Easy Distribution**: QR codes, shareable links, and embed options
- **📈 Real-time Analytics**: Live response tracking and completion monitoring

### AI-Powered Insights
- **🤖 Smart Analytics**: AI-generated insights and recommendations
- **📊 Data Visualization**: Interactive charts and comprehensive reporting
- **💡 Actionable Recommendations**: Get suggestions to improve your surveys and business
- **📋 Automated Reports**: Generate professional reports with key findings

### Business Features
- **🏢 Business Profiles**: Complete business management with subscription tiers
- **👥 Team Collaboration**: Multi-user business accounts with role management
- **📊 Advanced Analytics**: Detailed response analysis and trend identification
- **🔒 Data Security**: GDPR-compliant data handling and privacy controls

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui + MagicUI components
- **Animations**: Framer Motion for smooth interactions
- **State Management**: React Context API

### Backend
- **Database**: Supabase (PostgreSQL) with real-time capabilities
- **Authentication**: Supabase Auth with role-based access
- **Storage**: Supabase Storage for file management
- **API**: Next.js API routes with TypeScript
- **Real-time**: Supabase Realtime subscriptions

### Development
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Version Control**: Git with conventional commits

## 🎯 What is FeedbackIQ?

FeedbackIQ is a modern survey platform that empowers businesses to collect, analyze, and act on customer feedback. Whether you're a startup looking to understand your market or an enterprise seeking to improve customer satisfaction, FeedbackIQ provides the tools you need to make data-driven decisions.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── business/          # Business dashboard and management
│   ├── survey/            # Public survey taking interface
│   └── profile/           # User profile management
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── business/         # Business-specific components
│   ├── survey/           # Survey-related components
│   ├── layout/           # Layout components (header, footer)
│   └── magicui/          # Custom animated components
├── contexts/             # React Context providers
│   ├── AuthContext.tsx   # Authentication state
│   ├── BusinessContext.tsx # Business data management
│   └── ProfileContext.tsx # User profile state
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── supabase/         # Supabase client configuration
│   └── utils.ts          # General utilities
└── types/                # TypeScript type definitions
```

## 🏗️ Architecture

FeedbackIQ is built with a modern, scalable architecture that ensures reliability and performance:

- **Frontend**: React-based single-page application with server-side rendering
- **Backend**: API-first design with real-time capabilities
- **Database**: Secure, scalable data storage with built-in analytics
- **Authentication**: Enterprise-grade security with role-based access control
- **AI Integration**: Smart analytics and automated insights generation

## 🎯 User Roles

### Admin
- Full system access and platform management
- User and business account oversight
- Platform analytics and system monitoring

### Business
- Create and manage surveys
- Access analytics and insights
- Manage team members and permissions
- Generate QR codes and share surveys

### User
- Take surveys (authenticated or anonymous)
- View response history
- Manage personal profile

## 📊 Current Implementation Status

### ✅ Phase 1 Complete
- [x] Multi-role authentication system
- [x] Business dashboard foundation
- [x] Database schema with RLS policies
- [x] User profile management
- [x] Role-based navigation and access control

### 🚧 Phase 2 In Progress
- [ ] Survey creation interface
- [ ] Question types and validation
- [ ] Survey preview and testing
- [ ] QR code generation
- [ ] Public survey distribution

### 📋 Phase 3 Planned
- [ ] Advanced analytics dashboard
- [ ] AI-powered insights generation
- [ ] Survey templates marketplace
- [ ] Export and reporting features
- [ ] Team collaboration tools

## 🌟 Key Benefits

### For Businesses
- **Save Time**: Create professional surveys in minutes, not hours
- **Get Insights**: AI-powered analytics reveal hidden patterns in your data
- **Scale Easily**: Handle thousands of responses without performance issues
- **Stay Secure**: Enterprise-grade security protects your data and your customers' privacy

### For Survey Respondents
- **User-Friendly**: Clean, intuitive interface that works on any device
- **Fast & Reliable**: Quick loading times and smooth user experience
- **Privacy-Focused**: Anonymous responses and transparent data handling
- **Accessible**: Designed with accessibility in mind for all users

## 🎯 Use Cases

FeedbackIQ is perfect for a wide range of business needs:

- **Customer Satisfaction Surveys**: Measure and improve customer experience
- **Product Feedback**: Gather insights on new features and improvements
- **Market Research**: Understand your target audience and market trends
- **Employee Engagement**: Internal surveys for team feedback and satisfaction
- **Event Feedback**: Collect responses from conferences, workshops, and training
- **Brand Perception**: Monitor how your brand is viewed in the market
- **NPS Surveys**: Track Net Promoter Score and customer loyalty

## 🚀 Getting Started

Ready to transform your customer feedback into actionable insights? FeedbackIQ makes it easy to create professional surveys, collect valuable responses, and gain the insights you need to grow your business.

Whether you're a small business owner, marketing professional, or enterprise team, FeedbackIQ provides the tools and intelligence you need to make data-driven decisions that drive real results.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Transform feedback into growth with FeedbackIQ** - The intelligent survey platform for modern businesses.
