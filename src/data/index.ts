import type { Task, Reward, Theme, Achievement } from '../types'

export const DEFAULT_TASKS: Task[] = [
  // 学习
  { id: 'study-1', title: '完成作业', icon: '📚', points: 15, category: 'study', description: '认真完成今天的作业' },
  { id: 'study-2', title: '课外阅读', icon: '📖', points: 10, category: 'study', description: '阅读课外书30分钟' },
  { id: 'study-3', title: '背单词', icon: '🔤', points: 10, category: 'study', description: '背诵英语单词' },
  { id: 'study-4', title: '练字', icon: '✍️', points: 8, category: 'study', description: '练习书法或写字' },
  // 运动
  { id: 'sport-1', title: '跳绳运动', icon: '🏃', points: 10, category: 'sport', description: '跳绳或其他运动30分钟' },
  { id: 'sport-2', title: '眼保健操', icon: '👁️', points: 5, category: 'sport', description: '认真做眼保健操' },
  { id: 'sport-3', title: '骑自行车', icon: '🚴', points: 12, category: 'sport', description: '骑车锻炼' },
  // 娱乐
  { id: 'fun-1', title: '画画创作', icon: '🎨', points: 10, category: 'fun', description: '发挥创意画一幅画' },
  { id: 'fun-2', title: '搭积木', icon: '🧱', points: 8, category: 'fun', description: '用积木创造新作品' },
  // 课外拓展
  { id: 'extra-1', title: '帮做家务', icon: '🧹', points: 12, category: 'extra', description: '帮爸爸妈妈做家务' },
  { id: 'extra-2', title: '练习乐器', icon: '🎵', points: 15, category: 'extra', description: '练习乐器30分钟' },
  { id: 'extra-3', title: '好好吃饭', icon: '🍱', points: 5, category: 'extra', description: '不挑食，好好吃饭' },
  { id: 'extra-4', title: '早睡早起', icon: '🌙', points: 10, category: 'extra', description: '按时睡觉，早起不赖床' },
]

export const DEFAULT_REWARDS: Reward[] = [
  { id: 'reward-1', title: '看一集动画', icon: '📺', cost: 30, description: '看30分钟喜欢的动画片' },
  { id: 'reward-2', title: '玩游戏30分钟', icon: '🎮', cost: 40, description: '玩游戏30分钟' },
  { id: 'reward-3', title: '选一本新书', icon: '📕', cost: 80, description: '去书店选一本喜欢的书' },
  { id: 'reward-4', title: '买一个小玩具', icon: '🧸', cost: 150, description: '买一个心仪的小玩具' },
  { id: 'reward-5', title: '去游乐园', icon: '🎡', cost: 300, description: '一次游乐园之旅' },
  { id: 'reward-6', title: '选晚餐菜单', icon: '🍕', cost: 50, description: '今晚的晚餐由你来定！' },
  { id: 'reward-7', title: '晚睡一小时', icon: '🌟', cost: 60, description: '今晚可以晚睡一小时' },
]

export const THEMES: Theme[] = [
  {
    id: 'piggy',
    name: '猪猪侠·超能力量',
    emoji: '🐷⚡',
    bg: 'linear-gradient(135deg, #0a0520 0%, #1a0a3e 50%, #0d1b4e 100%)',
    cardBg: 'rgba(45, 27, 105, 0.4)',
    primary: '#00d4ff',
    secondary: '#b44fff',
    accent: '#FFD700',
    unlockCost: 0,
  },
  {
    id: 'ocean',
    name: '海洋冒险',
    emoji: '🌊🐬',
    bg: 'linear-gradient(135deg, #001a2e 0%, #003a5c 50%, #005580 100%)',
    cardBg: 'rgba(0, 58, 92, 0.4)',
    primary: '#00e5ff',
    secondary: '#00bfa5',
    accent: '#ffd54f',
    unlockCost: 200,
  },
  {
    id: 'forest',
    name: '森林精灵',
    emoji: '🌲🧚',
    bg: 'linear-gradient(135deg, #0a1f0a 0%, #1a3a1a 50%, #0d2e0d 100%)',
    cardBg: 'rgba(26, 58, 26, 0.4)',
    primary: '#00ff88',
    secondary: '#76ff03',
    accent: '#ffab40',
    unlockCost: 300,
  },
  {
    id: 'galaxy',
    name: '星际战士',
    emoji: '🚀⭐',
    bg: 'linear-gradient(135deg, #000010 0%, #0a0a2e 50%, #1a0a2e 100%)',
    cardBg: 'rgba(10, 10, 46, 0.4)',
    primary: '#e040fb',
    secondary: '#7c4dff',
    accent: '#ffd740',
    unlockCost: 400,
  },
  {
    id: 'candy',
    name: '糖果乐园',
    emoji: '🍭🎠',
    bg: 'linear-gradient(135deg, #2d0a20 0%, #4a0a35 50%, #2d1040 100%)',
    cardBg: 'rgba(74, 10, 53, 0.4)',
    primary: '#ff6eb4',
    secondary: '#ff4081',
    accent: '#f9a825',
    unlockCost: 250,
  },
]

export const MOTIVATIONS = [
  '超级英雄，你做到了！⚡',
  '太厉害了！猪猪侠为你骄傲！🐷',
  '能量满格，继续冲！💫',
  '你就是今天的超级英雄！🦸',
  '棒棒哒！积分+1，成长+∞！🌟',
  '完成任务！英雄勋章解锁中...🏅',
  '哇！你的能量值又提升了！⚡',
  '坚持就是超能力！加油！💪',
  '每天进步一点点，你就是最棒的！✨',
  '超级任务完成！宇宙都在为你喝彩！🌌',
  '你的努力，时光都记得！📖',
  '今天的你，比昨天更强！🔥',
]

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-task', title: '初次出击', description: '完成第一个任务', icon: '⚡', condition: 'first_task' },
  { id: 'streak-3', title: '连续挑战者', description: '连续3天完成任务', icon: '🔥', condition: 'streak_3' },
  { id: 'streak-7', title: '超级坚持者', description: '连续7天完成任务', icon: '🌟', condition: 'streak_7' },
  { id: 'points-100', title: '积分新星', description: '累计获得100积分', icon: '💫', condition: 'points_100' },
  { id: 'points-500', title: '积分勇士', description: '累计获得500积分', icon: '🏆', condition: 'points_500' },
  { id: 'points-1000', title: '积分传奇', description: '累计获得1000积分', icon: '👑', condition: 'points_1000' },
  { id: 'redeem-1', title: '第一次兑换', description: '完成第一次积分兑换', icon: '🎁', condition: 'redeem_1' },
  { id: 'all-daily', title: '完美一天', description: '一天内完成所有任务', icon: '🌈', condition: 'all_daily' },
]

export const LEVEL_NAMES = [
  '见习英雄', '能量战士', '超能新星', '银河勇士',
  '宇宙英雄', '传奇超人', '无限超人', '终极战神',
]

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
