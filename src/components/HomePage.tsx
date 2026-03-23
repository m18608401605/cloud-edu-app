import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Palette,
  PencilLine,
  Plus,
  Rocket,
  RotateCcw,
  Sparkles,
  Trees,
  Upload,
  Waves,
  X,
} from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { THEMES } from '../data'
import { useStore } from '../store/useStore'
import type { Task, Theme } from '../types'

type HomePageProps = {
  onEnterPoints: () => void
}

type PlanDraft = {
  title: string
  icon: string
  points: number
  description: string
}

const EMPTY_DRAFT: PlanDraft = {
  title: '',
  icon: '⭐',
  points: 10,
  description: '',
}

const WALLPAPER_PRESETS = [
  {
    id: 'piggy',
    title: '超能星球',
    subtitle: '深紫霓虹 · 星轨流光',
    icon: Sparkles,
    hint: '最强科技感',
  },
  {
    id: 'ocean',
    title: '海盐蓝',
    subtitle: '清爽海风 · 轻亮波光',
    icon: Waves,
    hint: '更安静一点',
  },
  {
    id: 'forest',
    title: '森林绿',
    subtitle: '安静生长 · 柔和活力',
    icon: Trees,
    hint: '更自然一点',
  },
  {
    id: 'galaxy',
    title: '星河紫',
    subtitle: '旗舰感 · 星轨更强',
    icon: Rocket,
    hint: '更像官网',
  },
  {
    id: 'candy',
    title: '糖果粉',
    subtitle: '更可爱 · 更柔软',
    icon: Sparkles,
    hint: '更孩子气',
  },
] as const

function hexToRgba(hex: string, alpha: number) {
  const cleaned = hex.replace('#', '')
  const normalized =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map(char => `${char}${char}`)
          .join('')
      : cleaned
  const value = Number.parseInt(normalized, 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function LogoMark() {
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/12 bg-[linear-gradient(135deg,rgba(125,211,252,0.95),rgba(196,181,253,0.92)_45%,rgba(255,209,102,0.92))] text-[#071326] shadow-[0_18px_50px_rgba(0,0,0,0.24)]">
      <Sparkles size={22} />
    </div>
  )
}

function TopPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/70 backdrop-blur-xl">
      {children}
    </span>
  )
}

