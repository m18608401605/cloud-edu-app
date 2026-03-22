import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CAPABILITIES, SUBJECTS } from '../data'
import { useStore } from '../store/useStore'
import type { CapabilityId, SubjectId, VoiceMode } from '../types'

type SpeechRecognitionCtor = new () => {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

export function VoiceLab() {
  const { currentUser, activeProfileId, createVoiceSession, voiceSessions, deleteVoiceSession } = useStore()
  const [title, setTitle] = useState('英语朗读练习')
  const [mode, setMode] = useState<VoiceMode>('reading')
  const [subjectId, setSubjectId] = useState<SubjectId>('english')
  const [capabilityId, setCapabilityId] = useState<CapabilityId>('speaking')
  const [transcript, setTranscript] = useState('')
  const [durationSec, setDurationSec] = useState(45)
  const [isListening, setIsListening] = useState(false)
  const [supportMessage, setSupportMessage] = useState('')
  const timerRef = useRef<number | null>(null)
  const recognitionRef = useRef<InstanceType<SpeechRecognitionCtor> | null>(null)

  useEffect(() => () => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    recognitionRef.current?.stop()
  }, [])

  if (!currentUser || !activeProfileId) {
    return (
      <div className="px-4">
        <div className="rounded-2xl p-6 text-center text-gray-400" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          请先登录并创建孩子档案，再使用语音分析功能。
        </div>
      </div>
    )
  }

  const toggleListening = () => {
    const ctor = (window as Window & typeof globalThis & { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition
      ?? (window as Window & typeof globalThis & { webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition

    if (!ctor) {
      setSupportMessage('当前浏览器不支持语音识别，仍可手动填写转写文本后进行分析。')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      if (timerRef.current) window.clearInterval(timerRef.current)
      setIsListening(false)
      return
    }

    const recognition = new ctor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'zh-CN'
    recognition.onresult = event => {
      const text = Array.from(event.results)
        .map(result => result[0]?.transcript ?? '')
        .join('')
      setTranscript(text)
    }
    recognition.onend = () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      setIsListening(false)
    }
    recognition.start()
    recognitionRef.current = recognition
    setIsListening(true)
    timerRef.current = window.setInterval(() => setDurationSec(value => value + 1), 1000)
  }

  const saveVoiceAnalysis = async () => {
    if (!transcript.trim()) return
    await createVoiceSession({ title, mode, subjectId, capabilityId, transcript, durationSec })
    setTranscript('')
    setDurationSec(45)
    setSupportMessage('语音分析已保存到当前孩子档案。')
  }

  return (
    <div className="relative z-10 px-4 space-y-4">
      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="text-white font-black mb-3">语音分析工作台</div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="练习标题" className="rounded-xl px-4 py-3 bg-white/10 text-white border border-white/10 placeholder-gray-500" />
          <select value={mode} onChange={e => setMode(e.target.value as VoiceMode)} className="rounded-xl px-4 py-3 bg-white/10 text-white border border-white/10">
            <option value="reading">朗读分析</option>
            <option value="retell">复述分析</option>
            <option value="speaking">自由表达</option>
          </select>
          <select value={subjectId} onChange={e => setSubjectId(e.target.value as SubjectId)} className="rounded-xl px-4 py-3 bg-white/10 text-white border border-white/10">
            {SUBJECTS.map(subject => <option key={subject.id} value={subject.id}>{subject.label}</option>)}
          </select>
          <select value={capabilityId} onChange={e => setCapabilityId(e.target.value as CapabilityId)} className="rounded-xl px-4 py-3 bg-white/10 text-white border border-white/10">
            {CAPABILITIES.map(capability => <option key={capability.id} value={capability.id}>{capability.label}</option>)}
          </select>
        </div>

        <div className="flex gap-3 mb-3">
          <button onClick={toggleListening} className="flex-1 py-3 rounded-xl font-black text-slate-900" style={{ background: isListening ? 'linear-gradient(135deg, #fb7185, #f97316)' : 'linear-gradient(135deg, #00ffff, #4f46e5)' }}>
            {isListening ? '停止语音识别' : '开始语音识别'}
          </button>
          <input type="number" min={10} value={durationSec} onChange={e => setDurationSec(Number(e.target.value))}
            className="w-28 rounded-xl px-4 py-3 bg-white/10 text-white border border-white/10" />
        </div>

        <textarea
          value={transcript}
          onChange={e => setTranscript(e.target.value)}
          placeholder="识别文本会显示在这里，也可以手动粘贴孩子的朗读/复述内容。"
          rows={6}
          className="w-full rounded-2xl px-4 py-3 bg-white/10 text-white border border-white/10 placeholder-gray-500"
        />
        <button onClick={saveVoiceAnalysis} className="w-full mt-3 py-3 rounded-xl font-black text-slate-900" style={{ background: 'linear-gradient(135deg, #facc15, #22c55e)' }}>
          保存语音分析
        </button>
        {supportMessage && <div className="mt-3 text-sm text-cyan-300">{supportMessage}</div>}
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="text-white font-black mb-3">语音成长记录</div>
        <div className="space-y-3">
          {voiceSessions.map(session => {
            const subject = SUBJECTS.find(item => item.id === session.subjectId)
            const capability = CAPABILITIES.find(item => item.id === session.capabilityId)
            return (
              <motion.div key={session.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white font-black">{session.title}</div>
                    <div className="text-gray-500 text-sm mt-1">
                      {subject?.icon} {subject?.label} · {capability?.icon} {capability?.label} · {Math.round(session.durationSec)} 秒
                    </div>
                  </div>
                  <button onClick={() => deleteVoiceSession(session.id)} className="px-3 py-1.5 rounded-xl text-xs font-black text-rose-300 bg-rose-500/10 border border-rose-500/20">
                    删除
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[
                    ['综合', session.score],
                    ['流畅', session.fluencyScore],
                    ['词汇', session.vocabularyScore],
                    ['自信', session.confidenceScore],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl p-2 text-center" style={{ background: 'rgba(0,255,255,0.08)' }}>
                      <div className="text-xs text-gray-400">{label}</div>
                      <div className="text-cyan-300 font-black">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="text-gray-300 text-sm mt-3 leading-relaxed">{session.summary}</div>
              </motion.div>
            )
          })}
          {voiceSessions.length === 0 && <div className="text-center py-8 text-gray-500">还没有语音记录，先创建一条朗读或复述分析。</div>}
        </div>
      </div>
    </div>
  )
}
