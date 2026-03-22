import type {
  Achievement,
  AppState,
  CapabilityId,
  Reward,
  SubjectId,
  Task,
  Theme,
  VoiceAnalysisInput,
  VoiceSession,
} from '../types'

export const SUBJECTS: { id: SubjectId; label: string; icon: string; color: string }[] = [
  { id: 'chinese', label: '语文', icon: '📖', color: '#f97316' },
  { id: 'math', label: '数学', icon: '🧮', color: '#38bdf8' },
  { id: 'english', label: '英语', icon: '🔤', color: '#34d399' },
  { id: 'science', label: '科学', icon: '🔬', color: '#a78bfa' },
  { id: 'arts', label: '艺术', icon: '🎨', color: '#fb7185' },
  { id: 'sport', label: '运动', icon: '🏃', color: '#22c55e' },
  { id: 'habit', label: '习惯', icon: '⏰', color: '#facc15' },
]

export const CAPABILITIES: { id: CapabilityId; label: string; icon: string; color: string }[] = [
  { id: 'focus', label: '专注力', icon: '🎯', color: '#60a5fa' },
  { id: 'reading', label: '阅读理解', icon: '📚', color: '#f59e0b' },
  { id: 'writing', label: '表达书写', icon: '✍️', color: '#f472b6' },
  { id: 'logic', label: '逻辑思维', icon: '🧠', color: '#22d3ee' },
  { id: 'speaking', label: '语言表达', icon: '🎙️', color: '#34d399' },
  { id: 'creativity', label: '创造力', icon: '✨', color: '#c084fc' },
  { id: 'fitness', label: '体能', icon: '💪', color: '#4ade80' },
  { id: 'discipline', label: '自律', icon: '🛡️', color: '#f87171' },
]

export const DEFAULT_TASKS: Task[] = [
  { id: 'study-1', title: '完成语文作业', icon: '📚', points: 15, category: 'study', description: '认真完成今天的语文作业', subjectId: 'chinese', capabilityIds: ['reading', 'discipline'] },
  { id: 'study-2', title: '数学训练 20 分钟', icon: '🧮', points: 12, category: 'study', description: '进行口算或思维题训练', subjectId: 'math', capabilityIds: ['logic', 'focus'] },
  { id: 'study-3', title: '英语朗读', icon: '🔤', points: 10, category: 'study', description: '朗读英语课文并录音', subjectId: 'english', capabilityIds: ['speaking', 'reading'] },
  { id: 'study-4', title: '科学观察记录', icon: '🔬', points: 10, category: 'study', description: '记录一个科学现象或实验', subjectId: 'science', capabilityIds: ['logic', 'writing'] },
  { id: 'sport-1', title: '跳绳运动', icon: '🏃', points: 10, category: 'sport', description: '跳绳或其他运动 30 分钟', subjectId: 'sport', capabilityIds: ['fitness', 'discipline'] },
  { id: 'sport-2', title: '眼保健操', icon: '👁️', points: 5, category: 'sport', description: '认真做眼保健操', subjectId: 'habit', capabilityIds: ['discipline'] },
  { id: 'fun-1', title: '画画创作', icon: '🎨', points: 10, category: 'fun', description: '发挥创意画一幅画', subjectId: 'arts', capabilityIds: ['creativity', 'focus'] },
  { id: 'extra-1', title: '帮做家务', icon: '🧹', points: 12, category: 'extra', description: '帮爸爸妈妈做家务', subjectId: 'habit', capabilityIds: ['discipline'] },
  { id: 'extra-2', title: '练习乐器', icon: '🎵', points: 15, category: 'extra', description: '练习乐器 30 分钟', subjectId: 'arts', capabilityIds: ['focus', 'creativity'] },
  { id: 'extra-3', title: '早睡早起', icon: '🌙', points: 10, category: 'extra', description: '按时睡觉，早起不赖床', subjectId: 'habit', capabilityIds: ['discipline'] },
]

export const DEFAULT_REWARDS: Reward[] = [
  { id: 'reward-1', title: '看一集动画', icon: '📺', cost: 30, description: '看 30 分钟喜欢的动画片' },
  { id: 'reward-2', title: '玩游戏 30 分钟', icon: '🎮', cost: 40, description: '玩游戏 30 分钟' },
  { id: 'reward-3', title: '选一本新书', icon: '📕', cost: 80, description: '去书店选一本喜欢的书' },
  { id: 'reward-4', title: '买一个小玩具', icon: '🧸', cost: 150, description: '买一个心仪的小玩具' },
  { id: 'reward-5', title: '去游乐园', icon: '🎡', cost: 300, description: '一次游乐园之旅' },
  { id: 'reward-6', title: '选晚餐菜单', icon: '🍕', cost: 50, description: '今晚的晚餐由你来定' },
]

