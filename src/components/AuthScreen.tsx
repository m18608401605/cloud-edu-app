import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

export function AuthScreen({ onContinueGuest }: { onContinueGuest: () => void }) {
  const { login, register } = useStore()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setBusy(true)
    const result = mode === 'login'
      ? await login({ email, password })
      : await register({ email, password, name })
    setMessage(result.message)
    setBusy(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #020010, #0d0030, #020010)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at top, rgba(0,255,255,0.12), transparent 45%)' }} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-3xl p-6"
        style={{ background: 'rgba(4, 0, 25, 0.88)', border: '1px solid rgba(0,255,255,0.2)', boxShadow: '0 0 40px rgba(0,255,255,0.08)' }}>
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">🐷⚡</div>
          <div className="cyber-title text-xl text-cyan-300">Cloud Edu Family</div>
          <div className="text-sm text-gray-400 mt-2">登录后解锁孩子档案、综合分析、语音分析等扩展能力</div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {(['login', 'register'] as const).map(item => (
            <button
              key={item}
              onClick={() => setMode(item)}
              className="py-2 rounded-xl font-black text-sm"
              style={{
                background: mode === item ? 'linear-gradient(135deg, #00ffff, #4f46e5)' : 'rgba(255,255,255,0.05)',
                color: mode === item ? '#020617' : '#9ca3af',
              }}>
              {item === 'login' ? '登录' : '注册'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {mode === 'register' && (
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="家长昵称"
              className="w-full rounded-xl px-4 py-3 bg-white/10 text-white border border-white/10 placeholder-gray-500"
            />
          )}
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="邮箱"
            className="w-full rounded-xl px-4 py-3 bg-white/10 text-white border border-white/10 placeholder-gray-500"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="密码"
            className="w-full rounded-xl px-4 py-3 bg-white/10 text-white border border-white/10 placeholder-gray-500"
          />
          <button
            onClick={submit}
            disabled={busy}
            className="w-full py-3 rounded-xl font-black text-slate-900"
            style={{ background: 'linear-gradient(135deg, #facc15, #fb7185)' }}>
            {busy ? '处理中...' : mode === 'login' ? '进入成长空间' : '创建家庭账号'}
          </button>
          <button
            onClick={onContinueGuest}
            className="w-full py-3 rounded-xl font-black text-gray-400 border border-white/10 bg-white/5">
            先以游客模式体验积分系统
          </button>
          {message && <div className="text-sm text-cyan-300 text-center">{message}</div>}
        </div>
      </motion.div>
    </div>
  )
}
