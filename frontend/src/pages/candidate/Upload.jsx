import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const extractedFields = [
  { field: 'Full name', value: 'Marisol Ferreira', confidence: 99 },
  { field: 'Current title', value: 'Senior Product Designer', confidence: 97 },
  { field: 'Years experience', value: '6 years', confidence: 82 },
  { field: 'Skills detected', value: 'Figma, Design Systems, Prototyping, +9 more', confidence: 95 },
  { field: 'Education', value: 'B.A. Design, UC Davis', confidence: 61 },
]

const confidenceStyle = (score) => {
  if (score >= 90) return 'bg-[#E4EAE6] text-[#5C7A6E]'
  if (score >= 75) return 'bg-[#F5E7D2] text-[#8A5D22]'
  return 'bg-[#F2E0DC] text-[#A6503E]'
}

const Upload = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [fileName, setFileName] = useState(null)
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState(false)

  const startParse = (name) => {
    setFileName(name)
    setParsed(false)
    setParsing(true)
    // Simulated parse delay — replace with a real upload/parse API call later
    setTimeout(() => {
      setParsing(false)
      setParsed(true)
    }, 1400)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) startParse(file.name)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) startParse(file.name)
  }

  return (
    <div className='p-5'>

      <div className='mb-5  border-b border-[#DBDCD3] pb-5'>
        <h1 className='text-2xl md:text-3xl font-medium text-[#0F1A2B]'>Upload & parse</h1>
        <p className='text-sm text-[#3C4A5E]/70 mt-1'>Vela reads your file and extracts structured fields</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5'>

        {/* drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className='bg-white border-[1.5px] border-dashed border-[#DBDCD3] hover:border-[#C98A3E] rounded-md p-9 text-center cursor-pointer transition-colors'
        >
          <input
            ref={fileInputRef}
            type='file'
            accept='.pdf,.doc,.docx'
            onChange={handleFileSelect}
            className='hidden'
          />
          <div className='w-10 h-10 mx-auto mb-3.5 rounded-full border border-[#DBDCD3] flex items-center justify-center font-mono text-[#C98A3E]'>
            ↑
          </div>
          <h4 className='text-[14.5px] font-semibold text-[#0F1A2B] mb-1.5'>Resume file</h4>
          <p className='text-xs text-[#3C4A5E] mb-3.5'>PDF or DOCX, up to 5MB</p>
          {fileName ? (
            <span className='inline-flex items-center gap-1.5 text-[11.5px] font-mono bg-[#E4EAE6] text-[#5C7A6E] rounded-full px-3 py-1.5'>
              📄 {fileName}
            </span>
          ) : (
            <span className='text-[11.5px] text-[#3C4A5E]'>Click or drag a file here</span>
          )}
        </div>

        {/* parse status */}
        <div className='bg-white border border-[#DBDCD3] rounded-md p-6'>
          <div className='font-serif text-base font-semibold text-[#0F1A2B] mb-3'>Parse status</div>

          {!fileName && (
            <p className='text-[12.5px] text-[#3C4A5E] leading-relaxed'>
              Upload a resume to see extracted fields here.
            </p>
          )}

          {fileName && parsing && (
            <div className='inline-flex items-center gap-1.5 text-[11px] font-mono bg-[#F5E7D2] text-[#8A5D22] rounded-full px-2.5 py-1 mb-3'>
              <span className='w-1.5 h-1.5 rounded-full bg-[#8A5D22] animate-pulse' />
              Parsing…
            </div>
          )}

          {fileName && parsed && (
            <>
              <div className='inline-flex items-center gap-1.5 text-[11px] font-mono bg-[#E4EAE6] text-[#5C7A6E] rounded-full px-2.5 py-1 mb-3'>
                <span className='w-1.5 h-1.5 rounded-full bg-[#5C7A6E]' />
                Parsed in 1.4s
              </div>
              <p className='text-[12.5px] text-[#3C4A5E] leading-relaxed'>
                {extractedFields.length} of {extractedFields.length} sections recognized. Review the extracted fields below before saving to your profile.
              </p>
            </>
          )}
        </div>

      </div>

      {/* extracted fields review */}
      {parsed && (
        <div className='bg-white border border-[#DBDCD3] rounded-md p-6 mb-5'>
          <div className='font-serif text-base font-semibold text-[#0F1A2B] mb-4'>Review extracted fields</div>
          <div className='divide-y divide-[#DBDCD3]'>
            {extractedFields.map((f) => (
              <div key={f.field} className='flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 py-3.5'>
                <span className='text-xs font-mono text-[#3C4A5E] sm:w-[160px] shrink-0'>{f.field}</span>
                <span className='flex-1 text-[13.5px] text-[#0F1A2B]'>{f.value}</span>
                <span className={`text-[11px] font-mono px-2.5 py-1 rounded-full shrink-0 w-fit ${confidenceStyle(f.confidence)}`}>
                  {f.confidence}% confident
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* actions */}
      {parsed && (
        <div className='flex justify-end gap-3'>
          <button className='border border-[#DBDCD3] hover:border-[#0F1A2B] rounded py-2 px-3.5 text-sm text-[#0F1A2B] transition-colors'>
            Edit manually
          </button>
          <button
            onClick={() => navigate('/candidate/score')}
            className='bg-[#C98A3E] hover:bg-[#B67B33] rounded py-2 px-3.5 text-sm text-white font-medium transition-colors'
          >
            Confirm & score →
          </button>
        </div>
      )}

    </div>
  )
}

export default Upload