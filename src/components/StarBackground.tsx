import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// 猪猪侠 SVG 剪影路径
const PIGGY_SVG = `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <!-- 身体 -->
  <ellipse cx="40" cy="48" rx="22" ry="18" fill="currentColor"/>
  <!-- 头 -->
  <circle cx="40" cy="28" r="16" fill="currentColor"/>
  <!-- 猪鼻子 -->
  <ellipse cx="40" cy="32" rx="8" ry="6" fill="currentColor" opacity="0.7"/>
  <!-- 耳朵 -->
  <ellipse cx="26" cy="16" rx="6" ry="8" fill="currentColor" transform="rotate(-15 26 16)"/>
  <ellipse cx="54" cy="16" rx="6" ry="8" fill="currentColor" transform="rotate(15 54 16)"/>
  <!-- 斗篷 -->
  <path d="M18 50 Q40 75 62 50 L62 60 Q40 85 18 60 Z" fill="currentColor" opacity="0.8"/>
  <!-- 手臂 -->
  <ellipse cx="16" cy="50" rx="6" ry="10" fill="currentColor" transform="rotate(-30 16 50)"/>
  <ellipse cx="64" cy="50" rx="6" ry="10" fill="currentColor" transform="rotate(30 64 50)"/>
</svg>`

// 小伙伴1 - 火箭猪
const ROCKET_SVG = `<svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="30" cy="35" rx="12" ry="10" fill="currentColor"/>
  <circle cx="30" cy="22" r="10" fill="currentColor"/>
  <ellipse cx="30" cy="26" rx="5" ry="4" fill="currentColor" opacity="0.6"/>
  <ellipse cx="22" cy="14" rx="4" ry="5" fill="currentColor"/>
  <ellipse cx="38" cy="14" rx="4" ry="5" fill="currentColor"/>
  <path d="M20 40 L10 55 L20 50 Z" fill="currentColor" opacity="0.7"/>
  <path d="M40 40 L50 55 L40 50 Z" fill="currentColor" opacity="0.7"/>
  <path d="M25 45 L20 65 L30 58 L40 65 L35 45 Z" fill="currentColor" opacity="0.5"/>
</svg>`

// 小伙伴2 - 星星猪
const STAR_PIG_SVG = `<svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
  <circle cx="35" cy="35" r="20" fill="currentColor"/>
  <ellipse cx="35" cy="38" rx="7" ry="5" fill="currentColor" opacity="0.6"/>
  <ellipse cx="24" cy="22" rx="5" ry="6" fill="currentColor"/>
  <ellipse cx="46" cy="22" rx="5" ry="6" fill="currentColor"/>
  <polygon points="35,5 38,15 48,15 40,22 43,32 35,26 27,32 30,22 22,15 32,15" fill="currentColor" opacity="0.4"/>
</svg>`

// 浮动的赛博元素
const FLOATING_ELEMENTS = [
  { svg: PIGGY_SVG, size: 60, color: '#ff2d7833', delay: 0, duration: 20, x: '10%', amplitude: 40 },
  { svg: PIGGY_SVG, size: 45, color: '#00ffff22', delay: 5, duration: 25, x: '75%', amplitude: 30 },
  { svg: ROCKET_SVG, size: 40, color: '#FFD70033', delay: 2, duration: 18, x: '30%', amplitude: 50 },
  { svg: ROCKET_SVG, size: 30, color: '#b44fff33', delay: 8, duration: 22, x: '60%', amplitude: 35 },
  { svg: STAR_PIG_SVG, size: 35, color: '#00ff8833', delay: 3, duration: 28, x: '85%', amplitude: 25 },
  { svg: STAR_PIG_SVG, size: 50, color: '#ff2d7822', delay: 12, duration: 20, x: '45%', amplitude: 45 },
  { svg: PIGGY_SVG, size: 35, color: '#00ffff18', delay: 7, duration: 32, x: '20%', amplitude: 30 },
  { svg: ROCKET_SVG, size: 28, color: '#FFD70022', delay: 15, duration: 24, x: '92%', amplitude: 20 },
]

export function StarBackground({ isLight, starBrightness = 60 }: { isLight?: boolean; starBrightness?: number }) {
  if (isLight) return null
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const brightnessRef = useRef(starBrightness)

  useEffect(() => { brightnessRef.current = starBrightness }, [starBrightness])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const cv = canvas
    cv.width = window.innerWidth
    cv.height = window.innerHeight

    // 星星
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * cv.width,
      y: Math.random() * cv.height,
      r: Math.random() * 1.8 + 0.3,
      opacity: Math.random(),
      delta: (Math.random() - 0.5) * 0.015,
      color: Math.random() > 0.8 ? '#00ffff' : Math.random() > 0.6 ? '#ff2d78' : '#ffffff',
    }))

    // 流星
    let meteors: { x: number; y: number; len: number; speed: number; opacity: number; angle: number }[] = []
    const spawnMeteor = () => {
      if (Math.random() < 0.015) {
        meteors.push({
          x: Math.random() * cv.width,
          y: Math.random() * cv.height * 0.5,
          len: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 4,
          opacity: 1,
          angle: Math.PI / 6,
        })
      }
      meteors = meteors.filter(m => m.opacity > 0)
    }

    let raf: number
    function draw() {
      ctx.clearRect(0, 0, cv.width, cv.height)
      const b = brightnessRef.current / 100

      // 画星星
      stars.forEach(s => {
        s.opacity += s.delta
        if (s.opacity <= 0 || s.opacity >= 1) s.delta *= -1
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        const eff = s.opacity * b
        if (s.color === '#ffffff') ctx.fillStyle = `rgba(255,255,255,${eff})`
        else if (s.color === '#00ffff') ctx.fillStyle = `rgba(0,255,255,${eff * 0.7})`
        else ctx.fillStyle = `rgba(255,45,120,${eff * 0.6})`
        ctx.fill()
      })

      // 画流星
      spawnMeteor()
      meteors.forEach(m => {
        const grad = ctx.createLinearGradient(m.x, m.y, m.x + Math.cos(m.angle) * m.len, m.y + Math.sin(m.angle) * m.len)
        grad.addColorStop(0, `rgba(255,255,255,${m.opacity})`)
        grad.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x + Math.cos(m.angle) * m.len, m.y + Math.sin(m.angle) * m.len)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()
        m.x += Math.cos(m.angle) * m.speed
        m.y += Math.sin(m.angle) * m.speed
        m.opacity -= 0.02
      })

      raf = requestAnimationFrame(draw)
    }
    draw()

    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight }
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />

      {/* 浮动猪猪侠剪影 */}
      {FLOATING_ELEMENTS.map((el, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none"
          style={{
            left: el.x,
            top: `${10 + (i * 12) % 80}%`,
            width: el.size,
            height: el.size,
            color: el.color,
            zIndex: 0,
            filter: `blur(${i % 3 === 0 ? 0.5 : 1}px)`,
          }}
          animate={{
            y: [-el.amplitude / 2, el.amplitude / 2, -el.amplitude / 2],
            x: [0, el.amplitude * 0.3, -el.amplitude * 0.2, 0],
            rotate: [-5, 5, -5],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          dangerouslySetInnerHTML={{ __html: el.svg }}
        />
      ))}

      {/* 网格线光效 */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </>
  )
}
