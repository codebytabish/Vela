import React, { useState, useRef, useEffect } from 'react'

const initialConversations = [
  {
    id: 1,
    name: 'Marisol Ferreira',
    messages: [
      { id: 1, from: 'them', text: "Hi David — confirming I'm still on for the interview Tuesday at 2pm." },
      { id: 2, from: 'me', text: "Confirmed on our end! I'll send a calendar invite with the video link shortly." },
      { id: 3, from: 'them', text: 'Perfect, looking forward to it!' },
    ],
  },
  {
    id: 2,
    name: 'Priya Anand',
    messages: [
      { id: 1, from: 'them', text: 'Could we move Wednesday to 11am instead of 10:30?' },
    ],
  },
  {
    id: 3,
    name: 'Tom Whitfield',
    messages: [
      { id: 1, from: 'them', text: 'Thanks for the update on next steps.' },
    ],
  },
]

const Messages = () => {
  const [conversations, setConversations] = useState(initialConversations)
  const [activeId, setActiveId] = useState(initialConversations[0].id)
  const [input, setInput] = useState('')
  const threadEndRef = useRef(null)

  const activeConversation = conversations.find((c) => c.id === activeId)

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages])

  const lastMessagePreview = (conv) => conv.messages[conv.messages.length - 1]?.text || ''

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, { id: Date.now(), from: 'me', text: trimmed }] }
          : c
      )
    )
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='p-5'>

      <div className='mb-5'>
        <h1 className='text-2xl md:text-3xl font-serif font-medium text-[#0F1A2B]'>Messages</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Direct conversations with candidates</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-[260px_1fr] border border-[#DBDCD3] rounded-md overflow-hidden bg-white min-h-[500px]'>

        {/* conversation list */}
        <div className='border-b md:border-b-0 md:border-r border-[#DBDCD3]'>
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full text-left px-4 py-3.5 border-b border-[#DBDCD3] last:border-b-0 transition-colors ${
                c.id === activeId ? 'bg-[#F5E7D2]' : 'hover:bg-[#EEF0EC]'
              }`}
            >
              <div className='text-sm font-semibold text-[#0F1A2B]'>{c.name}</div>
              <div className='text-[11.5px] text-[#3C4A5E] mt-0.5 truncate'>
                {lastMessagePreview(c)}
              </div>
            </button>
          ))}
        </div>

        {/* active thread */}
        <div className='flex flex-col p-5'>
          {activeConversation ? (
            <>
              <div className='text-sm font-semibold text-[#0F1A2B] pb-3 mb-3 border-b border-[#DBDCD3]'>
                {activeConversation.name}
              </div>

              <div className='flex-1 flex flex-col gap-3 overflow-y-auto max-h-[380px] pr-1'>
                {activeConversation.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[72%] px-3.5 py-2.5 rounded-[9px] text-[13px] leading-relaxed ${
                      m.from === 'them'
                        ? 'bg-[#EEF0EC] border border-[#DBDCD3] self-start text-[#0F1A2B]'
                        : 'bg-[#0F1A2B] text-white self-end'
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
                <div ref={threadEndRef} />
              </div>

              <div className='flex gap-2.5 mt-4 pt-4 border-t border-[#DBDCD3]'>
                <input
                  type='text'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder='Write a message…'
                  className='flex-1 px-3.5 py-2.5 border border-[#DBDCD3] rounded-lg text-[13px] bg-[#EEF0EC] focus:outline-none focus:border-[#C98A3E] transition-colors'
                />
                <button
                  onClick={handleSend}
                  className='bg-[#C98A3E] hover:bg-[#B67B33] rounded-lg px-4 text-sm text-white font-medium transition-colors'
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className='text-sm text-[#3C4A5E] m-auto'>Select a conversation</div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Messages