'use client'

import { Card } from "@/components/ui/card"
import { FileSearch, Folder, FolderSearch, Search } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import React, {useState } from "react"

export default function Component({ children }: { children: React.ReactNode }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
      {/* Left Section - Hero/Branding */}
      <div className="relative hidden bg-[#0066FF] lg:block">
        <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(white,transparent_85%)] animate-fade-in" />
        <div 
          className="absolute inset-0 opacity-50 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgb(255 255 255 / 0.15), transparent 25%)`
          }}
        />
        <div className="relative flex h-full flex-col items-center justify-center p-12"
             onMouseMove={handleMouseMove}
             onMouseEnter={() => setIsHovered(true)}
             onMouseLeave={() => setIsHovered(false)}>
          <div className="space-y-8 text-center">
            <div className="space-y-4 text-white">
              <h1 className="animate-fade-up text-5xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none">
                Manage your files the best way
              </h1>
              <p className="mx-auto max-w-[600px] animate-fade-up text-xl text-white/80 sm:text-2xl [animation-delay:200ms]">
                This is a place where you can store all your documents
              </p>
            </div>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl perspective-1000">
              {/* Floating elements */}
              <div className="absolute -left-4 top-4 animate-float-slow">
                <Folder className="h-12 w-12 text-white/30" />
              </div>
              <div className="absolute -right-4 bottom-4 animate-float">
                <FileSearch className="h-12 w-12 text-white/30" />
              </div>
              <div className="absolute left-1/4 -top-8 animate-float-slow [animation-delay:500ms]">
                <Search className="h-8 w-8 text-white/20" />
              </div>

              {/* Main card */}
              <Card 
                className={`relative overflow-hidden border-white/10 bg-white/10 p-8 backdrop-blur-sm transition-transform duration-700 ease-out ${
                  isHovered ? 'rotate-x-12' : 'rotate-x-0'
                }`}
              >
                <div className="flex items-center gap-4">
                  <FolderSearch className="h-16 w-16 text-white animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-shimmer rounded-lg bg-gradient-to-r from-white/20 via-white/30 to-white/20 bg-[length:400%_100%]" />
                    <div className="h-4 w-24 animate-shimmer rounded-lg bg-gradient-to-r from-white/20 via-white/30 to-white/20 bg-[length:400%_100%] [animation-delay:200ms]" />
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 rounded-lg bg-white/20 transition-transform duration-300"
                      style={{
                        transform: isHovered ? `translateZ(${Math.random() * 20}px)` : 'none',
                        transition: `transform 600ms ease-out ${i * 50}ms`
                      }}
                    />
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Auth Form */}
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-[420px] space-y-12">
          <div className="flex justify-center">
            <Image
              src="/newlogo.png"
              alt="StoreDoc"
              width={280}
              height={90}
              className="h-auto w-[280px] animate-fade-up"
              priority
            />
          </div>

          <Card className="animate-fade-up border-none p-8 shadow-2xl [animation-delay:200ms]">
            <div className="space-y-8">{children}</div>
          </Card>

          <div className="animate-fade-up text-center text-sm text-muted-foreground [animation-delay:400ms]">
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Need help? Contact support
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .rotate-x-12 {
          transform: rotateX(12deg);
        }

        .rotate-x-0 {
          transform: rotateX(0deg);
        }

        .animate-fade-up {
          animation: fade-up 0.5s ease-out forwards;
          opacity: 0;
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}