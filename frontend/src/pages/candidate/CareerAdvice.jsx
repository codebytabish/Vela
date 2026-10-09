import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'

const card = 'bg-white border border-[#DBDCD3] rounded-md p-6'

const CareerAdvice = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasResume, setHasResume] = useState(true)
  const [paths, setPaths] = useState([])
  const [questions, setQuestions] = useState([])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const boxRef = useRef(null)

  useEffect(() => {
    api('/career/overview')
      .then((d) => {
        setHasResume(d.hasResume)
        if (!d.hasResume) return
        setPaths(d.paths)
        setQuestions(d.questions)
        setMessages([{ role: 'assistant', text: d.intro }])
      })
      .catch((e) => setError(e.message || 'Could not load career advice'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight
  }, [messages, thinking])

  const send = async (text, intent) => {
    const msg = (text ?? input).trim()
    if (!msg || thinking) return
    setMessages((m) => [...m, { role: 'user', text: msg }])
    setInput('')
    setThinking(true)
    try {
      const d = await api('/career/ask', { method: 'POST', body: { message: msg, intent } })
      setMessages((m) => [...m, { role: 'assistant', text: d.reply.text, bullets: d.reply.bullets }])
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', text: e.message || 'Something went wrong. Try again.' }])
    } finally {
      setThinking(false)
    }
  }

  if (loading) return <div className='p-5 text-sm text-[#3C4A5E]'>Loading…</div>

  if (!hasResume) {
    return (
      <div className='p-5'>
        <h1 className='text-2xl font-serif font-bold text-[#0F1A2B] mb-2'>Career advice</h1>
        <div className={card}>
          <p className='text-sm text-[#3C4A5E] mb-4'>I need your resume to give advice.</p>
          <div className='flex gap-4'>
            <Link to='/candidate/builder' className='text-sm font-semibold text-[#C98A3E]'>Build one →</Link>
            <Link to='/candidate/upload' className='text-sm font-semibold text-[#C98A3E]'>Upload one →</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='p-5'>
      <div className='mb-5 border-b border-[#DBDCD3] pb-5'>
        <h1 className='text-2xl font-serif font-bold text-[#0F1A2B]'>Career advice</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Guidance based on your resume, skills and goals</p>
      </div>

      {error && <p className='text-sm text-[#A6503E] mb-3'>{error}</p>}

      <div className='grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 items-start'>

        {/* chat */}
        <div className={card}>
          <div ref={boxRef} className='h-[380px] overflow-y-auto flex flex-col gap-3 pr-1'>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[88%] rounded-lg px-4 py-3 text-[13px] leading-relaxed ${
                  m.role === 'user'
                    ? 'self-end bg-[#0F1A2B] text-white'
                    : 'self-start bg-[#EEF0EC] text-[#0F1A2B]'
                }`}
              >
                <p>{m.text}</p>
                {m.bullets?.length > 0 && (
                  <ul className='list-disc pl-5 mt-2 flex flex-col gap-1.5'>
                    {m.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
            {thinking && (
              <div className='self-start bg-[#EEF0EC] rounded-lg px-4 py-3 text-[13px] text-[#3C4A5E]'>Thinking…</div>
            )}
          </div>

          <div className='flex flex-wrap gap-2 mt-4'>
            {questions.map((q) => (
              <button
                key={q.id}
                disabled={thinking}
                onClick={() => send(q.label, q.id)}
                className='cursor-pointer text-xs px-3 py-1.5 rounded-full border border-[#DBDCD3] text-[#3C4A5E] hover:border-[#0F1A2B] hover:text-[#0F1A2B] transition-colors disabled:opacity-50'
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className='flex gap-2.5 mt-4'>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder='Ask about your skills, roles or resume…'
              className='flex-1 px-3 py-2.5 border border-[#DBDCD3] rounded-[5px] text-[13.5px] text-[#0F1A2B] bg-[#EEF0EC] focus:outline-none focus:border-[#C98A3E]'
            />
            <button
              onClick={() => send()}
              disabled={thinking || !input.trim()}
              className='cursor-pointer bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-4 text-sm text-white font-medium transition-colors disabled:opacity-50'
            >
              Send
            </button>
          </div>
        </div>

        {/* suggested paths */}
        <div className={card}>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Suggested paths</h3>
          <div className='flex flex-col'>
            {paths.map((p, i) => (
              <div key={`${p.kind}-${p.title}`} className={`py-4 ${i !== paths.length - 1 ? 'border-b border-[#DBDCD3]' : ''}`}>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    {p.kind === 'target' && (
                      <div className='font-mono text-[10px] uppercase tracking-wide text-[#C98A3E] mb-1'>Your target job</div>
                    )}
                    <div className='text-[13.5px] font-semibold text-[#0F1A2B]'>{p.title}</div>
                    <div className='text-xs text-[#3C4A5E] mt-0.5'>{p.label}</div>
                  </div>
                  <span className='font-mono text-xs text-[#5C7A6E] shrink-0'>{p.readiness}%</span>
                </div>
                <div className='h-1.5 bg-[#DBDCD3] rounded-full overflow-hidden mt-2.5'>
                  <div className='h-full rounded-full bg-[#5C7A6E]' style={{ width: `${p.readiness}%` }} />
                </div>
                {p.gaps.length > 0 && (
                  <div className='flex flex-wrap gap-1.5 mt-2.5'>
                    {p.gaps.map((g) => (
                      <span key={g} className='text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#F2E0DC] text-[#A6503E]'>{g}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className='text-[11.5px] text-[#3C4A5E] mt-3 leading-relaxed'>
            Match is how well your evidenced skills cover each role's core skills. Red tags are skills you are missing.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CareerAdvice