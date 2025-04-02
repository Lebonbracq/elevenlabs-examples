"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft } from "lucide-react"

export default function GlowBubble() {
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
      const moveX = Math.sin(Date.now() / 1000) * 5
      const moveY = Math.cos(Date.now() / 1500) * 5
      glow.style.transform = `translate(${moveX}px, ${moveY}px)`

      // Subtle opacity changes
      const opacityChange = ((Math.sin(Date.now() / 800) + 1) / 2) * 0.2 + 0.8
      glow.style.opacity = isActive ? opacityChange.toString() : "0.8"

      requestAnimationFrame(animateGlow)
    }

    // Animation for the pulse effect
    const animatePulse = () => {
      const pulse = pulseRef.current
      if (!pulse) return

      if (isActive) {
        pulse.style.animation = "pulse 2s infinite"
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] relative">
      <style jsx global>{`
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.7);
          }
          
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 20px rgba(66, 153, 225, 0);
          }
          
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
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
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>

      <div className="w-full max-w-md h-screen flex flex-col items-center justify-center relative">
        <button className="absolute top-6 left-6 text-white/70 hover:text-white transition-colors">
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
                  "radial-gradient(circle at 30% 30%, rgba(74, 222, 255, 0.4) 0%, rgba(56, 189, 248, 0.2) 50%, rgba(29, 78, 216, 0.1) 100%)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Outer glow */}
              <div
                ref={glowRef}
                className="absolute w-[200px] h-[200px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(56, 189, 248, 0.5) 0%, rgba(56, 189, 248, 0.2) 40%, transparent 70%)",
                  filter: "blur(20px)",
                  opacity: 0.8,
                  transition: "opacity 0.5s ease",
                }}
              />

              {/* Pulse effect */}
              <div
                ref={pulseRef}
                className="absolute w-[180px] h-[180px] rounded-full"
                style={{
                  boxShadow: isActive
                    ? "0 0 30px 10px rgba(56, 189, 248, 0.5)"
                    : "0 0 20px 5px rgba(56, 189, 248, 0.3)",
                  transition: "box-shadow 0.5s ease",
                }}
              />

              {/* Inner core */}
              <div
                className="w-[120px] h-[120px] rounded-full relative overflow-hidden"
                style={{
                  background:
                    "radial-gradient(circle at 40% 40%, rgba(224, 242, 254, 0.9) 0%, rgba(56, 189, 248, 0.8) 50%, rgba(29, 78, 216, 0.7) 100%)",
                  boxShadow: "inset 0 0 20px rgba(0, 0, 0, 0.2)",
                }}
              >
                {/* Energy swirl */}
                <div
                  className="absolute inset-0 opacity-70"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.8), transparent, transparent)",
                    animation: `rotate ${isActive ? "8s" : "15s"} linear infinite`,
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
                  animation: `rotate ${isActive ? "10s" : "20s"} linear infinite`,
                }}
              >
                <div
                  className="absolute w-[8px] h-[8px] rounded-full bg-blue-200"
                  style={{
                    top: "0%",
                    left: "50%",
                    boxShadow: "0 0 10px 2px rgba(191, 219, 254, 0.8)",
                    opacity: isActive ? 0.9 : 0.6,
                  }}
                />
                <div
                  className="absolute w-[6px] h-[6px] rounded-full bg-blue-300"
                  style={{
                    top: "25%",
                    right: "10%",
                    boxShadow: "0 0 8px 2px rgba(147, 197, 253, 0.8)",
                    opacity: isActive ? 0.9 : 0.6,
                  }}
                />
                <div
                  className="absolute w-[10px] h-[10px] rounded-full bg-cyan-200"
                  style={{
                    bottom: "15%",
                    left: "20%",
                    boxShadow: "0 0 12px 3px rgba(165, 243, 252, 0.8)",
                    opacity: isActive ? 0.9 : 0.6,
                  }}
                />
              </div>

              {/* Opposite direction orbiting particles */}
              <div
                className="absolute w-[140px] h-[140px] rounded-full"
                style={{
                  animation: `rotate ${isActive ? "15s" : "25s"} linear infinite reverse`,
                }}
              >
                <div
                  className="absolute w-[7px] h-[7px] rounded-full bg-indigo-200"
                  style={{
                    bottom: "10%",
                    right: "30%",
                    boxShadow: "0 0 10px 2px rgba(199, 210, 254, 0.8)",
                    opacity: isActive ? 0.9 : 0.6,
                  }}
                />
                <div
                  className="absolute w-[5px] h-[5px] rounded-full bg-sky-100"
                  style={{
                    top: "40%",
                    left: "5%",
                    boxShadow: "0 0 8px 2px rgba(224, 242, 254, 0.8)",
                    opacity: isActive ? 0.9 : 0.6,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <h1 className="text-2xl font-medium text-white mb-2">Assistant IA</h1>
            <p className="text-blue-200/70 text-sm">
              {isActive ? "Je vous écoute. Comment puis-je vous aider ?" : "Touchez pour activer l'assistant"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

