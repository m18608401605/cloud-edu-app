import type {
  Achievement,
  AgeTier,
  AnalysisProviderProfile,
  AnalysisProviderProfileId,
  AppState,
  CapabilityId,
  InteractiveLesson,
  InteractiveLessonInput,
  InteractiveStep,
  KnowledgeCard,
  KnowledgeCardType,
  LearningSourceType,
  Reward,
  SubjectId,
  StyleProfile,
  StyleProfileId,
  Task,
  Theme,
  VideoModelProfile,
  VideoModelProfileId,
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

export const AGE_TIER_LABELS: Record<AgeTier, string> = {
  '6-7': '启航探索者',
  '8-10': '成长解题家',
  '11-12': '思维表达者',
}

export const KNOWLEDGE_CARD_TYPE_META: Record<KnowledgeCardType, { label: string; icon: string; color: string }> = {
  knowledge: { label: '知识点卡', icon: '🧠', color: '#38bdf8' },
  mistake: { label: '错因卡', icon: '🧩', color: '#fb7185' },
  method: { label: '方法卡', icon: '🪄', color: '#a78bfa' },
  expression: { label: '表达素材卡', icon: '🎤', color: '#34d399' },
  'good-word': { label: '好词卡', icon: '🍊', color: '#fb923c' },
  'good-sentence': { label: '好句卡', icon: '📝', color: '#f472b6' },
  'science-observation': { label: '科学观察卡', icon: '🔭', color: '#22d3ee' },
  'habit-plan': { label: '计划习惯卡', icon: '🗓️', color: '#facc15' },
  'reading-strategy': { label: '阅读策略卡', icon: '📚', color: '#60a5fa' },
  'math-pattern': { label: '数学模型卡', icon: '🧮', color: '#818cf8' },
  'english-pattern': { label: '英语表达卡', icon: '🔤', color: '#4ade80' },
}

const AGE_TIER_STYLES: Record<AgeTier, { tone: string; accent: string; vibe: string }> = {
  '6-7': { tone: '像一起闯关一样轻松明亮', accent: '#ff9f43', vibe: '多鼓励、多图像、一步一个问题' },
  '8-10': { tone: '像解锁任务一样有方法感', accent: '#22c55e', vibe: '平衡游戏感和思路感' },
  '11-12': { tone: '像少年研究员一样清晰专业', accent: '#38bdf8', vibe: '强调结构、表达和策略' },
}

const ADVANCED_BASE = (import.meta.env.VITE_ANALYSIS_ADVANCED_BASE_URL as string | undefined)?.trim() || '/api/frontier'
const ADVANCED_ENDPOINT = (import.meta.env.VITE_ANALYSIS_ADVANCED_ENDPOINT as string | undefined)?.trim() || `${ADVANCED_BASE}/media-analysis`
const DOMESTIC_BASE = (import.meta.env.VITE_ANALYSIS_DOMESTIC_BASE_URL as string | undefined)?.trim() || '/api/domestic'
const DOMESTIC_ENDPOINT = (import.meta.env.VITE_ANALYSIS_DOMESTIC_ENDPOINT as string | undefined)?.trim() || `${DOMESTIC_BASE}/media-analysis`

export const ANALYSIS_PROVIDER_PROFILES: Record<AnalysisProviderProfileId, AnalysisProviderProfile> = {
  advanced: {
    id: 'advanced',
    label: '最先进',
    shortLabel: '前沿',
    badge: 'Frontier Stack',
    description: '效果优先，适合验证更强的多模态理解、表达分析和生成质量。',
    complianceNote: '更适合实验和高质量验证，正式上线前需要再确认数据出境与合规边界。',
    providerName: 'frontier-multimodal-gateway',
    adapter: {
      mode: import.meta.env.VITE_ANALYSIS_ADVANCED_ENDPOINT ? 'http' : 'mock',
      endpoint: ADVANCED_ENDPOINT,
      providerName: 'frontier-multimodal-gateway',
      timeoutMs: 45000,
    },
    apiMap: {
      image: `${ADVANCED_BASE}/analyze/image`,
      voice: `${ADVANCED_BASE}/analyze/voice`,
      video: `${ADVANCED_BASE}/analyze/video`,
      lesson: `${ADVANCED_BASE}/generate/lesson`,
      parentGuidance: `${ADVANCED_BASE}/generate/parent-guidance`,
    },
    stacks: ['多模态理解', 'OCR/题图分析', '语音转写', '视频表达分析', '学习页生成'],
  },
  domestic: {
    id: 'domestic',
    label: '国内',
    shortLabel: '国内',
    badge: 'China Ready',
    description: '国内可用优先，适合正式部署、对象存储留在国内和监护人数据治理。',
    complianceNote: '更适合生产环境，接口建议全部经你的服务端网关再调用云厂商能力。',
    providerName: 'domestic-edu-gateway',
    adapter: {
      mode: import.meta.env.VITE_ANALYSIS_DOMESTIC_ENDPOINT ? 'http' : 'mock',
      endpoint: DOMESTIC_ENDPOINT,
      providerName: 'domestic-edu-gateway',
      timeoutMs: 30000,
    },
    apiMap: {
      image: `${DOMESTIC_BASE}/analyze/image`,
      voice: `${DOMESTIC_BASE}/analyze/voice`,
      video: `${DOMESTIC_BASE}/analyze/video`,
      lesson: `${DOMESTIC_BASE}/generate/lesson`,
      parentGuidance: `${DOMESTIC_BASE}/generate/parent-guidance`,
    },
    stacks: ['国内 OCR', '国内 ASR', '国内多模态', '家长建议生成', '视频异步分析'],
  },
}

export const STYLE_PROFILES: Record<StyleProfileId, StyleProfile> = {
  kids: {
    id: 'kids',
    label: '孩子端',
    shortLabel: 'Kids',
    description: '更明亮、更有任务闯关感，适合孩子直接操作。',
    mood: '大按钮、更多色彩、更轻更直接',
    panelBackground: 'linear-gradient(160deg, rgba(255,255,255,0.09), rgba(255,214,102,0.08))',
    panelBorder: '1px solid rgba(255,214,102,0.24)',
    accentRing: '0 0 0 1px rgba(255,214,102,0.18), 0 12px 40px rgba(255,214,102,0.08)',
  },
  parent: {
    id: 'parent',
    label: '家长端',
    shortLabel: 'Parent',
    description: '更专业、更稳重，强调信息结构和决策感。',
    mood: '报告感更强、颜色更克制、信息层级更清楚',
    panelBackground: 'linear-gradient(160deg, rgba(255,255,255,0.055), rgba(56,189,248,0.06))',
    panelBorder: '1px solid rgba(56,189,248,0.22)',
    accentRing: '0 0 0 1px rgba(56,189,248,0.16), 0 12px 40px rgba(56,189,248,0.08)',
  },
  brand: {
    id: 'brand',
    label: '品牌展示',
    shortLabel: 'Brand',
    description: '更适合演示和对外展示，强调视觉气质和产品势能。',
    mood: '更强渐变、展示感更足、过渡更明显',
    panelBackground: 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(168,85,247,0.08), rgba(244,114,182,0.08))',
    panelBorder: '1px solid rgba(244,114,182,0.22)',
    accentRing: '0 0 0 1px rgba(244,114,182,0.16), 0 18px 48px rgba(168,85,247,0.12)',
  },
}