function ThemePreview({
  theme,
  active,
  onSelect,
}: {
  theme: Theme
  active: boolean
  onSelect: () => void
}) {
  const meta = WALLPAPER_PRESETS.find(item => item.id === theme.id) ?? WALLPAPER_PRESETS[0]
  const Icon = meta.icon

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group rounded-[28px] border p-3 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#ffd166]"
      style={{
        background: theme.bg,
        borderColor: active ? hexToRgba(theme.primary, 0.5) : 'rgba(255,255,255,0.12)',
        boxShadow: active
          ? `0 22px 60px ${hexToRgba(theme.primary, 0.18)}, 0 0 0 1px ${hexToRgba(theme.secondary, 0.18)}`
          : '0 10px 30px rgba(0,0,0,0.18)',
        transform: active ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      <div className="overflow-hidden rounded-[20px] border border-white/10 bg-white/8">
        <div className="relative aspect-[5/4]">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 22% 20%, ${hexToRgba(theme.primary, 0.42)}, transparent 24%), radial-gradient(circle at 78% 22%, ${hexToRgba(theme.secondary, 0.32)}, transparent 22%), radial-gradient(circle at 50% 86%, ${hexToRgba(theme.accent, 0.24)}, transparent 28%), ${theme.bg}`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
          <div
            className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/16 bg-white/10 text-white"
            style={{ boxShadow: `0 0 24px ${hexToRgba(theme.accent, 0.2)}` }}
          >
            <Icon size={18} />
          </div>
          <div className="absolute bottom-4 left-4 right-4 rounded-[18px] border border-white/12 bg-black/16 px-3 py-2 backdrop-blur-md">
            <div className="text-sm font-black text-white">{meta.title}</div>
            <div className="mt-1 text-[11px] leading-5 text-white/68">{meta.subtitle}</div>
          </div>
          {active && (
            <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/16 bg-white/14 text-white backdrop-blur-md">
              <Check size={16} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-black text-white/92">{meta.title}</div>
          <div className="mt-1 text-xs leading-5 text-white/64">{meta.hint}</div>
        </div>
        <div
          className="rounded-full border border-white/12 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-white/74"
          style={{ background: active ? hexToRgba(theme.primary, 0.14) : 'rgba(255,255,255,0.06)' }}
        >
          点一下
        </div>
      </div>
    </button>
  )
}

function PlanTile({
  task,
  index,
  done,
  inTodayPlan,
  accent,
  onEdit,
  onToggleDone,
  onTogglePlan,
}: {
  task: Task | null
  index: number
  done: boolean
  inTodayPlan: boolean
  accent: string
  onEdit: () => void
  onToggleDone: () => void
  onTogglePlan: () => void
}) {
  const slotLabel = `计划 ${String(index + 1).padStart(2, '0')}`

  if (!task) {
    return (
      <button
        type="button"
        onClick={onEdit}
        className="group relative flex h-full min-h-[168px] w-full flex-col justify-between rounded-[28px] border border-dashed border-white/16 bg-white/6 p-4 text-left backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#ffd166]"
      >
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[10px] font-black tracking-[0.24em] text-white/60 uppercase">
            {slotLabel}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white/60">
            <Plus size={16} />
          </span>
        </div>
        <div>
          <div className="text-xl font-black text-white/90">添加计划</div>
          <div className="mt-2 text-xs leading-6 text-white/58">点这里补一个今天想做的项目。</div>
        </div>
      </button>
    )
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative flex h-full min-h-[168px] w-full flex-col rounded-[28px] border border-white/12 bg-white/8 p-4 text-left backdrop-blur-xl"
      style={{ boxShadow: `0 16px 48px ${hexToRgba(accent, 0.12)}` }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[10px] font-black tracking-[0.24em] text-white/60 uppercase">
          {slotLabel}
        </span>
        <button
          type="button"
          onClick={e => {
            e.stopPropagation()
            onToggleDone()
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white/85 transition-transform hover:scale-105"
          title={done ? '取消完成' : '标记完成'}
        >
          {done ? <Check size={16} /> : <PencilLine size={16} />}
        </button>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="mt-3 flex-1 text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-black/14 text-xl"
            style={{ boxShadow: `0 0 0 1px ${hexToRgba(accent, 0.12)}` }}
          >
            {task.icon || '⭐'}
          </div>
          <div className="min-w-0">
            <div className="text-lg font-black leading-tight text-white/94">{task.title}</div>
            <div className="mt-1 text-[11px] font-black tracking-[0.2em] text-white/52 uppercase">
              点卡片可编辑
            </div>
          </div>
        </div>

        <div className="mt-3 text-xs leading-6 text-white/68">{task.description || '这里可以补上今天要做的事情。'}</div>
      </button>

      <div className="mt-4 flex items-center justify-between gap-2">
        <div
          className="rounded-full px-3 py-1.5 text-[11px] font-black"
          style={{
            background: done ? hexToRgba('#22c55e', 0.16) : hexToRgba(accent, 0.14),
            color: done ? '#86efac' : accent,
          }}
        >
          {done ? '已完成' : `+${task.points} 星星`}
        </div>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation()
            onTogglePlan()
          }}
          className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] font-black text-white/72 transition-transform hover:scale-[1.02]"
        >
          {inTodayPlan ? '移出今天' : '加入今天'}
        </button>
      </div>
    </motion.div>
  )
}

function AvatarTile({
  avatarSrc,
  profileName,
  onUploadAvatar,
}: {
  avatarSrc: string
  profileName: string
  onUploadAvatar: () => void
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onUploadAvatar}
      className="relative flex h-full min-h-[220px] w-full flex-col items-center justify-center overflow-hidden rounded-[34px] border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-5 text-white shadow-[0_26px_80px_rgba(0,0,0,0.34)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.16),transparent_30%),radial-gradient(circle_at_50%_86%,rgba(125,211,252,0.14),transparent_26%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:52px_52px] opacity-16" />
      <motion.div
        animate={{ y: [0, -8, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-[1] flex h-44 w-44 items-center justify-center rounded-full border border-white/16 bg-[radial-gradient(circle,rgba(255,255,255,0.2),rgba(255,255,255,0.08),transparent_70%)] shadow-[0_0_90px_rgba(125,211,252,0.26)]"
      >
        <div className="absolute inset-0 rounded-full border border-white/16" />
        <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),rgba(255,255,255,0.02))]" />
        <img
          src={avatarSrc}
          alt={profileName}
          className="relative z-[1] h-[90%] w-[90%] select-none object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.22)]"
        />
      </motion.div>

      <div className="relative z-[1] mt-4 text-center">
        <div className="text-[11px] font-black tracking-[0.28em] text-white/64 uppercase">点击更换头像</div>
        <div className="mt-2 text-lg font-black text-white">{profileName}</div>
        <div className="mt-1 text-xs leading-6 text-white/66">头像区就是孩子自己的入口。</div>
      </div>

      <div className="relative z-[1] mt-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs font-black text-white/88 backdrop-blur-md">
        <Upload size={14} />
        上传 / 替换头像
      </div>
    </motion.button>
  )
}

export function HomePage({ onEnterPoints }: HomePageProps) {
  const {
    appState,
    childProfiles,
    activeProfileId,
    tasks,
    todayPlan,
    todayRecord,
    setTheme,
    setCustomAvatar,
    setCustomBg,
    setChildProfileAvatar,
    setChildProfileBg,
    updateTask,
    addTask,
    addToTodayPlan,
    removeFromTodayPlan,
    completeTask,
    uncompleteTask,
  } = useStore()

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bgInputRef = useRef<HTMLInputElement>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [draft, setDraft] = useState<PlanDraft>(EMPTY_DRAFT)

  const activeTheme = useMemo(
    () => THEMES.find(theme => theme.id === appState.currentTheme) ?? THEMES[0],
    [appState.currentTheme],
  )

  const activeProfile = childProfiles.find(profile => profile.id === activeProfileId)
  const piggySrc = `${import.meta.env.BASE_URL}piggy.png`
  const avatarSrc = activeProfile?.customAvatar ?? appState.customAvatar ?? piggySrc
  const customBgSrc = activeProfile?.customBg ?? appState.customBg

  const heroBackgroundStyle = customBgSrc
    ? {
        backgroundImage: `url(${customBgSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: activeTheme.bg,
      }

  const sortedTasks = useMemo(() => {
    const order = appState.taskOrder ?? tasks.map(task => task.id)
    const orderMap = new Map(order.map((id, index) => [id, index]))
    return [...tasks].sort((a, b) => (orderMap.get(a.id) ?? 9999) - (orderMap.get(b.id) ?? 9999))
  }, [appState.taskOrder, tasks])

  const completed = new Set(todayRecord?.completedTasks ?? [])
  const todayTaskIds = new Set(todayPlan?.taskIds ?? [])
  const fallbackTasks = sortedTasks.filter(task => !todayTaskIds.has(task.id))
  const planCandidates = [
    ...(todayPlan?.taskIds ?? [])
      .map(id => sortedTasks.find(task => task.id === id))
      .filter(Boolean) as Task[],
    ...fallbackTasks,
  ]
  const boardSlots = Array.from({ length: 4 }, (_, index) => planCandidates[index] ?? null)

  const applyAvatar = async (base64: string | undefined) => {
    if (activeProfile) await setChildProfileAvatar(activeProfile.id, base64)
    else await setCustomAvatar(base64)
  }

  const applyBg = async (base64: string | undefined) => {
    if (activeProfile) await setChildProfileBg(activeProfile.id, base64)
    else await setCustomBg(base64)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = event => applyAvatar(event.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = event => applyBg(event.target?.result as string)
    reader.readAsDataURL(file)
  }

  const openEditor = (task: Task | null) => {
    setEditingTask(task)
    setDraft(
      task
        ? {
            title: task.title,
            icon: task.icon,
            points: Math.abs(task.points || 10),
            description: task.description ?? '',
          }
        : EMPTY_DRAFT,
    )
    setEditorOpen(true)
  }

  const saveEditor = async () => {
    if (!draft.title.trim()) return
    if (editingTask) {
      await updateTask({
        ...editingTask,
        title: draft.title.trim(),
        icon: draft.icon.trim() || editingTask.icon,
        points: Math.max(1, Math.abs(Number(draft.points) || 10)),
        description: draft.description.trim(),
      })
    } else {
      await addTask({
        id: `custom-${Date.now()}`,
        title: draft.title.trim(),
        icon: draft.icon.trim() || '⭐',
        points: Math.max(1, Math.abs(Number(draft.points) || 10)),
        category: 'custom',
        description: draft.description.trim(),
        isCustom: true,
      })
    }
    setEditorOpen(false)
    setEditingTask(null)
    setDraft(EMPTY_DRAFT)
  }

  const togglePlanMembership = async (task: Task) => {
    if (todayTaskIds.has(task.id)) await removeFromTodayPlan(task.id)
    else await addToTodayPlan(task.id)
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden text-[#fffaf1] transition-[background] duration-700"
      style={heroBackgroundStyle}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 18% 16%, ${hexToRgba(activeTheme.primary, 0.24)}, transparent 20%),
            radial-gradient(circle at 78% 14%, ${hexToRgba(activeTheme.secondary, 0.2)}, transparent 18%),
            radial-gradient(circle at 78% 76%, ${hexToRgba(activeTheme.accent, 0.14)}, transparent 20%),
            linear-gradient(180deg, rgba(7, 14, 28, 0.14), rgba(7, 14, 28, 0.26))
          `,
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col px-4 py-4 md:px-6 md:py-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <LogoMark />
            <div className="min-w-0">
              <div className="text-[11px] font-black tracking-[0.34em] text-white/48 uppercase">PIGGYVERSE POINTS</div>
              <div className="mt-1 text-lg font-black tracking-[-0.05em] text-[#fffaf1] md:text-xl">
                积分宇宙入口
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <TopPill>壁纸可切换</TopPill>
            <TopPill>{activeTheme.name}</TopPill>
          </div>
        </header>

        <main className="mt-8 grid flex-1 items-center gap-8 xl:grid-cols-[0.98fr_1.02fr] xl:gap-12">
          <section className="order-2 max-w-[42rem] xl:order-1">
            <div className="mt-5 max-w-[10ch] text-[clamp(3.6rem,8.4vw,7.1rem)] font-black leading-[0.9] tracking-[-0.11em] text-[#fffaf1] drop-shadow-[0_0_28px_rgba(255,255,255,0.05)]">
              今天来攒星星吧。
            </div>

            <p className="mt-5 max-w-[32rem] text-[clamp(1.02rem,1.8vw,1.18rem)] leading-9 text-white/72 md:leading-10">
              保留这套星球感页面风格，把体验收回到任务、积分、奖励这条主线上。
            </p>

            <div className="mt-4 inline-flex items-center rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-black text-white/74 backdrop-blur-xl">
              纯积分模式 · 直接进入主页面
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onEnterPoints}
                className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff9f1c,#ffd166)] px-6 py-4 text-base font-black text-[#071326] shadow-[0_22px_46px_rgba(255,159,28,0.28)] transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#ffd166]"
              >
                进入积分系统
                <ArrowRight size={18} />
              </button>
              <button
                type="button"
                onClick={onEnterPoints}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/16 bg-white/8 px-6 py-4 text-base font-black text-white/88 shadow-[0_14px_34px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#7dd3fc]"
              >
                查看今日看板
              </button>
            </div>
          </section>

          <section className="order-1 xl:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="relative aspect-square w-full overflow-hidden rounded-[44px] border border-white/12 p-4 shadow-[0_34px_110px_rgba(0,0,0,0.38)]"
              style={{
                background: `radial-gradient(circle at 50% 18%, ${hexToRgba(activeTheme.primary, 0.26)}, transparent 18%), radial-gradient(circle at 18% 18%, ${hexToRgba(activeTheme.secondary, 0.18)}, transparent 16%), radial-gradient(circle at 82% 14%, ${hexToRgba(activeTheme.accent, 0.2)}, transparent 18%), ${activeTheme.cardBg}`,
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:58px_58px] opacity-16" />
              <motion.div
                aria-hidden="true"
                animate={{ x: ['-8%', '10%', '-8%'] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-y-0 left-0 w-[42%] bg-[radial-gradient(circle_at_50%_50%,rgba(48,211,200,0.18),transparent_62%)] blur-3xl"
              />
              <motion.div
                aria-hidden="true"
                animate={{ x: ['16%', '-6%', '16%'] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-y-0 right-0 w-[36%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,123,200,0.14),transparent_58%)] blur-3xl"
              />

              <div className="relative z-[1] flex h-full flex-col rounded-[36px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-4 md:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] font-black tracking-[0.26em] text-white/72 uppercase backdrop-blur-md">
                    <Palette size={12} className="text-[#7dd3fc]" />
                    今日计划看板
                  </div>
                  <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-xs font-black text-white/74 backdrop-blur-md">
                    点头像换图，点卡片改计划
                  </div>
                </div>

                <div className="mt-4 grid flex-1 grid-cols-3 grid-rows-3 gap-4">
                  <div className="col-start-2 row-start-1">
                    <PlanTile
                      task={boardSlots[0]}
                      index={0}
                      done={Boolean(boardSlots[0] && completed.has(boardSlots[0].id))}
                      inTodayPlan={Boolean(boardSlots[0] && todayTaskIds.has(boardSlots[0].id))}
                      accent={activeTheme.primary}
                      onEdit={() => openEditor(boardSlots[0])}
                      onToggleDone={() => {
                        const task = boardSlots[0]
                        if (!task) return
                        if (completed.has(task.id)) void uncompleteTask(task.id)
                        else void completeTask(task.id)
                      }}
                      onTogglePlan={() => {
                        const task = boardSlots[0]
                        if (!task) return
                        void togglePlanMembership(task)
                      }}
                    />
                  </div>

                  <div className="col-start-1 row-start-2">
                    <PlanTile
                      task={boardSlots[1]}
                      index={1}
                      done={Boolean(boardSlots[1] && completed.has(boardSlots[1].id))}
                      inTodayPlan={Boolean(boardSlots[1] && todayTaskIds.has(boardSlots[1].id))}
                      accent={activeTheme.secondary}
                      onEdit={() => openEditor(boardSlots[1])}
                      onToggleDone={() => {
                        const task = boardSlots[1]
                        if (!task) return
                        if (completed.has(task.id)) void uncompleteTask(task.id)
                        else void completeTask(task.id)
                      }}
                      onTogglePlan={() => {
                        const task = boardSlots[1]
                        if (!task) return
                        void togglePlanMembership(task)
                      }}
                    />
                  </div>

                  <div className="col-start-2 row-start-2">
                    <AvatarTile
                      avatarSrc={avatarSrc}
                      profileName={activeProfile?.name ?? '积分伙伴'}
                      onUploadAvatar={() => avatarInputRef.current?.click()}
                    />
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="col-start-3 row-start-2">
                    <PlanTile
                      task={boardSlots[2]}
                      index={2}
                      done={Boolean(boardSlots[2] && completed.has(boardSlots[2].id))}
                      inTodayPlan={Boolean(boardSlots[2] && todayTaskIds.has(boardSlots[2].id))}
                      accent={activeTheme.accent}
                      onEdit={() => openEditor(boardSlots[2])}
                      onToggleDone={() => {
                        const task = boardSlots[2]
                        if (!task) return
                        if (completed.has(task.id)) void uncompleteTask(task.id)
                        else void completeTask(task.id)
                      }}
                      onTogglePlan={() => {
                        const task = boardSlots[2]
                        if (!task) return
                        void togglePlanMembership(task)
                      }}
                    />
                  </div>

                  <div className="col-start-2 row-start-3">
                    <PlanTile
                      task={boardSlots[3]}
                      index={3}
                      done={Boolean(boardSlots[3] && completed.has(boardSlots[3].id))}
                      inTodayPlan={Boolean(boardSlots[3] && todayTaskIds.has(boardSlots[3].id))}
                      accent={activeTheme.primary}
                      onEdit={() => openEditor(boardSlots[3])}
                      onToggleDone={() => {
                        const task = boardSlots[3]
                        if (!task) return
                        if (completed.has(task.id)) void uncompleteTask(task.id)
                        else void completeTask(task.id)
                      }}
                      onTogglePlan={() => {
                        const task = boardSlots[3]
                        if (!task) return
                        void togglePlanMembership(task)
                      }}
                    />
                  </div>

                  <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[11px] font-black tracking-[0.24em] text-white/74 uppercase backdrop-blur-md">
                    积分宇宙
                  </div>
                  <div className="pointer-events-none absolute right-5 top-5 rounded-full border border-white/12 bg-[#ff9f1c] px-3 py-1.5 text-[11px] font-black tracking-[0.16em] text-[#071326] shadow-[0_14px_30px_rgba(255,159,28,0.22)]">
                    星星到手
                  </div>
                  <div className="pointer-events-none absolute left-5 bottom-5 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[11px] font-black tracking-[0.16em] text-white/74 backdrop-blur-md">
                    背景可替换
                  </div>
                  <div className="pointer-events-none absolute right-5 bottom-5 rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[11px] font-black tracking-[0.16em] text-white/74 backdrop-blur-md">
                    计划可编辑
                  </div>
                </div>

              </div>
            </motion.div>
          </section>
        </main>

        <section className="mt-8 pb-2 md:mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-black tracking-[0.34em] text-white/48 uppercase">
                WALLPAPER SWITCHER
              </div>
              <div className="mt-2 text-xl font-black tracking-[-0.04em] text-[#fffaf1]">
                选一个星球，整页会跟着换气质
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-black text-white/70 backdrop-blur-md">
                当前壁纸：{customBgSrc ? '自定义背景' : activeTheme.name}
              </div>
              <button
                type="button"
                onClick={() => bgInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs font-black text-white/84 backdrop-blur-md transition-transform hover:scale-[1.02]"
              >
                <Upload size={14} />
                上传背景
              </button>
              <button
                type="button"
                onClick={() => void applyBg(undefined)}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-black text-white/72 backdrop-blur-md transition-transform hover:scale-[1.02]"
              >
                <RotateCcw size={14} />
                清除背景
              </button>
              <input
                ref={bgInputRef}
                type="file"
                accept="image/*"
                onChange={handleBgUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {THEMES.map(theme => (
              <ThemePreview
                key={theme.id}
                theme={theme}
                active={theme.id === activeTheme.id}
                onSelect={() => setTheme(theme.id)}
              />
            ))}
          </div>
        </section>
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#030714]/70 px-4 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/12 bg-[linear-gradient(180deg,rgba(18,24,53,0.96),rgba(7,12,27,0.96))] p-5 text-white shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
          >
            <button
              type="button"
              onClick={() => {
                setEditorOpen(false)
                setEditingTask(null)
                setDraft(EMPTY_DRAFT)
              }}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white/76 transition-transform hover:scale-105"
              aria-label="关闭"
            >
              <X size={18} />
            </button>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-3 py-1.5 text-[11px] font-black tracking-[0.26em] text-white/72 uppercase backdrop-blur-md">
              <PencilLine size={12} className="text-[#7dd3fc]" />
              今日计划编辑
            </div>
            <div className="mt-3 text-2xl font-black tracking-[-0.05em]">
              {editingTask ? '修改这个计划项' : '新增一个今天要做的事情'}
            </div>
            <div className="mt-2 text-sm leading-7 text-white/66">
              这里直接调整首页看板里的任务内容和星星数量。
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr]">
              <label className="space-y-2">
                <div className="text-xs font-black tracking-[0.24em] text-white/54 uppercase">标题</div>
                <input
                  value={draft.title}
                  onChange={e => setDraft(state => ({ ...state, title: e.target.value }))}
                  className="w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-base text-white outline-none transition focus:border-[#7dd3fc]"
                  placeholder="例如：完成语文作业"
                />
              </label>
              <label className="space-y-2">
                <div className="text-xs font-black tracking-[0.24em] text-white/54 uppercase">图标</div>
                <input
                  value={draft.icon}
                  onChange={e => setDraft(state => ({ ...state, icon: e.target.value }))}
                  className="w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-base text-white outline-none transition focus:border-[#7dd3fc]"
                  placeholder="⭐"
                />
              </label>
              <label className="space-y-2">
                <div className="text-xs font-black tracking-[0.24em] text-white/54 uppercase">星星</div>
                <input
                  type="number"
                  min={1}
                  max={999}
                  value={draft.points}
                  onChange={e => setDraft(state => ({ ...state, points: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-base text-white outline-none transition focus:border-[#7dd3fc]"
                />
              </label>
              <label className="space-y-2">
                <div className="text-xs font-black tracking-[0.24em] text-white/54 uppercase">说明</div>
                <input
                  value={draft.description}
                  onChange={e => setDraft(state => ({ ...state, description: e.target.value }))}
                  className="w-full rounded-2xl border border-white/12 bg-white/6 px-4 py-3 text-base text-white outline-none transition focus:border-[#7dd3fc]"
                  placeholder="例如：认真写完并检查一遍"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={saveEditor}
                className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff9f1c,#ffd166)] px-5 py-3 text-sm font-black text-[#071326] shadow-[0_20px_36px_rgba(255,159,28,0.22)] transition-transform hover:scale-[1.02]"
              >
                {editingTask ? '保存修改' : '添加到今天'}
              </button>

              {editingTask && (
                <button
                  type="button"
                  onClick={() => void togglePlanMembership(editingTask)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/8 px-5 py-3 text-sm font-black text-white/86 transition-transform hover:scale-[1.02]"
                >
                  {todayTaskIds.has(editingTask.id) ? '移出今天' : '加入今天'}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setEditorOpen(false)
                  setEditingTask(null)
                  setDraft(EMPTY_DRAFT)
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/6 px-5 py-3 text-sm font-black text-white/72 transition-transform hover:scale-[1.02]"
              >
                取消
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
