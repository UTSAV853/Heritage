import React, { useState } from 'react'
import { BookOpen, RefreshCw, Cpu, MapPin, Lightbulb, MessageSquare, Clock, Globe, User, Heart } from 'lucide-react'
import { generateStory, getStoryDemo } from '../api/client'
import toast from 'react-hot-toast'

const INTERESTS = ['Architecture', 'History', 'Science', 'Religion', 'Festivals', 'Photography', 'Food', 'Local Culture']
const AGE_GROUPS = ['Child (under 12)', 'Teen (13-17)', 'Young Adult (18-30)', 'Adult (30-60)', 'Senior (60+)']
const LANGUAGES = ['English', 'Hindi', 'Gujarati']
const EXP_TYPES = ['Educational', 'Spiritual', 'Adventure', 'Photographic', 'Family-friendly', 'Academic']
const SITES = ['Modhera Sun Temple', 'Ahmedabad Walled City', 'Sidi Saiyyed Mosque']

export default function HeritageGuide() {
  const [form, setForm] = useState({
    site_name: 'Modhera Sun Temple',
    age_group: 'Adult (30-60)',
    language: 'English',
    interests: ['Architecture', 'History'],
    duration_minutes: 60,
    experience_type: 'Educational'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('story')

  const toggleInterest = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const generate = async () => {
    if (form.interests.length === 0) { toast.error('Select at least one interest'); return }
    setLoading(true)
    try {
      const res = await generateStory(form)
      setResult(res.data)
      toast.success('Heritage story generated!')
    } catch { toast.error('Failed to generate story') }
    finally { setLoading(false) }
  }

  const demo = async () => {
    setLoading(true)
    try {
      const res = await getStoryDemo(form.site_name, form.language, form.age_group)
      setResult(res.data)
      toast.success('Demo story ready!')
    } catch { toast.error('Demo failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-5 fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">AI Heritage Guide</h1>
        <p className="text-slate-400 text-sm mt-1">Personalized cultural storytelling powered by IBM Granite LLM</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Visitor profile form */}
        <div className="card space-y-4">
          <div className="section-title"><User size={16} className="text-heritage-400" /> Visitor Profile</div>

          <div>
            <label className="label-text block mb-1">Heritage Site</label>
            <select value={form.site_name} onChange={e => setForm({...form, site_name: e.target.value})} className="select-field">
              {SITES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="label-text block mb-1">Age Group</label>
            <select value={form.age_group} onChange={e => setForm({...form, age_group: e.target.value})} className="select-field">
              {AGE_GROUPS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div>
            <label className="label-text flex items-center gap-2 mb-1"><Globe size={12} /> Language</label>
            <div className="flex gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => setForm({...form, language: lang})}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    form.language === lang
                      ? 'bg-heritage-700 border-heritage-600 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text block mb-1">Interests (select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    form.interests.includes(interest)
                      ? 'bg-heritage-800/60 border-heritage-600 text-heritage-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-text flex items-center gap-1.5 mb-1">
              <Clock size={12} /> Available Time: {form.duration_minutes} min
            </label>
            <input
              type="range" min="15" max="180" step="15"
              value={form.duration_minutes}
              onChange={e => setForm({...form, duration_minutes: +e.target.value})}
              className="w-full accent-heritage-500"
            />
            <div className="flex justify-between text-xs text-slate-600">
              <span>15 min</span><span>60 min</span><span>3 hrs</span>
            </div>
          </div>

          <div>
            <label className="label-text block mb-1">Experience Type</label>
            <select value={form.experience_type} onChange={e => setForm({...form, experience_type: e.target.value})} className="select-field">
              {EXP_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={generate} disabled={loading} className="btn-primary flex-1">
              {loading ? <><RefreshCw size={13} className="animate-spin" /> Generating...</> : <><Cpu size={13} /> Generate Story</>}
            </button>
            <button onClick={demo} disabled={loading} className="btn-secondary text-xs">
              Sample Story
            </button>
          </div>
        </div>

        {/* Story output */}
        <div className="lg:col-span-2">
          {!result && !loading && (
            <div className="card flex flex-col items-center justify-center h-96 text-slate-500 gap-4">
              <BookOpen size={48} className="text-slate-700" />
              <div className="text-center">
                <div className="font-medium text-slate-400 text-lg">Your Heritage Story Awaits</div>
                <div className="text-sm">Configure your visitor profile and click Generate Story</div>
                <div className="text-xs text-slate-600 mt-2">Powered by IBM Granite LLM</div>
              </div>
            </div>
          )}

          {loading && (
            <div className="card flex flex-col items-center justify-center h-96 gap-5">
              <div className="relative">
                <div className="w-16 h-16 border-2 border-heritage-600 border-t-transparent rounded-full animate-spin" />
                <Cpu size={20} className="absolute inset-0 m-auto text-heritage-400" />
              </div>
              <div className="text-center">
                <div className="text-slate-300 font-medium">IBM Granite is crafting your story...</div>
                <div className="text-slate-500 text-sm mt-1">Personalizing for {form.age_group} · {form.language} · {form.duration_minutes} min</div>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 slide-in">
              {/* Profile badge */}
              <div className="card bg-heritage-950/30 border-heritage-800/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="section-title">
                    <Heart size={15} className="text-heritage-400" />
                    {result.site_name}
                  </div>
                  <span className="badge badge-purple text-xs">{result.powered_by?.includes('Granite') ? 'IBM Granite' : 'AI Generated'}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  <span>👤 {result.visitor_profile?.age_group}</span>
                  <span>🌐 {result.visitor_profile?.language}</span>
                  <span>⏱️ {result.visitor_profile?.duration_minutes} min</span>
                  {result.visitor_profile?.interests?.slice(0, 3).map(i => (
                    <span key={i} className="badge badge-gray">{i}</span>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
                {[
                  { key: 'story', label: 'Story', icon: BookOpen },
                  { key: 'facts', label: 'Facts', icon: Lightbulb },
                  { key: 'route', label: 'Route', icon: MapPin },
                  { key: 'followup', label: 'Q&A', icon: MessageSquare },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium transition-all ${
                      activeTab === key ? 'bg-slate-700 text-slate-100' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Icon size={12} /> {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="card">
                {activeTab === 'story' && (
                  <div className="space-y-4">
                    <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                      {result.detailed_story || result.short_story}
                    </div>
                    {result.visitor_tips?.length > 0 && (
                      <div className="border-t border-slate-800 pt-3">
                        <div className="label-text mb-2">Visitor Tips</div>
                        <ul className="space-y-1">
                          {result.visitor_tips.map((tip, i) => (
                            <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                              <span className="text-heritage-500 mt-0.5">•</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'facts' && (
                  <div className="space-y-3">
                    <div className="label-text mb-2">Interesting Facts</div>
                    {result.interesting_facts?.map((fact, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                        <span className="text-heritage-400 font-bold flex-shrink-0">{i + 1}.</span>
                        <span className="text-sm text-slate-300 leading-relaxed">{fact}</span>
                      </div>
                    ))}
                    {result.did_you_know?.length > 0 && (
                      <div className="mt-4">
                        <div className="label-text mb-2">💡 Did You Know?</div>
                        {result.did_you_know.slice(0, 2).map((fact, i) => (
                          <div key={i} className="text-sm text-yellow-200/80 bg-yellow-950/20 border border-yellow-900/40 rounded-lg p-3 mb-2 italic">
                            "{fact}"
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'route' && (
                  <div className="space-y-3">
                    <div className="label-text mb-2 flex items-center gap-2">
                      <Clock size={12} /> {result.visitor_profile?.duration_minutes}-Minute Heritage Walk
                    </div>
                    <div className="text-sm text-slate-200 bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 leading-relaxed">
                      {result.walking_route}
                    </div>
                    {result.architecture_highlights?.length > 0 && (
                      <div>
                        <div className="label-text mb-2">Architecture Highlights</div>
                        <ul className="space-y-1.5">
                          {result.architecture_highlights.map((h, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="text-blue-400 mt-0.5">▸</span> {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'followup' && (
                  <div className="space-y-2">
                    <div className="label-text mb-2">Follow-up Questions to Explore</div>
                    {result.follow_up_questions?.map((q, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 cursor-pointer hover:border-heritage-700 transition-colors">
                        <MessageSquare size={14} className="text-heritage-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300">{q}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-600 text-center">{result.disclaimer}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