export const VIDEO_MODEL_PROFILES: Record<VideoModelProfileId, VideoModelProfile> = {
  'frontier-gpt5': {
    id: 'frontier-gpt5',
    label: 'GPT-5 视频教练',
    shortLabel: 'GPT-5',
    providerProfileId: 'advanced',
    providerName: 'frontier-multimodal-gateway',
    modelName: 'gpt-5.1',
    description: '适合更强的反馈重写、家长建议生成和复杂表达点评。',
    bestFor: ['讲题思路', '复杂复述', '家长反馈'],
    endpoint: `${ADVANCED_BASE}/media-analysis`,
  },
  'frontier-openai-compatible': {
    id: 'frontier-openai-compatible',
    label: 'OpenAI 兼容网关',
    shortLabel: '兼容网关',
    providerProfileId: 'advanced',
    providerName: 'frontier-multimodal-gateway',
    modelName: 'openai-compatible',
    description: '适合快速替换不同前沿模型，统一走 OpenAI 兼容协议。',
    bestFor: ['快速切换模型', '实验验证', '多模型对比'],
    endpoint: `${ADVANCED_BASE}/media-analysis`,
  },
  'domestic-minimax': {
    id: 'domestic-minimax',
    label: 'MiniMax 2.5',
    shortLabel: 'MiniMax',
    providerProfileId: 'domestic',
    providerName: 'domestic-edu-gateway',
    modelName: 'MiniMax-M2.5',
    description: '适合国内可用场景，先跑通家长反馈、鼓励点评和视频总结。',
    bestFor: ['国内落地', '家长口语化反馈', '视频总结'],
    endpoint: `${DOMESTIC_BASE}/media-analysis`,
  },
  'domestic-custom': {
    id: 'domestic-custom',
    label: '国内自定义模型',
    shortLabel: '自定义',
    providerProfileId: 'domestic',
    providerName: 'domestic-edu-gateway',
    modelName: 'custom-domestic',
    description: '预留给你后续接百度、阿里、腾讯等国内模型网关。',
    bestFor: ['后续扩展', '企业网关', '多供应商切换'],
    endpoint: `${DOMESTIC_BASE}/media-analysis`,
  },
}

