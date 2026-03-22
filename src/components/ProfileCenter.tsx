import { useState } from 'react'
import { motion } from 'framer-motion'
import { CAPABILITIES, SUBJECTS } from '../data'
import { useStore } from '../store/useStore'
import type { CapabilityId, ChildProfile, SubjectId } from '../types'

const DEFAULT_FORM = {
  name: '',
  age: 8,
  grade: '',
  avatarEmoji: '🦸',
  target: '',
  focusSubjects: ['chinese', 'math'] as SubjectId[],
  focusCapabilities: ['focus', 'speaking'] as CapabilityId[],
}

export function ProfileCenter() {
  const { currentUser, childProfiles, activeProfileId, createChildProfile, updateChildProfile, deleteChildProfile, switchProfile, logout } = useStore()
  const [editing, setEditing] = useState<ChildProfile | null>(null)
  const [form, setForm] = useState(DEFAULT_FORM)

  if (!currentUser) {
    return (
      <div className="px-4">
        <div className="rounded-2xl p-6 text-center text-gray-400" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          登录后才能管理家庭账号和孩子成长档案。
        </div>
      </div>
    )
  }

  const openEdit = (profile?: ChildProfile) => {
    if (!profile) {
      setEditing(null)
      setForm(DEFAULT_FORM)
      return
    }
    setEditing(profile)
    setForm({
      name: profile.name,
      age: profile.age,
      grade: profile.grade,
      avatarEmoji: profile.avatarEmoji,
      target: profile.target,
      focusSubjects: profile.focusSubjects,
      focusCapabilities: profile.focusCapabilities,
    })
  }

  const submit = async () => {
    if (editing) await updateChildProfile(editing.id, form)
    else await createChildProfile(form)
    setEditing(null)
    setForm(DEFAULT_FORM)
  }

  const toggleValue = <T extends string>(list: T[], value: T) => list.includes(value) ? list.filter(item => item !== value) : [...list, value]

  return (
    <div className="relative z-10 px-4 space-y-4">
      <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <div className="text-white font-black text-lg">{currentUser.name}</div>
          <div className="text-gray-500 text-sm">{currentUser.email}</div>
        </div>
        <button onClick={logout} className="px-4 py-2 rounded-xl text-sm font-black text-rose-300 bg-rose-500/10 border border-rose-500/20">
          退出登录
        </button>
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-white font-black">孩子档案管理</div>
          <button onClick={() => openEdit()} className="px-3 py-1.5 rounded-xl text-sm font-black text-cyan-300 bg-cyan-400/10 border border-cyan-400/20">
            ＋ 新建档案
          </button>
        </div>

        <div className="space-y-3">
          {childProfiles.map(profile => (
            <motion.div key={profile.id} whileTap={{ scale: 0.99 }}
              className="rounded-2xl p-4"
              style={{
                background: activeProfileId === profile.id ? 'linear-gradient(135deg, rgba(0,255,255,0.12), rgba(79,70,229,0.12))' : 'rgba(255,255,255,0.03)',
                border: activeProfileId === profile.id ? '1px solid rgba(0,255,255,0.35)' : '1px solid rgba(255,255,255,0.08)',
              }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{profile.avatarEmoji}</div>
                  <div>
                    <div className="text-white font-black">{profile.name} · {profile.grade}</div>
                    <div className="text-gray-500 text-sm">年龄 {profile.age} 岁 · 目标：{profile.target || '持续成长'}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {profile.focusSubjects.map(subjectId => {
                        const subject = SUBJECTS.find(item => item.id === subjectId)
                        return <span key={subjectId} className="px-2 py-1 rounded-full text-xs font-black" style={{ color: subject?.color, background: `${subject?.color}18` }}>{subject?.icon} {subject?.label}</span>
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => switchProfile(profile.id)} className="px-3 py-1.5 rounded-xl text-xs font-black text-black" style={{ background: 'linear-gradient(135deg, #00ffff, #facc15)' }}>
                    {activeProfileId === profile.id ? '当前档案' : '切换档案'}
                  </button>
                  <button onClick={() => openEdit(profile)} className="px-3 py-1.5 rounded-xl text-xs font-black text-cyan-300 bg-cyan-400/10 border border-cyan-400/20">
                    编辑
                  </button>
                  <button onClick={() => deleteChildProfile(profile.id)} className="px-3 py-1.5 rounded-xl text-xs font-black text-rose-300 bg-rose-500/10 border border-rose-500/20">
                    删除
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {childProfiles.length === 0 && (
            <div className="text-center py-8 text-gray-500">还没有孩子档案，先创建一个档案来承载成长数据。</div>
          )}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="text-white font-black mb-3">{editing ? '编辑档案' : '新建档案'}</div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input value={form.name} onChange={e => setForm(s => ({ ...s, name: e.target.value }))} placeholder="孩子姓名" className="rounded-xl px-4 py-3 bg-white/10 text-white border border-white/10 placeholder-gray-500" />
          <input value={form.grade} onChange={e => setForm(s => ({ ...s, grade: e.target.value }))} placeholder="年级" className="rounded-xl px-4 py-3 bg-white/10 text-white border border-white/10 placeholder-gray-500" />
          <input type="number" min={3} max={18} value={form.age} onChange={e => setForm(s => ({ ...s, age: Number(e.target.value) }))} placeholder="年龄" className="rounded-xl px-4 py-3 bg-white/10 text-white border border-white/10 placeholder-gray-500" />
          <input value={form.avatarEmoji} onChange={e => setForm(s => ({ ...s, avatarEmoji: e.target.value }))} placeholder="头像 emoji" maxLength={2} className="rounded-xl px-4 py-3 bg-white/10 text-white border border-white/10 placeholder-gray-500" />
        </div>
        <input value={form.target} onChange={e => setForm(s => ({ ...s, target: e.target.value }))} placeholder="本阶段成长目标，例如：提升英语表达和专注力" className="w-full rounded-xl px-4 py-3 mb-3 bg-white/10 text-white border border-white/10 placeholder-gray-500" />

        <div className="mb-3">
          <div className="text-sm font-black text-gray-300 mb-2">重点学科</div>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map(subject => (
              <button key={subject.id} onClick={() => setForm(s => ({ ...s, focusSubjects: toggleValue(s.focusSubjects, subject.id) }))}
                className="px-3 py-1.5 rounded-full text-xs font-black"
                style={{
                  background: form.focusSubjects.includes(subject.id) ? `${subject.color}22` : 'rgba(255,255,255,0.05)',
                  color: form.focusSubjects.includes(subject.id) ? subject.color : '#94a3b8',
                }}>
                {subject.icon} {subject.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm font-black text-gray-300 mb-2">重点能力</div>
          <div className="flex flex-wrap gap-2">
            {CAPABILITIES.map(capability => (
              <button key={capability.id} onClick={() => setForm(s => ({ ...s, focusCapabilities: toggleValue(s.focusCapabilities, capability.id) }))}
                className="px-3 py-1.5 rounded-full text-xs font-black"
                style={{
                  background: form.focusCapabilities.includes(capability.id) ? `${capability.color}22` : 'rgba(255,255,255,0.05)',
                  color: form.focusCapabilities.includes(capability.id) ? capability.color : '#94a3b8',
                }}>
                {capability.icon} {capability.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={submit} className="w-full py-3 rounded-xl font-black text-slate-900" style={{ background: 'linear-gradient(135deg, #00ffff, #facc15)' }}>
          {editing ? '保存档案' : '创建档案'}
        </button>
      </div>
    </div>
  )
}