export const THEMES: Theme[] = [
  { id: 'piggy', name: '猪猪侠·超能力量', emoji: '🐷⚡', bg: 'linear-gradient(135deg, #0a0520 0%, #1a0a3e 50%, #0d1b4e 100%)', cardBg: 'rgba(45, 27, 105, 0.4)', primary: '#00d4ff', secondary: '#b44fff', accent: '#FFD700', unlockCost: 0 },
  { id: 'ocean', name: '海洋冒险', emoji: '🌊🐬', bg: 'linear-gradient(135deg, #001a2e 0%, #003a5c 50%, #005580 100%)', cardBg: 'rgba(0, 58, 92, 0.4)', primary: '#00e5ff', secondary: '#00bfa5', accent: '#ffd54f', unlockCost: 200 },
  { id: 'forest', name: '森林精灵', emoji: '🌲🧚', bg: 'linear-gradient(135deg, #0a1f0a 0%, #1a3a1a 50%, #0d2e0d 100%)', cardBg: 'rgba(26, 58, 26, 0.4)', primary: '#00ff88', secondary: '#76ff03', accent: '#ffab40', unlockCost: 300 },
  { id: 'galaxy', name: '星际战士', emoji: '🚀⭐', bg: 'linear-gradient(135deg, #000010 0%, #0a0a2e 50%, #1a0a2e 100%)', cardBg: 'rgba(10, 10, 46, 0.4)', primary: '#e040fb', secondary: '#7c4dff', accent: '#ffd740', unlockCost: 400 },
  { id: 'candy', name: '糖果乐园', emoji: '🍭🎠', bg: 'linear-gradient(135deg, #2d0a20 0%, #4a0a35 50%, #2d1040 100%)', cardBg: 'rgba(74, 10, 53, 0.4)', primary: '#ff6eb4', secondary: '#ff4081', accent: '#f9a825', unlockCost: 250 },
]

export const MOTIVATIONS = [
  '超级英雄，你做到了！⚡',
  '太厉害了！猪猪侠为你骄傲！🐷',
  '能量满格，继续冲！💫',
  '你就是今天的超级英雄！🦸',
  '今天的努力，会变成明天的超能力！',
  '任务完成，成长值继续上涨！',
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-task', title: '初次出击', description: '完成第一个任务', icon: '⚡', condition: 'first_task' },
  { id: 'streak-3', title: '连续挑战者', description: '连续 3 天完成任务', icon: '🔥', condition: 'streak_3' },
  { id: 'streak-7', title: '超级坚持者', description: '连续 7 天完成任务', icon: '🌟', condition: 'streak_7' },
  { id: 'points-100', title: '积分新星', description: '累计获得 100 积分', icon: '💫', condition: 'points_100' },
  { id: 'points-500', title: '积分勇士', description: '累计获得 500 积分', icon: '🏆', condition: 'points_500' },
  { id: 'redeem-1', title: '第一次兑换', description: '完成第一次积分兑换', icon: '🎁', condition: 'redeem_1' },
]

export const LEVEL_NAMES = ['见习英雄', '能量战士', '超能新星', '银河勇士', '宇宙英雄', '传奇超人', '无限超人', '终极战神']

export function getLevelFromPoints(totalPoints: number): number {
  if (totalPoints < 100) return 1
  if (totalPoints < 300) return 2
  if (totalPoints < 600) return 3
  if (totalPoints < 1000) return 4
  if (totalPoints < 1500) return 5
  if (totalPoints < 2500) return 6
  if (totalPoints < 4000) return 7
  return 8
}

export function getNextLevelPoints(level: number): number {
  const thresholds = [0, 100, 300, 600, 1000, 1500, 2500, 4000, 9999]
  return thresholds[level] ?? 9999
}

export function getDefaultAppState(): AppState {
  return {
    totalPoints: 0,
    streak: 0,
    level: 1,
    lastActiveDate: '',
    unlockedThemes: ['piggy'],
    currentTheme: 'piggy',
  }
}

export function getSubjectMeta(subjectId?: SubjectId) {
  return SUBJECTS.find(subject => subject.id === subjectId) ?? SUBJECTS[0]
}

export function getCapabilityMeta(capabilityId?: CapabilityId) {
  return CAPABILITIES.find(item => item.id === capabilityId) ?? CAPABILITIES[0]
}

export function analyzeVoiceTranscript(input: VoiceAnalysisInput): Omit<VoiceSession, 'id' | 'userId' | 'profileId' | 'recordedAt'> {
  const cleanText = input.transcript.replace(/\s+/g, ' ').trim()
  const chars = cleanText.length
  const sentences = cleanText.split(/[。！？.!?]/).filter(Boolean).length || 1
  const words = cleanText.split(/\s+/).filter(Boolean)
  const uniqueWords = new Set(words).size || chars
  const duration = Math.max(10, input.durationSec)
  const pace = chars / duration
  const base = Math.min(100, 40 + chars * 0.8)
  const fluencyScore = Math.max(55, Math.min(100, Math.round(70 + Math.min(20, pace * 8))))
  const vocabularyScore = Math.max(50, Math.min(100, Math.round(55 + uniqueWords * 4 + sentences * 3)))
  const confidenceScore = Math.max(50, Math.min(100, Math.round(base * 0.35 + fluencyScore * 0.35 + vocabularyScore * 0.3)))
  const score = Math.round((fluencyScore + vocabularyScore + confidenceScore) / 3)
  const keywords = cleanText
    .replace(/[，。！？,.!?\n]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .slice(0, 5)

  const summary = input.mode === 'reading'
    ? '朗读表现稳定，建议继续强化语音清晰度和节奏控制。'
    : input.mode === 'retell'
    ? '复述结构基本完整，可继续提升信息组织和重点表达。'
    : '表达意愿良好，适合继续练习完整句输出和语言丰富度。'

  return {
    title: input.title,
    mode: input.mode,
    subjectId: input.subjectId,
    capabilityId: input.capabilityId,
    transcript: cleanText,
    durationSec: duration,
    score,
    fluencyScore,
    vocabularyScore,
    confidenceScore,
    keywords,
    summary,
  }
}
