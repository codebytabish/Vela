import React, { useState } from 'react'

const skillNodes = [
  { id: 1, label: 'Figma', x: 120, y: 90, r: 22, strength: 95, tier: 'Expert', color: '#5C7A6E' },
  { id: 2, label: 'Systems', x: 360, y: 80, r: 22, strength: 90, tier: 'Expert', color: '#5C7A6E' },
  { id: 3, label: 'Research', x: 90, y: 230, r: 20, strength: 74, tier: 'Advanced', color: '#C98A3E' },
  { id: 4, label: 'Proto.', x: 370, y: 250, r: 18, strength: 68, tier: 'Advanced', color: '#C98A3E' },
  { id: 5, label: 'Clinical', x: 230, y: 300, r: 16, strength: 32, tier: 'Emerging', color: '#A6503E' },
]

const CENTER = { x: 240, y: 170 }

const suggestedSkills = ['Accessibility auditing', 'Design ops', 'Service blueprinting']

const SkillsGraph = () => {
  const [added, setAdded] = useState([])

  const addSuggested = (skill) => {
    if (!added.includes(skill)) setAdded([...added, skill])
  }

  return (
    <div className='p-5'>

      <div className='mb-5 pb-5 border-b border-[#DBDCD3]'>
        <h1 className='text-2xl md:text-3xl font-medium text-[#0F1A2B]'>Skills graph</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Extracted automatically from your experience — no manual tagging</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5'>

        {/* graph */}
        <div className='bg-white border border-[#DBDCD3] rounded-md p-5'>
          <svg viewBox='0 0 480 340' className='w-full h-[340px]'>

            {/* lines from center to each skill — drawn first so they sit behind the circles */}
            {skillNodes.map((node) => (
              <line
                key={`line-${node.id}`}
                x1={CENTER.x} y1={CENTER.y}
                x2={node.x} y2={node.y}
                stroke='#DBDCD3'
              />
            ))}

            {/* center "You" node */}
            <circle cx={CENTER.x} cy={CENTER.y} r='30' fill='#0F1A2B' />
            <text x={CENTER.x} y={CENTER.y + 4} textAnchor='middle' fill='#fff' fontFamily='Inter' fontSize='11' fontWeight='600'>
              You
            </text>

            {/* skill nodes */}
            {skillNodes.map((node) => (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} />
                <text
                  x={node.x} y={node.y + 4}
                  textAnchor='middle' fill='#fff' fontFamily='Inter'
                  fontSize={node.r > 19 ? 10 : 9}
                >
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* sidebar */}
        <div>
          <div className='bg-white border border-[#DBDCD3] rounded-md p-6 mb-5'>
            <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Skill strength</h3>
            <div className='flex flex-col gap-4'>
              {skillNodes.map((node) => (
                <div key={node.id}>
                  <div className='flex justify-between text-[12.5px] mb-1.5'>
                    <span className='text-[#0F1A2B]'>{node.label}</span>
                    <span className='font-mono text-[#3C4A5E]'>{node.tier}</span>
                  </div>
                  <div className='h-1.5 bg-[#DBDCD3] rounded-full overflow-hidden'>
                    <div
                      className='h-full rounded-full'
                      style={{ width: `${node.strength}%`, background: node.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
            <h3 className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Suggested to add</h3>
            <div className='divide-y divide-[#DBDCD3]'>
              {suggestedSkills.map((skill) => (
                <div key={skill} className='flex justify-between items-center py-2.5'>
                  <span className='text-[12.5px] text-[#0F1A2B]'>{skill}</span>
                  {added.includes(skill) ? (
                    <span className='text-[11px] font-mono text-[#5C7A6E]'>Added ✓</span>
                  ) : (
                    <button
                      onClick={() => addSuggested(skill)}
                      className='text-[11.5px] border border-[#DBDCD3] hover:border-[#0F1A2B] rounded px-2.5 py-1 text-[#0F1A2B] transition-colors'
                    >
                      Add
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SkillsGraph