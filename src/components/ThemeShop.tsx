import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'
import { THEMES } from '../data'
import { PIGGY_STICKERS } from '../data/piggyStickers'

export function ThemeShop() {
  const { appState, setTheme, unlockTheme } = useStore()

  return (
    <div className="relative z-10 px-4 space-y-3">
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">{PIGGY_STICKERS.cool}</div>
        <div className="text-white font-black text-lg">选择你的宇宙主题</div>
        <div className="text-gray-400 text-sm">用积分解锁更多主题！</div>
      </div>

      {THEMES.map((theme, i) => {
        const isUnlocked = appState.unlockedThemes.includes(theme.id)
        const isActive = appState.currentTheme === theme.id
        const canUnlock = appState.totalPoints >= theme.unlockCost && !isUnlocked

        return (
          <motion.div key={theme.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{
              background: isActive
                ? `linear-gradient(135deg, ${theme.primary}22, ${theme.secondary}11)`
                : 'rgba(255,255,255,0.04)',
              border: `2px solid ${isActive ? theme.primary : isUnlocked ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)'}`,
              boxShadow: isActive ? `0 0 20px ${theme.primary}33` : 'none',
            }}>
            {/* 主题预览 */}
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: theme.bg.includes('linear') ? theme.bg : `linear-gradient(135deg, ${theme.bg}, ${theme.cardBg})`, border: `1px solid ${theme.primary}44` }}>
              {theme.emoji}
            </div>

            <div className="flex-1">
              <div className="font-black text-white">{theme.name}</div>
              <div className="flex gap-2 mt-1">
                {[theme.primary, theme.secondary, theme.accent].map((c, j) => (
                  <div key={j} className="w-4 h-4 rounded-full" style={{ background: c }} />
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            {isActive ? (
              <div className="px-3 py-1.5 rounded-full text-xs font-black"
                style={{ background: `${theme.primary}22`, color: theme.primary, border: `1px solid ${theme.primary}44` }}>
                使用中 ✓
              </div>
            ) : isUnlocked ? (
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => setTheme(theme.id)}
                className="px-3 py-1.5 rounded-full text-xs font-black text-black"
                style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
                切换
              </motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.92 }}
                onClick={() => canUnlock && unlockTheme(theme.id)}
                className="flex flex-col items-center px-3 py-1.5 rounded-full text-xs font-black"
                style={{
                  background: canUnlock ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'rgba(255,255,255,0.08)',
                  color: canUnlock ? '#000' : '#555',
                }}>
                <span>🔒</span>
                <span>⚡{theme.unlockCost}</span>
              </motion.button>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
