import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-background border-t border-neutral-200/50 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        {/* Logo in the middle */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="h-8 flex items-center justify-center">
              <Image 
                src="/images/logo.svg" 
                alt="FeedbackIQ Logo" 
                width={120} 
                height={32}
                className="h-full w-auto antialiased"
                style={{
                  imageRendering: 'crisp-edges',
                  shapeRendering: 'geometricPrecision'
                }}
                unoptimized
              />
            </div>
          </Link>
        </div>

        {/* About and Privacy Policy links */}
        <div className="flex justify-center space-x-8 mb-8">
          <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
            About
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
            Privacy Policy
          </Link>
        </div>

        {/* Made with love */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Made with ❤️ by MC
          </p>
        </div>
      </div>
    </footer>
  )
}