function clampText(input: string) {
  return input.replace(/\s+/g, ' ').trim()
}

export function getAgeTier(age?: number): AgeTier {
  if (!age || age <= 7) return '6-7'
  if (age <= 10) return '8-10'
  return '11-12'
}

export function getAgeTierStyle(ageTier: AgeTier) {
  return AGE_TIER_STYLES[ageTier]
}

export function getAnalysisProviderProfile(profileId: AnalysisProviderProfileId = 'advanced') {
  return ANALYSIS_PROVIDER_PROFILES[profileId] ?? ANALYSIS_PROVIDER_PROFILES.advanced
}

export function getStyleProfile(profileId: StyleProfileId = 'kids') {
  return STYLE_PROFILES[profileId] ?? STYLE_PROFILES.kids
}

export function getVideoModelProfile(profileId: VideoModelProfileId = 'frontier-gpt5') {
  return VIDEO_MODEL_PROFILES[profileId] ?? VIDEO_MODEL_PROFILES['frontier-gpt5']
}

export function listVideoModelProfiles(providerProfileId?: AnalysisProviderProfileId) {
  const items = Object.values(VIDEO_MODEL_PROFILES)
  return providerProfileId ? items.filter(item => item.providerProfileId === providerProfileId) : items
}

function getLessonBlueprint(subjectId: SubjectId, sourceType: LearningSourceType) {
  void sourceType
  if (subjectId === 'chinese') {
    return {
      summary: '先帮助孩子读懂材料，再把理解变成自己的表达。',
      strengths: ['把内容说清楚比直接背答案更重要', '每一次复述都在积累写作素材'],
      growthFocus: ['从关键句里找信息', '把理解转换成自己的话'],
      nextAction: '完成一轮复述后，再尝试把关键词用到自己的表达里。',
      steps: [
        ['看一看题目想问什么', '找到关键句或关键词', '你先说说这段内容主要讲了什么', '如果孩子卡住，让他先圈一个最重要的词语', '能用自己的话说出核心意思', '看懂'],
        ['把答案变成自己的表达', '不要只复述原句，要讲出自己的理解', '如果讲给同学听，你会怎么说', '提醒孩子少抄原句，多用自己的语言', '能把理解说清楚', '讲清'],
        ['积累一个可迁移的表达', '把本次的好词好句存进积累库', '哪一句最值得你以后写作文时用', '引导孩子说适用场景，而不是只摘抄', '把素材迁移到新场景', '迁移'],
      ],
      transferChallenges: ['换一个相似情境，再用自己的话复述一次。', '把今天积累的一句好句改写成更像你自己的表达。'],
    } as const
  }

  if (subjectId === 'math') {
    return {
      summary: '先把题目关系读懂，再把步骤讲清楚，最后用变式题验证是不是学会了。',
      strengths: ['每次说出题目关系，都是在训练真正的解题思路', '讲清楚为什么这样做，比单次算对更重要'],
      growthFocus: ['先审题，再列关系', '把每一步为什么说出来'],
      nextAction: '完成原题后，再做一道同结构变式题，把方法说给家长听。',
      steps: [
        ['找条件和问题', '先分清楚已知、未知、关系', '这道题真正问的是什么，哪两个条件最关键', '如果孩子着急算，提醒他先说题目关系', '能说出题目问法和关键条件', '看懂'],
        ['走出第一步', '先做最关键的一步，而不是全部算完', '如果先不算结果，你第一步会做什么', '让孩子先口头讲步骤，再动手算', '能做对关键一步', '做对'],
        ['讲清思路', '把步骤讲给别人听，才算真正掌握', '为什么这一步要这样做', '家长不要直接评价对错，先追问为什么', '能清楚讲出因果关系', '讲清'],
      ],
      transferChallenges: ['改一个数字，重新讲一次思路。', '换一种问法，再判断题目关系有没有变。'],
    } as const
  }

  if (subjectId === 'english') {
    return {
      summary: '先听懂和读懂，再用自己的英文或中文辅助表达出来。',
      strengths: ['敢开口比一次说满更重要', '短句说清楚，就能积累成稳定表达'],
      growthFocus: ['抓关键词', '让表达更完整'],
      nextAction: '用今天的核心句型再说一遍和自己生活有关的例子。',
      steps: [
        ['抓住关键词', '先找最重要的单词或句型', '这道内容里你最先看懂了哪个词或句型', '家长可以先帮助孩子找关键词，不要立刻翻译整段', '能识别关键词', '看懂'],
        ['说出完整句', '把零散词语拼成完整表达', '你可以用一句完整的话把它说出来吗', '如果孩子只说词，提醒他补主语或动作', '能说出完整句', '讲清'],
        ['迁移到自己的场景', '把表达用到自己的生活里', '如果换成你今天的经历，你会怎么说', '家长可以先给一个生活场景做桥梁', '能把句型迁移使用', '迁移'],
      ],
      transferChallenges: ['用今天的句型描述一次自己的经历。', '把关键词换成别的内容，再说一遍完整句。'],
    } as const
  }

  if (subjectId === 'science') {
    return {
      summary: '先观察，再猜想，再解释，让孩子把科学问题说完整。',
      strengths: ['愿意观察和提问，是科学思维的开始', '把原因讲出来，才是真正理解'],
      growthFocus: ['从现象走到原因', '把猜想讲完整'],
      nextAction: '换一个生活里的相似现象，再试着自己解释一次。',
      steps: [
        ['观察现象', '先说你看到了什么', '这个现象里最明显的变化是什么', '家长先问看到什么，不急着给结论', '能准确说出现象', '看懂'],
        ['提出猜想', '先大胆猜为什么，再验证', '你觉得为什么会这样', '鼓励孩子先猜，不要立刻纠正', '能提出合理猜想', '讲清'],
        ['说出原因', '把现象和原因连起来', '如果要讲给同学听，你会怎样解释', '家长可以追问“因为……所以……”的完整句式', '能把原因说完整', '迁移'],
      ],
      transferChallenges: ['找一个类似现象，再试着说原因。', '把今天的观察整理成一句科学小结。'],
    } as const
  }

  return {
    summary: '先理解任务，再说出自己的想法，最后把经验沉淀成可复用的方法。',
    strengths: ['孩子在表达自己的想法时，综合素养也在一起成长'],
    growthFocus: ['让想法更完整', '把行动建议变具体'],
    nextAction: '把今天的方法应用到一个新的生活场景里。',
    steps: [
      ['看清任务', '先知道这次要解决什么', '你觉得这次最重要的目标是什么', '帮助孩子把目标说成一句简单的话', '能说明目标', '看懂'],
      ['说出想法', '把想法从脑子里说出来', '你想先怎么做，为什么', '家长先听完，再帮孩子整理顺序', '能说清自己的想法', '讲清'],
      ['行动迁移', '把今天的方法迁移到生活里', '如果明天再遇到类似情况，你会怎么做', '引导孩子说出一个具体行动', '能给出可执行动作', '迁移'],
    ],
    transferChallenges: ['换一个生活情境，再说一次你的选择。', '把今天的方法教给另一个小朋友。'],
  } as const
}

