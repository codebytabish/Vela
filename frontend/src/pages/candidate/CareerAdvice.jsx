import React, { useState, useRef, useEffect } from 'react'

const initialMessages = [
  {
    id: 1,
    from: 'ai',
    text: "Based on your recent roles, you're well positioned for Staff-level design roles in regulated industries. Want a breakdown of what's missing to get there?",
  },
  {
    id: 2,
    from: 'user',
    text: 'Yes — what should I focus on next?',
  },
  {
    id: 3,
    from: 'ai',
    text: 'Two things stand out: deeper clinical-domain exposure, and a documented systems-leadership case study. Your Figma and design-systems skills already clear the bar for most Staff postings.',
  },
]

const suggestedPaths = [
  { id: 1, title: 'Staff Product Designer', detail: '2 skill gaps · 3 similar roles open now' },
  { id: 2, title: 'Design Systems Lead', detail: 'Ready now · 5 roles open' },
  { id: 3, title: 'Head of Design, small team', detail: '4 skill gaps · leadership track' },
]

// Very small canned-response set standing in for a real AI backend call.
const canned = [
  "That's a fair question — the short version: focus on depth over breadth for the next 6 months rather than picking up new tools.",
  "Good instinct to ask. I'd prioritize a portfolio case study that shows systems thinking at scale, since that's the gap I keep seeing against Staff-level postings.",
  "Worth noting: your profile is already strong on execution. What's missing is proof of leading through ambiguity — a project where you set the direction, not just delivered it.",
]

const CareerAdvice = () => {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const threadEndRef = useRef(null)

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMsg = { id: Date.now(), from: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setThinking(true)

    // Simulated AI reply — replace with a real backend call later.
    setTimeout(() => {
      const reply = canned[Math.floor(Math.random() * canned.length)]
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'ai', text: reply }])
      setThinking(false)
    }, 1100)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='p-5'>

      <div className='mb-5 border-b border-[#DBDCD3] pb-5'>
        <h1 className='text-2xl md:text-3xl font-medium text-[#0F1A2B]'>Career advice</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>AI guidance based on your profile and goals</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-5'>

        {/* chat */}
        <div className='bg-white border border-[#DBDCD3] rounded-md p-6 flex flex-col'>
          <div className='flex flex-col gap-4 mb-5 max-h-[420px] overflow-y-auto pr-1'>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[78%] px-4 py-3 rounded-[10px] text-[13.5px] leading-relaxed ${
                  m.from === 'ai'
                    ? 'bg-[#EEF0EC] border border-[#DBDCD3] self-start rounded-bl-[2px] text-[#0F1A2B]'
                    : 'bg-[#0F1A2B] text-white self-end rounded-br-[2px]'
                }`}
              >
                {m.text}
              </div>
            ))}

            {thinking && (
              <div className='bg-[#EEF0EC] border border-[#DBDCD3] self-start rounded-[10px] rounded-bl-[2px] px-4 py-3 flex gap-1.5'>
                <span className='w-1.5 h-1.5 rounded-full bg-[#3C4A5E] animate-bounce [animation-delay:-0.3s]' />
                <span className='w-1.5 h-1.5 rounded-full bg-[#3C4A5E] animate-bounce [animation-delay:-0.15s]' />
                <span className='w-1.5 h-1.5 rounded-full bg-[#3C4A5E] animate-bounce' />
              </div>
            )}
            <div ref={threadEndRef} />
          </div>

          <div className='flex gap-2.5'>
            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Ask about a role, skill gap, or career path…'
              className='flex-1 px-3.5 py-2.5 border border-[#DBDCD3] rounded-lg text-[13.5px] bg-[#EEF0EC] focus:outline-none focus:border-[#C98A3E] transition-colors'
            />
            <button
              onClick={handleSend}
              className='bg-[#C98A3E] hover:bg-[#B67B33] rounded-lg px-4 text-sm text-white font-medium transition-colors'
            >
              Send
            </button>
          </div>
        </div>

        {/* suggested paths */}
        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Suggested paths</h3>
          <div className='divide-y divide-[#DBDCD3]'>
            {suggestedPaths.map((p) => (
              <div key={p.id} className='py-3'>
                <div className='text-[13px] font-semibold text-[#0F1A2B]'>{p.title}</div>
                <div className='text-[11.5px] text-[#3C4A5E] mt-1'>{p.detail}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default CareerAdvice