import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

function playConfirmSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    // 第一音：上升音
    const o1 = ctx.createOscillator()
    const g1 = ctx.createGain()
    o1.connect(g1); g1.connect(ctx.destination)
    o1.frequency.setValueAtTime(440, ctx.currentTime)
    o1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12)
    g1.gain.setValueAtTime(0.3, ctx.currentTime)
    g1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    o1.start(ctx.currentTime); o1.stop(ctx.currentTime + 0.2)
    // 第二音：更高
    const o2 = ctx.createOscillator()
    const g2 = ctx.createGain()
    o2.connect(g2); g2.connect(ctx.destination)
    o2.frequency.setValueAtTime(880, ctx.currentTime + 0.15)
    o2.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.3)
    g2.gain.setValueAtTime(0.25, ctx.currentTime + 0.15)
    g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
    o2.start(ctx.currentTime + 0.15); o2.stop(ctx.currentTime + 0.4)
  } catch (_) {}
}

export function MotivationPopup() {
  const { showMotivation, motivationText, hideMotivation } = useStore()

  const handleConfirm = () => {
    playConfirmSound()
    hideMotivation()
  }

  return (
    <AnimatePresence>
      {showMotivation && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,16,0.85)', backdropFilter: 'blur(10px)' }}
          onClick={handleConfirm}>

          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full"
              style={{ background: 'radial-gradient(circle, #00ffff18, transparent)' }}
            />
          </div>

          {/* 粒子环 */}
          {[...Array(12)].map((_, i) => (
            <motion.div key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ background: i % 2 === 0 ? '#00ffff' : '#ff2d78' }}
              animate={{
                x: Math.cos(i * 30 * Math.PI / 180) * 180,
                y: Math.sin(i * 30 * Math.PI / 180) * 180,
                opacity: [0, 1, 0],
                scale: [0, 2, 0],
              }}
              transition={{ duration: 1.5, delay: i * 0.08, repeat: Infinity, repeatDelay: 0.5 }}
            />
          ))}

          <motion.div
            initial={{ scale: 0.5, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="relative flex flex-col items-center p-8 rounded-2xl mx-6 max-w-sm w-full"
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,20,0.95), rgba(0,10,40,0.95))',
              border: '1px solid rgba(0,255,255,0.35)',
              boxShadow: '0 0 50px rgba(0,255,255,0.15), 0 0 100px rgba(255,45,120,0.08)',
            }}
            onClick={e => e.stopPropagation()}>

            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #00ffff, transparent)' }} />
            <div className="absolute bottom-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #ff2d78, transparent)' }} />

            {/* 真实猪猪侠图片 */}
            <motion.div
              animate={{
                y: [0, -18, 0],
                filter: [
                  'drop-shadow(0 0 12px #00ffff88)',
                  'drop-shadow(0 0 35px #00ffff)',
                  'drop-shadow(0 0 12px #00ffff88)'
                ]
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-36 h-36 rounded-full overflow-hidden mb-5"
              style={{
                border: '3px solid #00ffff',
                boxShadow: '0 0 30px #00ffff66, 0 0 60px #00ffff22'
              }}>
              <img
                src="/cloud-edu-app/kids-points/piggy.png"
                alt="猪猪侠"
                className="w-full h-full object-cover object-top"
                style={{ transform: 'scale(1.1) translateY(5%)' }}
              />
              {/* 扫光效果 */}
              <motion.div
                className="absolute inset-0"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', width: '40%' }}
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="cyber-title text-xl font-black mb-2 text-center"
              style={{ color: '#00ffff', textShadow: '0 0 15px #00ffff' }}>
              MISSION COMPLETE!
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-sm font-bold text-center mb-5 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.8)' }}>
              {motivationText}
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
              onClick={e => { e.stopPropagation(); handleConfirm() }}
              className="px-8 py-3 rounded-xl font-black text-black cyber-title cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                boxShadow: '0 0 25px #FFD70066',
                fontSize: '16px',
                border: '2px solid #FFD700',
              }}>
              ⚡ 能量值已获得！
            </motion.button>

            <div className="cyber-title text-gray-600 text-xs mt-4" style={{ fontSize: '10px' }}>
              TAP ANYWHERE TO CONTINUE
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
