import { motion } from 'framer-motion'
import { Palette } from 'lucide-react'
import { useStore, DEFAULT_UI_SETTINGS } from '../store/useStore'
import { THEMES } from '../data'

function UiSlider({
  label, icon, value, min, max, step = 1, unit = '',
  onChange, isLight,
}: {
  label: string; icon: string; value: number; min: number; max: number;
  step?: number; unit?: string; onChange: (v: number) => void; isLight: boolean;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-bold" style={{ color: isLight ? '#555' : '#aaa' }}>
          {icon} {label}
        </span>
        <span className="text-sm font-black" style={{ color: isLight ? '#6366f1' : '#00ffff' }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="ui-slider"
        style={{ '--slider-color': isLight ? '#6366f1' : '#00ffff' } as React.CSSProperties}
      />
    </div>
  )
}

export function ThemeShop() {
  const { appState, setTheme, unlockTheme, setColorMode, updateUiSettings } = useStore()
  const isLight = appState.colorMode === 'light'
  const ui = { ...DEFAULT_UI_SETTINGS, ...appState.uiSettings }

  const cardStyle = {
    background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
    border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.1)',
  }

  return (
    <div className="relative z-10 px-4 space-y-3">
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: isLight ? 'linear-gradient(135deg, #e0e7ff, #c7d2fe)' : 'linear-gradient(135deg, #00ffff22, #ff2d7811)', border: isLight ? '1px solid #a5b4fc' : '1px solid rgba(0,255,255,0.3)' }}>
            <Palette size={28} color={isLight ? '#6366f1' : '#00ffff'} />
          </div>
        </div>
        <div className="font-black text-lg" style={{ color: isLight ? '#333' : '#fff' }}>选择你的宇宙主题</div>
        <div className="text-sm" style={{ color: isLight ? '#888' : '#666' }}>用积分解锁更多主题！</div>
      </div>

      {/* 深色/浅色切换 */}
      <div className="rounded-2xl p-4 flex items-center justify-between" style={cardStyle}>
        <div>
          <div className="font-black text-sm" style={{ color: isLight ? '#333' : '#fff' }}>🌓 背景模式</div>
          <div className="text-xs mt-0.5" style={{ color: isLight ? '#888' : '#666' }}>
            {isLight ? '☀️ 浅色模式 — 清爽明亮' : '🌙 深色模式 — 赛博朋克'}
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setColorMode(isLight ? 'dark' : 'light')}
          className="relative w-16 h-8 rounded-full flex-shrink-0"
          style={{
            background: isLight
              ? 'linear-gradient(135deg, #f0f4ff, #c7d2fe)'
              : 'linear-gradient(135deg, #020010, #080028)',
            border: isLight ? '2px solid #6366f1' : '2px solid #00ffff44',
            boxShadow: isLight ? '0 0 12px rgba(99,102,241,0.4)' : '0 0 12px rgba(0,255,255,0.3)',
          }}>
          <motion.div
            animate={{ x: isLight ? 32 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-sm"
            style={{
              background: isLight ? 'linear-gradient(135deg, #FFD700, #FFA500)' : 'linear-gradient(135deg, #00ffff, #0066ff)',
              boxShadow: isLight ? '0 0 8px #FFD700' : '0 0 8px #00ffff',
            }}>
            {isLight ? '☀️' : '🌙'}
          </motion.div>
        </motion.button>
      </div>

      {/* ⚙️ 界面调节 */}
      <div className="rounded-2xl p-4" style={cardStyle}>
        <div className="font-black text-sm mb-3" style={{ color: isLight ? '#333' : '#fff' }}>⚙️ 界面调节</div>

        <UiSlider
          label="左侧栏宽度" icon="↔️"
          value={ui.sidebarWidth} min={200} max={400} unit="px"
          onChange={v => updateUiSettings({ sidebarWidth: v })}
          isLight={isLight}
        />
        <UiSlider
          label="整体亮度" icon="☀️"
          value={ui.brightness} min={50} max={150} unit="%"
          onChange={v => updateUiSettings({ brightness: v })}
          isLight={isLight}
        />
        <UiSlider
          label="文字对比度" icon="🔆"
          value={ui.textBrightness} min={50} max={150} unit="%"
          onChange={v => updateUiSettings({ textBrightness: v })}
          isLight={isLight}
        />
        <UiSlider
          label="星空亮度" icon="✨"
          value={ui.starBrightness} min={0} max={100} unit="%"
          onChange={v => updateUiSettings({ starBrightness: v })}
          isLight={isLight}
        />
        <UiSlider
          label="玻璃背景不透明度" icon="🪟"
          value={ui.bgOpacity} min={0} max={100} unit="%"
          onChange={v => updateUiSettings({ bgOpacity: v })}
          isLight={isLight}
        />
        <UiSlider
          label="字体大小" icon="🔤"
          value={ui.fontSize} min={12} max={20} unit="px"
          onChange={v => updateUiSettings({ fontSize: v })}
          isLight={isLight}
        />
        <UiSlider
          label="内容最大宽度" icon="📐"
          value={ui.contentMaxWidth} min={480} max={960} step={16} unit="px"
          onChange={v => updateUiSettings({ contentMaxWidth: v })}
          isLight={isLight}
        />
        <UiSlider
          label="卡片圆角" icon="⬛"
          value={ui.cardRadius} min={4} max={24} unit="px"
          onChange={v => updateUiSettings({ cardRadius: v })}
          isLight={isLight}
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => updateUiSettings({ ...DEFAULT_UI_SETTINGS })}
          className="w-full mt-1 py-2 rounded-xl text-xs font-black"
          style={{
            background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
            border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
            color: isLight ? '#888' : '#555',
          }}>
          恢复默认设置
        </motion.button>
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
                : isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)',
              border: `2px solid ${isActive ? theme.primary : isUnlocked ? (isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)') : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)')}`,
              boxShadow: isActive ? `0 0 20px ${theme.primary}33` : 'none',
            }}>
            {/* 主题预览 */}
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: theme.bg.includes('linear') ? theme.bg : `linear-gradient(135deg, ${theme.bg}, ${theme.cardBg})`, border: `1px solid ${theme.primary}44` }}>
              {theme.emoji}
            </div>

            <div className="flex-1">
              <div className="font-black" style={{ color: isLight ? '#333' : '#fff' }}>{theme.name}</div>
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
