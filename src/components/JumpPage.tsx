import { BarChart3, Gift, Home, ListTodo, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { THEMES } from '../data'
import { useStore } from '../store/useStore'
import { Header } from './Header'
import { MotivationPopup } from './MotivationPopup'
import { RewardShop } from './RewardShop'
import { StatsPage } from './StatsPage'
import { TaskList } from './TaskList'

type JumpPageProps = {
  onBackHome: () => void
}

type TabKey = 'tasks' | 'rewards' | 'stats'

function LogoMark() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#7dd3fc,#c4b5fd_45%,#ffd166)] text-[#071326] shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
      <Sparkles size={22} />
    </div>
  )
}

export function JumpPage({ onBackHome }: JumpPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('tasks')
  const { appState, todayPlan, todayRecord, rewards } = useStore()
  const theme = THEMES.find(item => item.id === appState.currentTheme) ?? THEMES[0]
  const todayTotal = todayPlan?.taskIds.length ?? 0
  const todayDone = todayRecord?.completedTasks.length ?? 0
  const redeemableRewards = rewards.filter(reward => reward.cost <= appState.totalPoints).length

  const tabs = useMemo(
    () => [
      { id: 'tasks' as const, label: '任务', icon: ListTodo, helper: '安排今天、完成打卡' },
      { id: 'rewards' as const, label: '奖励', icon: Gift, helper: '用星星兑换小奖励' },
      { id: 'stats' as const, label: '统计', icon: BarChart3, helper: '查看最近积分节奏' },
    ],
    [],
  )

  return (
    <div className="min-h-screen overflow-hidden px-4 py-4 md:px-6 md:py-6">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 20% 18%, ${theme.primary}33, transparent 20%), radial-gradient(circle at 78% 16%, ${theme.accent}22, transparent 18%), radial-gradient(circle at 70% 82%, ${theme.secondary}22, transparent 18%), linear-gradient(180deg, rgba(8,21,41,0.98), rgba(8,21,41,0.98))`,
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px] opacity-45" />

      <div className="relative mx-auto max-w-[1440px]">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <LogoMark />
            <div className="hidden sm:block">
              <div className="text-[11px] font-black tracking-[0.38em] text-white/52 uppercase">Cloud Edu Family</div>
              <div className="mt-1 text-base font-black tracking-[-0.03em] text-[#fffaf1] md:text-xl">
                积分主页面
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-black text-white/74 md:flex">
              今日完成 {todayDone} / {todayTotal || 0}
            </div>
            <button
              onClick={onBackHome}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-black text-white/85 shadow-sm backdrop-blur transition-transform hover:scale-[1.02]"
            >
              <Home size={15} />
              返回首页
            </button>
          </div>
        </header>

        <main className="mt-8 space-y-6">
          <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[34px] border border-white/12 bg-[linear-gradient(180deg,rgba(16,31,68,0.86),rgba(10,20,45,0.9))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
              <div className="text-[11px] font-black tracking-[0.36em] text-white/48 uppercase">POINTS HUB</div>
              <h1 className="mt-3 max-w-[10ch] text-[clamp(3rem,7vw,5.8rem)] font-black leading-[0.92] tracking-[-0.08em] text-[#fffaf1]">
                只保留积分这条主线。
              </h1>
              <p className="mt-4 max-w-[36rem] text-base leading-8 text-white/70 md:text-lg md:leading-9">
                主页面现在只做三件事：安排任务、兑换奖励、看积分统计。档案、语音和其他扩展入口都从主流程里拿掉。
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: '当前积分', value: `${appState.totalPoints} ⚡`, color: theme.accent },
                  { label: '连续天数', value: `${appState.streak} 天`, color: theme.primary },
                  { label: '可兑换奖励', value: `${redeemableRewards} 个`, color: theme.secondary },
                ].map(item => (
                  <div key={item.label} className="rounded-[22px] border border-white/12 bg-white/8 px-4 py-4">
                    <div className="text-xs font-black tracking-[0.2em] text-white/46 uppercase">{item.label}</div>
                    <div className="mt-2 text-2xl font-black" style={{ color: item.color }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl">
              <Header />
            </div>
          </section>

          <section className="rounded-[34px] border border-white/12 bg-[linear-gradient(180deg,rgba(16,31,68,0.75),rgba(10,20,45,0.88))] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.24)]">
            <div className="mb-4 flex flex-wrap gap-3">
              {tabs.map(tab => {
                const Icon = tab.icon
                const active = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className="inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-transform hover:scale-[1.01]"
                    style={{
                      background: active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)',
                      borderColor: active ? `${theme.accent}66` : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-2xl"
                      style={{ background: active ? `${theme.accent}22` : 'rgba(255,255,255,0.08)', color: active ? theme.accent : '#ffffff' }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white/92">{tab.label}</div>
                      <div className="text-xs text-white/52">{tab.helper}</div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div>
              {activeTab === 'tasks' && <TaskList />}
              {activeTab === 'rewards' && <RewardShop />}
              {activeTab === 'stats' && <StatsPage />}
            </div>
          </section>
        </main>
      </div>

      <MotivationPopup />
    </div>
  )
}
