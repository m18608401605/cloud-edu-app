import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { THEMES, LEVEL_NAMES, getNextLevelPoints } from '../data'

export function Header() {
  const { appState } = useStore()
  const theme = THEMES.find(t => t.id === appState.currentTheme)!
  const levelName = LEVEL_NAMES[appState.level - 1] ?? '传奇英雄'
  const nextLevelPts = getNextLevelPoints(appState.level)
  const prevLevelPts = getNextLevelPoints(appState.level - 1)
  const progress = Math.min(100, ((appState.totalPoints - prevLevelPts) / (nextLevelPts - prevLevelPts)) * 100)

  return (
    <div className="relative z-10 px-4 pt-6 pb-4">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between mb-4">
        {/* 角色头像 + 等级 */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg, #cc0000, #ff4444)', boxShadow: '0 0 20px #ff444466, 0 0 40px #ff000033' }}>
              🐷
            </div>
            {/* 等级徽章 */}
            <div className="absolute -bottom-1 -right-1 text-xs font-black px-1.5 py-0.5 rounded-full"
              style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000' }}>
              Lv{appState.level}
            </div>
          </motion.div>

          <div>
            <div className="text-white font-black text-lg leading-tight">超级英雄</div>
            <div className="text-xs font-bold" style={{ color: theme.primary }}>{levelName}</div>
          </div>
        </div>

        {/* 连续打卡 */}
        <div className="flex items-center gap-4">
          <motion.div
            className="flex flex-col items-center px-3 py-2 rounded-xl"
            style={{ background: 'rgba(255,107,0,0.15)', border: '1px solid rgba(255,107,0,0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">{appState.streak >= 7 ? '🔥' : appState.streak >= 3 ? '⚡' : '✨'}</span>
            <span className="text-white font-black text-sm">{appState.streak}</span>
            <span className="text-gray-400 text-xs">连续天</span>
          </motion.div>

          {/* 总积分 */}
          <motion.div
            className="flex flex-col items-center px-3 py-2 rounded-xl"
            style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.4)' }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">⚡</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={appState.totalPoints}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-black text-sm"
                style={{ color: '#FFD700' }}
              >
                {appState.totalPoints}
              </motion.span>
            </AnimatePresence>
            <span className="text-gray-400 text-xs">总能量</span>
          </motion.div>
        </div>
      </div>

      {/* 等级进度条 */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-gray-400">成长能量槽</span>
          <span className="text-xs font-bold" style={{ color: theme.primary }}>
            {appState.totalPoints} / {nextLevelPts}
          </span>
        </div>
        <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
              boxShadow: `0 0 10px ${theme.primary}88`
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{levelName}</span>
          <span className="text-xs text-gray-500">{LEVEL_NAMES[appState.level] ?? '满级'}</span>
        </div>
      </div>
    </div>
  )
}