export function generateInteractiveLesson(input: InteractiveLessonInput): InteractiveLesson {
  const cleanPrompt = clampText(input.prompt)
  const cleanSource = clampText(input.sourceText)
  const blueprint = getLessonBlueprint(input.subjectId, input.sourceType)
  const ageStyle = getAgeTierStyle(input.ageTier)
  const steps: InteractiveStep[] = blueprint.steps.map(([title, microGoal, question, parentPrompt, expectedOutcome, masteryStage], index) => ({
    id: `step-${index + 1}`,
    title,
    microGoal,
    question: `${question}${cleanPrompt ? `：${cleanPrompt}` : '。'}`,
    hint: `${ageStyle.vibe}。先从最容易的一点开始，不需要一次说完整。`,
    parentPrompt,
    expectedOutcome,
    masteryStage,
  }))

  return {
    id: `lesson-${Date.now()}`,
    title: input.title.trim() || `${getSubjectMeta(input.subjectId).label}互动学习页`,
    subjectId: input.subjectId,
    sourceType: input.sourceType,
    mode: input.mode,
    ageTier: input.ageTier,
    prompt: cleanPrompt,
    sourceText: cleanSource,
    sourceImage: input.sourceImage,
    summary: `${blueprint.summary} 当前页面风格为“${AGE_TIER_LABELS[input.ageTier]}”，整体语气 ${ageStyle.tone}。`,
    strengths: [...blueprint.strengths],
    growthFocus: [...blueprint.growthFocus],
    nextAction: blueprint.nextAction,
    steps,
    transferChallenges: [...blueprint.transferChallenges],
    createdAt: new Date().toISOString(),
  }
}

