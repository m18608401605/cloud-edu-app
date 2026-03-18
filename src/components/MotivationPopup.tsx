import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { THEMES } from '../data'

export function MotivationPopup() {
  const { showMotivation, motivationText, hideMotivation, appState } = useStore()
  const theme = THEMES.find(t => t.id === appState.currentTheme)!

  return (
    <AnimatePresence>
      {showMotivation && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
          onClick={hideMotivation}
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="relative flex flex-col items-center p-8 rounded-3xl mx-6"
            style={{
              background: 'linear-gradient(135deg, rgba(10,5,32,0.95), rgba(26,10,62,0.95))',
              border: `2px solid ${theme.primary}66`,
              boxShadow: `0 0 40px ${theme.primary}44, 0 0 80px ${theme.secondary}22`,
            }}
          >
            {/* 粒子环绕 */}
            {[...Array(8)].map((_, i) => (
              <motion.div key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{ background: theme.primary }}
                animate={{
                  x: Math.cos(i * 45 * Math.PI / 180) * 80,
                  y: Math.sin(i * 45 * Math.PI / 180) * 80,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{ duration: 1, delay: i * 0.1, repeat: 2 }}
              />
            ))}

            {/* 猪猪侠 */}
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.8, repeat: 2 }}
              className="text-7xl mb-4"
            >🐷</motion.div>

            {/* 任务完成文字 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-2xl font-black text-center mb-2"
              style={{ color: theme.accent }}
            >任务完成！</motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-base font-bold text-center text-white/80 mb-4 max-w-xs"
            >{motivationText}</motion.div>

            {/* 积分获得提示 */}
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}
              className="px-6 py-2 rounded-full font-black text-black text-lg"
              style={{ background: `linear-gradient(135deg, ${theme.accent}, #FFA500)` }}
            >⚡ 能量 +积分！</motion.div>

            <div className="text-gray-500 text-sm mt-4">点击任意处继续</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
