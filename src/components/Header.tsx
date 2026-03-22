import { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { LEVEL_NAMES, getNextLevelPoints } from '../data'

export function Header() {
  const { appState, setCustomAvatar, currentUser, childProfiles, activeProfileId } = useStore()
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const piggySrc = `${import.meta.env.BASE_URL}piggy.png`
  const levelName = LEVEL_NAMES[appState.level - 1] ?? '传奇英雄'
  const nextLevelPts = getNextLevelPoints(appState.level)
  const prevLevelPts = getNextLevelPoints(appState.level - 1)
  const progress = Math.min(100, ((appState.totalPoints - prevLevelPts) / Math.max(1, nextLevelPts - prevLevelPts)) * 100)
  const activeProfile = childProfiles.find(profile => profile.id === activeProfileId)

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = event => setCustomAvatar(event.target?.result as string)
    reader.readAsDataURL(file)
  }

  const avatarSrc = appState.customAvatar ?? piggySrc

  return (
    <div className="relative z-10 px-4 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex-shrink-0 cursor-pointer"
          onClick={() => avatarInputRef.current?.click()}
          title="点击更换头像">
          <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          <div className="absolute -inset-2 rounded-full opacity-60" style={{ background: 'radial-gradient(circle, #00ffff33, transparent 70%)' }} />
          <div className="relative w-16 h-16 rounded-full overflow-hidden"
            style={{ border: '2px solid #00ffff', boxShadow: '0 0 15px #00ffff88, 0 0 30px #00ffff33' }}>
            <img src={avatarSrc} alt="头像" className="w-full h-full object-cover object-top scale-110" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 font-black px-1.5 py-0.5 rounded-full cyber-title"
            style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', fontSize: '10px' }}>
            Lv{appState.level}
          </motion.div>
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="cyber-title font-black text-base neon-text-cyan whitespace-nowrap">
            {activeProfile ? `${activeProfile.avatarEmoji} ${activeProfile.name}` : '游客体验模式'}
          </div>
          <div className="text-xs font-bold mt-0.5" style={{ color: '#ff2d78' }}>
            ◆ {currentUser ? `${currentUser.name} · ${levelName}` : '登录后开启家庭成长中心'} ◆
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.div whileTap={{ scale: 0.92 }}
            className="flex flex-col items-center px-3 py-2 rounded-xl cyber-corner"
            style={{
              background: 'linear-gradient(135deg, rgba(255,107,0,0.15), rgba(255,0,0,0.08))',
              border: '1px solid rgba(255,107,0,0.5)',
              boxShadow: '0 0 10px rgba(255,107,0,0.2)',
              minWidth: 52,
            }}>
            <motion.span animate={{ scale: appState.streak >= 3 ? [1, 1.2, 1] : 1 }} transition={{ duration: 1, repeat: Infinity }} className="text-xl">
              {appState.streak >= 7 ? '🔥' : appState.streak >= 3 ? '⚡' : '✨'}
            </motion.span>
            <span className="font-black text-sm" style={{ color: '#ff6b00' }}>{appState.streak}</span>
            <span className="text-gray-500 text-xs whitespace-nowrap">连续天</span>
          </motion.div>

          <motion.div whileTap={{ scale: 0.92 }}
            className="flex flex-col items-center px-3 py-2 rounded-xl cyber-corner"
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,165,0,0.06))',
              border: '1px solid rgba(255,215,0,0.5)',
              boxShadow: '0 0 10px rgba(255,215,0,0.2)',
              minWidth: 52,
            }}>
            <span className="text-xl">⚡</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={appState.totalPoints}
                initial={{ y: -10, opacity: 0, scale: 1.3 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                className="font-black text-sm neon-text-gold cyber-title">
                {appState.totalPoints}
              </motion.span>
            </AnimatePresence>
            <span className="text-gray-500 text-xs whitespace-nowrap">能量值</span>
          </motion.div>
        </div>
      </div>

      <div className="cyber-card p-3 cyber-corner">
        <div className="flex justify-between items-center mb-2">
          <span className="cyber-title text-xs text-cyan-400 opacity-80">ENERGY LEVEL</span>
          <span className="cyber-title text-xs" style={{ color: '#FFD700' }}>
            {appState.totalPoints} <span className="text-gray-600">/ {nextLevelPts}</span>
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden relative"
          style={{ background: 'rgba(0,255,255,0.08)', border: '1px solid rgba(0,255,255,0.15)' }}>
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ background: 'linear-gradient(90deg, #00ffff, #ff2d78)', boxShadow: '0 0 10px #00ffff, 0 0 20px #00ffff66' }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-gray-600">{levelName}</span>
          <span className="text-xs text-gray-600">{activeProfile ? activeProfile.target || '本周保持进步' : '登录同步成长档案'}</span>
        </div>
      </div>
    </div>
  )
}
