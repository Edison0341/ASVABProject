"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/nav/navbar"

export function Hero() {
  const router = useRouter()

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="w-screen relative -mx-4 -mt-8 left-[calc(-50vw+50%+1rem)]" style={{ width: '100vw' }}>
      <Navbar />
      
      {/* Hero Section with Background Image - Full Width, No Margins */}
      <div 
        style={{
          position: 'relative',
          width: '100vw',
          height: '80vh',
          backgroundImage: 'url("/military1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          margin: 0,
          padding: 0
        }}
      >
        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }} />
        
        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '5rem'
        }}>
          <div style={{ width: '100%' }}>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-200/10 hover:ring-gray-200/20 bg-white/10">
                  <span className="text-gray-100">
                    Start preparing for your military career.{" "}
                    <button 
                      onClick={scrollToFeatures}
                      className="font-semibold text-white cursor-pointer"
                    >
                      Learn more <span aria-hidden="true">&rarr;</span>
                    </button>
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                  ASVAB Practice Tests
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-200">
                  Comprehensive practice tests for all ASVAB categories. Track your progress, 
                  get instant feedback, and improve your scores with AI-powered assistance.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Button 
                    size="lg"
                    className="bg-[#000A1F] hover:bg-white hover:text-[#000A1F] text-white font-semibold rounded-lg transition-all duration-200 border-2 border-transparent hover:border-[#000A1F]"
                    onClick={() => router.push('/practice')}
                  >
                    Start Practice Test
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-[#000A1F] dark:text-white border-white hover:text-white"
                    onClick={() => {
                      const section = document.getElementById('categories-section');
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    View Categories
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
