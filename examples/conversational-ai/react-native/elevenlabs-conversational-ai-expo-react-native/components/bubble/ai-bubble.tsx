"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft } from "lucide-react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  alpha: number
  growing: boolean
}

export default function AIBubble() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = 300
      canvas.height = 300
    }

    updateCanvasSize()

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = []
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const colors = [
        "rgba(64, 156, 255, 0.7)",
        "rgba(120, 87, 255, 0.7)",
        "rgba(45, 211, 214, 0.7)",
        "rgba(186, 85, 255, 0.7)",
      ]

      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2
        const distance = 30 + Math.random() * 50
        const size = 2 + Math.random() * 4

        particles.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          size,
          speedX: Math.cos(angle) * 0.2,
          speedY: Math.sin(angle) * 0.2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.1 + Math.random() * 0.4,
          growing: Math.random() > 0.5,
        })
      }

      particlesRef.current = particles
    }

    initParticles()

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Draw dark circular background
      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100)
      bgGradient.addColorStop(0, "rgba(20, 20, 40, 0.9)")
      bgGradient.addColorStop(1, "rgba(10, 10, 30, 0.7)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, 90, 0, Math.PI * 2)
      ctx.fillStyle = bgGradient
      ctx.fill()

      // Draw outer glow
      const glowGradient = ctx.createRadialGradient(centerX, centerY, 80, centerX, centerY, 110)
      glowGradient.addColorStop(0, "rgba(100, 180, 255, 0.2)")
      glowGradient.addColorStop(1, "rgba(100, 180, 255, 0)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, 95, 0, Math.PI * 2)
      ctx.fillStyle = glowGradient
      ctx.fill()

      // Draw core
      const coreGradient = ctx.createRadialGradient(centerX - 10, centerY - 10, 0, centerX, centerY, 40)

      if (isActive) {
        coreGradient.addColorStop(0, "rgba(220, 240, 255, 0.9)")
        coreGradient.addColorStop(0.6, "rgba(120, 200, 255, 0.7)")
        coreGradient.addColorStop(1, "rgba(70, 130, 255, 0)")
      } else {
        coreGradient.addColorStop(0, "rgba(180, 210, 255, 0.8)")
        coreGradient.addColorStop(0.6, "rgba(100, 160, 255, 0.6)")
        coreGradient.addColorStop(1, "rgba(60, 100, 255, 0)")
      }

      ctx.beginPath()
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2)
      ctx.fillStyle = coreGradient
      ctx.fill()

      // Draw highlight
      ctx.beginPath()
      ctx.arc(centerX - 10, centerY - 10, 8, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
      ctx.fill()

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Calculate distance from center
        const dx = particle.x - centerX
        const dy = particle.y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Apply forces
        if (distance > 90) {
          // Pull back to center if too far
          particle.speedX -= dx * 0.002
          particle.speedY -= dy * 0.002
        } else if (distance < 40) {
          // Push away from center if too close
          particle.speedX += dx * 0.002
          particle.speedY += dy * 0.002
        }

        // Apply mouse influence if hovering
        if (isHovering) {
          const mdx = particle.x - mouseRef.current.x
          const mdy = particle.y - mouseRef.current.y
          const mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy)

          if (mouseDistance < 50) {
            particle.speedX += mdx * 0.01
            particle.speedY += mdy * 0.01
          }
        }

        // Apply speed limits
        const maxSpeed = 1.5
        const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY)
        if (speed > maxSpeed) {
          particle.speedX = (particle.speedX / speed) * maxSpeed
          particle.speedY = (particle.speedY / speed) * maxSpeed
        }

        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Apply friction
        particle.speedX *= 0.98
        particle.speedY *= 0.98

        // Pulse size
        if (particle.growing) {
          particle.size += 0.05
          if (particle.size > 4 + Math.random() * 2) {
            particle.growing = false
          }
        } else {
          particle.size -= 0.05
          if (particle.size < 1 + Math.random() * 2) {
            particle.growing = true
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.alpha * (isActive ? 1.3 : 1)
        ctx.fill()
        ctx.globalAlpha = 1

        // Draw connection lines to nearby particles
        particlesRef.current.slice(index + 1).forEach((otherParticle) => {
          const pdx = particle.x - otherParticle.x
          const pdy = particle.y - otherParticle.y
          const particleDistance = Math.sqrt(pdx * pdx + pdy * pdy)

          if (particleDistance < 30) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(120, 180, 255, ${0.1 * (1 - particleDistance / 30)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      // Pulse effect when active
      if (isActive) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, 90 + Math.sin(Date.now() / 500) * 5, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(100, 180, 255, 0.3)"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      cancelAnimationFrame(animationRef.current)
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isHovering, isActive])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e] relative">
      <div className="w-full max-w-md h-screen flex flex-col items-center justify-center relative">
        <button className="absolute top-6 left-6 text-white/70 hover:text-white transition-colors">
          <ChevronLeft size={24} />
        </button>

        <div className="flex flex-col items-center justify-center flex-1">
          <div
            className="relative w-[300px] h-[300px] flex items-center justify-center cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={() => setIsActive(!isActive)}
          >
            <canvas ref={canvasRef} className="absolute top-0 left-0" />
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

