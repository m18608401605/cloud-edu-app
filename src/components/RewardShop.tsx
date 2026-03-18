import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import type { Reward } from '../types'
import { THEMES } from '../data'
import { PIGGY_STICKERS } from '../data/piggyStickers'

export function RewardShop() {
  const { rewards, appState, redeemReward, addReward, removeReward } = useStore()
  const theme = THEMES.find(t => t.id === appState.currentTheme)!
  const [showAdd, setShowAdd] = useState(false)
  const [newReward, setNewReward] = useState({ title: '', icon: '🎁', cost: 50, description: '' })
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<string | null>(null)
  const [failId, setFailId] = useState<string | null>(null)

  const handleRedeem = async (reward: Reward) => {
    if (redeeming) return
    setRedeeming(reward.id)
    const ok = await redeemReward(reward)
    if (ok) {
      setSuccessId(reward.id)
      setTimeout(() => setSuccessId(null), 2000)
    } else {
      setFailId(reward.id)
      setTimeout(() => setFailId(null), 1000)
    }
    setRedeeming(null)
  }

  const handleAdd = async () => {
    if (!newReward.title.trim()) return
    const reward: Reward = { ...newReward, id: `reward-custom-${Date.now()}`, isCustom: true }
    await addReward(reward)
    setNewReward({ title: '', icon: '🎁', cost: 50, description: '' })
    setShowAdd(false)
  }

  return (
    <div className="relative z-10 px-4">
      {/* 当前积分展示 */}
      <motion.div
        className="mb-6 p-4 rounded-2xl text-center"
        style={{ background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.05))', border: '1px solid rgba(255,215,0,0.3)' }}
      >
        <div className="text-gray-400 text-sm font-bold mb-1">我的能量币</div>
        <motion.div
          key={appState.totalPoints}
          initial={{ scale: 1.3 }} animate={{ scale: 1 }}
          className="text-5xl font-black"
          style={{ color: '#FFD700', textShadow: '0 0 20px #FFD70066' }}
        >
          ⚡ {appState.totalPoints}
        </motion.div>
        <div className="text-gray-500 text-xs mt-1">猪猪侠能量币，快去兑换奖励吧！</div>
      </motion.div>

      {/* 奖励列表 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <AnimatePresence>
          {rewards.map((reward, i) => {
            const canAfford = appState.totalPoints >= reward.cost
            const isSuccess = successId === reward.id
            const isFail = failId === reward.id

            return (
              <motion.div key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-2xl p-4 flex flex-col items-center gap-2"
                style={{
                  background: isSuccess
                    ? 'linear-gradient(135deg, rgba(0,255,136,0.2), rgba(0,255,136,0.1))'
                    : isFail
                    ? 'linear-gradient(135deg, rgba(255,80,80,0.2), rgba(255,80,80,0.1))'
                    : canAfford
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSuccess ? '#00ff88' : isFail ? '#ff5050' : canAfford ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
                  opacity: canAfford ? 1 : 0.6,
                }}
              >
                {/* 删除（自定义） */}
                {reward.isCustom && (
                  <button onClick={() => removeReward(reward.id)}
                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center justify-center">
                    ×
                  </button>
                )}

                {/* 成功/失败反馈 */}
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute inset-0 flex items-center justify-center rounded-2xl z-10"
                      style={{ background: 'rgba(0,255,136,0.15)' }}>
                      <div className="text-4xl">{PIGGY_STICKERS.gift}</div>
                    </motion.div>
                  )}
                  {isFail && (
                    <motion.div
                      animate={{ x: [-4, 4, -4, 4, 0] }}
                      className="absolute inset-0 flex items-center justify-center rounded-2xl z-10"
                      style={{ background: 'rgba(255,80,80,0.1)' }}>
                      <div className="text-sm font-black text-red-400">能量不足！</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="text-4xl">{reward.icon}</div>
                <div className="text-white font-black text-sm text-center leading-tight">{reward.title}</div>
                {reward.description && (
                  <div className="text-gray-500 text-xs text-center">{reward.description}</div>
                )}

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford || !!redeeming}
                  className="w-full py-2 rounded-xl font-black text-sm flex items-center justify-center gap-1"
                  style={{
                    background: canAfford
                      ? `linear-gradient(135deg, ${theme.accent}, #FFA500)`
                      : 'rgba(255,255,255,0.08)',
                    color: canAfford ? '#000' : '#555',
                  }}
                >
                  <span>⚡</span>
                  <span>{reward.cost}</span>
                  <span>{canAfford ? '兑换' : '不足'}</span>
                </motion.button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* 添加自定义奖励 */}
      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAdd(true)}
        className="w-full py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 mb-4"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)', color: '#666' }}>
        <span>＋</span> 添加自定义奖励
      </motion.button>

      {/* 添加奖励弹窗 */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-lg rounded-t-3xl p-6"
              style={{ background: 'linear-gradient(180deg, #1a0a3e, #0a0520)', border: '1px solid rgba(255,215,0,0.3)' }}>
              <div className="text-white font-black text-xl mb-4 text-center">🎁 添加新奖励</div>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input value={newReward.icon} onChange={e => setNewReward(s => ({ ...s, icon: e.target.value }))}
                    className="w-14 text-center text-2xl rounded-xl p-2 bg-white/10 text-white border border-white/20" maxLength={2} />
                  <input value={newReward.title} onChange={e => setNewReward(s => ({ ...s, title: e.target.value }))}
                    placeholder="奖励名称"
                    className="flex-1 rounded-xl px-4 py-2 bg-white/10 text-white border border-white/20 font-bold placeholder-gray-500" />
                </div>
                <div className="flex items-center gap-2 rounded-xl px-4 py-2 bg-white/10 border border-white/20">
                  <span className="text-yellow-400 font-bold">⚡ 所需积分：</span>
                  <input type="number" value={newReward.cost} onChange={e => setNewReward(s => ({ ...s, cost: +e.target.value }))}
                    className="flex-1 bg-transparent text-white font-black" min={1} />
                </div>
                <input value={newReward.description} onChange={e => setNewReward(s => ({ ...s, description: e.target.value }))}
                  placeholder="奖励描述（选填）"
                  className="w-full rounded-xl px-4 py-2 bg-white/10 text-white border border-white/20 placeholder-gray-500" />
                <div className="flex gap-3">
                  <button onClick={() => setShowAdd(false)}
                    className="flex-1 py-3 rounded-xl font-black text-gray-400 bg-white/5 border border-white/10">取消</button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={handleAdd}
                    className="flex-1 py-3 rounded-xl font-black text-black"
                    style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)' }}>确认 ✓</motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