export function deriveKnowledgeCards(lesson: InteractiveLesson): KnowledgeCard[] {
  const now = new Date().toISOString()
  const cards: KnowledgeCard[] = lesson.steps.map((step, index) => ({
    id: `card-${lesson.id}-${index}`,
    profileId: lesson.profileId,
    title: `${step.title} · ${step.expectedOutcome}`,
    type: lesson.subjectId === 'chinese'
      ? index === 2 ? 'good-sentence' : index === 1 ? 'expression' : 'reading-strategy'
      : lesson.subjectId === 'math'
      ? index === 1 ? 'method' : index === 2 ? 'math-pattern' : 'knowledge'
      : lesson.subjectId === 'english'
      ? index === 2 ? 'english-pattern' : 'expression'
      : lesson.subjectId === 'science'
      ? index === 0 ? 'science-observation' : 'knowledge'
      : 'habit-plan',
    subjectId: lesson.subjectId,
    ageTier: lesson.ageTier,
    summary: step.microGoal,
    explanation: step.hint,
    example: step.question,
    scenario: step.parentPrompt,
    childUse: step.expectedOutcome,
    mastery: step.masteryStage,
    sourceLessonId: lesson.id,
    createdAt: now,
  }))

  if (lesson.subjectId === 'chinese') {
    cards.push({
      id: `card-${lesson.id}-phrase`,
      profileId: lesson.profileId,
      title: '本次好词好句积累',
      type: 'good-word',
      subjectId: lesson.subjectId,
      ageTier: lesson.ageTier,
      summary: '把这次学习中最有画面感或最能表达意思的词句存起来。',
      explanation: '摘一句你最喜欢的话，再换成自己的说法，这样才能真正学会使用。',
      example: lesson.sourceText.slice(0, 36) || lesson.prompt,
      scenario: '适合写人、写景、写感受时调用。',
      childUse: '先说说这句话为什么好，再试着改写成自己的句子。',
      mastery: '迁移',
      sourceLessonId: lesson.id,
      createdAt: now,
    })
  }

  return cards
}

export const STARTER_KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: 'starter-cn-1',
    title: '好句积累：把感觉写具体',
    type: 'good-sentence',
    subjectId: 'chinese',
    ageTier: '8-10',
    summary: '高兴不只写“我很开心”，可以写动作和表情。',
    explanation: '把情绪拆成动作、表情、语言，句子会更生动。',
    example: '我高兴得蹦了起来，连说话都带着笑意。',
    scenario: '写高兴、惊喜、激动时都能用。',
    childUse: '把“我很开心”改写成一句更有画面的句子。',
    mastery: '迁移',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'starter-math-1',
    title: '数学方法卡：先找已知再找未知',
    type: 'math-pattern',
    subjectId: 'math',
    ageTier: '8-10',
    summary: '应用题先找条件，再想第一步。',
    explanation: '先明确题目告诉了什么、问什么，再决定是加减还是比较关系。',
    example: '题目问“还剩多少”，要先找原来有多少、用掉多少。',
    scenario: '应用题、差量题、剩余问题都能用。',
    childUse: '下次先说已知和未知，不要一上来就算。',
    mastery: '讲清',
    createdAt: new Date().toISOString(),
  },
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

export function getDefaultAppState(): AppState {
  return {
    totalPoints: 0,
    streak: 0,
    level: 1,
    lastActiveDate: '',
    unlockedThemes: ['piggy'],
    currentTheme: 'piggy',
    analysisProviderProfileId: 'advanced',
    styleProfileId: 'kids',
    videoModelProfileId: 'frontier-gpt5',
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
