"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft } from "lucide-react"

export default function SoftGlowBubble() {
  const [isActive, setIsActive] = useState(false)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const pulseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bubbleRef.current || !glowRef.current || !pulseRef.current) return

    // Animation for the glow effect
    const animateGlow = () => {
      const glow = glowRef.current
      if (!glow) return

      // Random subtle movement for the glow
      const moveX = Math.sin(Date.now() / 1200) * 4
      const moveY = Math.cos(Date.now() / 1500) * 4
      glow.style.transform = `translate(${moveX}px, ${moveY}px)`

      // Subtle opacity changes
      const opacityChange = ((Math.sin(Date.now() / 1000) + 1) / 2) * 0.15 + 0.6
      glow.style.opacity = isActive ? opacityChange.toString() : "0.6"

      requestAnimationFrame(animateGlow)
    }

    // Animation for the pulse effect
    const animatePulse = () => {
      const pulse = pulseRef.current
      if (!pulse) return

      if (isActive) {
        pulse.style.animation = "pulse 3s infinite"
      } else {
        pulse.style.animation = "none"
      }
    }

    const animationId = requestAnimationFrame(animateGlow)
    animatePulse()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [isActive])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 relative">
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(0.98);
            box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.4);
          }
          
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 15px rgba(96, 165, 250, 0);
          }
          
          100% {
            transform: scale(0.98);
            box-shadow: 0 0 0 0 rgba(96, 165, 250, 0);
          }
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>

      {/* Soft blue gradient background elements */}
      <div className="absolute top-[10%] left-[15%] w-[300px] h-[300px] rounded-full bg-blue-100/40 filter blur-[80px]"></div>
      <div className="absolute bottom-[15%] right-[10%] w-[250px] h-[250px] rounded-full bg-blue-200/30 filter blur-[70px]"></div>
      <div className="absolute top-[40%] right-[20%] w-[200px] h-[200px] rounded-full bg-indigo-100/30 filter blur-[60px]"></div>

      <div className="w-full max-w-md h-screen flex flex-col items-center justify-center relative">
        <button className="absolute top-6 left-6 text-blue-500/70 hover:text-blue-600 transition-colors">
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-col items-center justify-center flex-1">
          <div
            className="relative w-[300px] h-[300px] flex items-center justify-center cursor-pointer"
            onClick={() => setIsActive(!isActive)}
          >
            {/* Main bubble container */}
            <div
              ref={bubbleRef}
              className="relative w-[180px] h-[180px] rounded-full flex items-center justify-center"
              style={{
                animation: "float 6s ease-in-out infinite",
                background:
                  "radial-gradient(circle at 30% 30%, rgba(219, 234, 254, 0.9) 0%, rgba(191, 219, 254, 0.8) 50%, rgba(147, 197, 253, 0.7) 100%)",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 20px rgba(186, 230, 253, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.8)",
              }}
            >
              {/* Outer glow */}
              <div
                ref={glowRef}
                className="absolute w-[220px] h-[220px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(96, 165, 250, 0.3) 0%, rgba(96, 165, 250, 0.1) 40%, transparent 70%)",
                  filter: "blur(15px)",
                  opacity: 0.6,
                  transition: "opacity 0.5s ease",
                }}
              />

              {/* Pulse effect */}
              <div
                ref={pulseRef}
                className="absolute w-[180px] h-[180px] rounded-full"
                style={{
                  boxShadow: isActive ? "0 0 25px 5px rgba(96, 165, 250, 0.3)" : "0 0 15px 3px rgba(96, 165, 250, 0.2)",
                  transition: "box-shadow 0.5s ease",
                }}
              />

              {/* Inner core */}
              <div
                className="w-[120px] h-[120px] rounded-full relative overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 40% 40%, rgba(239, 246, 255, 0.95) 0%, rgba(147, 197, 253, 0.85) 60%, rgba(96, 165, 250, 0.75) 100%)",
                  boxShadow: "inset 0 0 15px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Energy swirl */}
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.8), transparent, transparent)",
                    animation: `rotate ${isActive ? "12s" : "20s"} linear infinite`,
                    mixBlendMode: "overlay",
                  }}
                />

                {/* Highlight */}
                <div
                  className="absolute w-[40px] h-[40px] rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%)",
                    top: "30%",
                    left: "30%",
                  }}
                />
              </div>

              {/* Orbiting light particles */}
              <div
                className="absolute w-[160px] h-[160px] rounded-full"
                style={{
                  animation: `rotate ${isActive ? "15s" : "25s"} linear infinite`,
                }}
              >
                <div
                  className="absolute w-[6px] h-[6px] rounded-full bg-blue-200"
                  style={{
                    top: "5%",
                    left: "50%",
                    boxShadow: "0 0 8px 1px rgba(191, 219, 254, 0.7)",
                    opacity: isActive ? 0.9 : 0.6,
                  }}
                />
                <div
                  className="absolute w-[4px] h-[4px] rounded-full bg-blue-300"
                  style={{
                    top: "25%",
                    right: "15%",
                    boxShadow: "0 0 6px 1px rgba(147, 197, 253, 0.7)",
                    opacity: isActive ? 0.9 : 0.6,
                  }}
                />
                <div
                  className="absolute w-[5px] h-[5px] rounded-full bg-sky-200"
                  style={{
                    bottom: "20%",
                    left: "25%",
                    boxShadow: "0 0 7px 1px rgba(186, 230, 253, 0.7)",
                    opacity: isActive ? 0.9 : 0.6,
                  }}
                />
              </div>

              {/* Opposite direction orbiting particles */}
              <div
                className="absolute w-[140px] h-[140px] rounded-full"
                style={{
                  animation: `rotate ${isActive ? "20s" : "30s"} linear infinite reverse`,
                }}
              >
                <div
                  className="absolute w-[5px] h-[5px] rounded-full bg-indigo-200"
                  style={{
                    bottom: "15%",
                    right: "30%",
                    boxShadow: "0 0 7px 1px rgba(199, 210, 254, 0.7)",
                    opacity: isActive ? 0.9 : 0.6,
                  }}
                />
                <div
                  className="absolute w-[4px] h-[4px] rounded-full bg-sky-100"
                  style={{
                    top: "40%",
                    left: "10%",
                    boxShadow: "0 0 6px 1px rgba(224, 242, 254, 0.7)",
                    opacity: isActive ? 0.9 : 0.6,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <h1 className="text-2xl font-medium text-blue-700 mb-2">Assistant IA</h1>
            <p className="text-blue-500/80 text-sm">
              {isActive ? "Je vous écoute. Comment puis-je vous aider ?" : "Touchez pour activer l'assistant"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

