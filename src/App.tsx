import{useState,useEffect,useRef,useCallback}from'react'
  const TEXTS=[
    "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!",
    "TypeScript is a strongly typed programming language that builds on JavaScript. It adds optional static typing and class-based object-oriented programming.",
    "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render.",
    "Clean code is simple and direct. Clean code reads like well-written prose. Clean code never obscures the designer's intent but rather is full of crisp abstractions.",
  ]
  type Status='idle'|'running'|'done'
  export default function App(){
    const[textIdx,setTextIdx]=useState(0)
    const[typed,setTyped]=useState('')
    const[status,setStatus]=useState<Status>('idle')
    const[time,setTime]=useState(0)
    const[wpm,setWpm]=useState(0)
    const[acc,setAcc]=useState(100)
    const[errors,setErrors]=useState(0)
    const inp=useRef<HTMLInputElement>(null)
    const tRef=useRef<ReturnType<typeof setInterval>|null>(null)
    const target=TEXTS[textIdx]
    const start=()=>{setTyped('');setStatus('running');setTime(0);setWpm(0);setAcc(100);setErrors(0);inp.current?.focus();tRef.current=setInterval(()=>setTime(t=>t+1),1000)}
    const reset=()=>{setTyped('');setStatus('idle');setTime(0);setWpm(0);setAcc(100);setErrors(0);if(tRef.current)clearInterval(tRef.current)}
    const onChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
      if(status!=='running')return
      const val=e.target.value
      setTyped(val)
      const errs=val.split('').filter((c,i)=>c!==target[i]).length
      setErrors(errs)
      const correct=val.split('').filter((c,i)=>c===target[i]).length
      setAcc(val.length?Math.round((correct/val.length)*100):100)
      const mins=time/60||1/60
      setWpm(Math.round((val.length/5)/mins))
      if(val===target){setStatus('done');if(tRef.current)clearInterval(tRef.current)}
    }
    useEffect(()=>()=>{if(tRef.current)clearInterval(tRef.current)},[])
    const chars=target.split('').map((ch,i)=>{
      let color='#64748b'
      if(i<typed.length){color=typed[i]===ch?'#22c55e':'#ef4444'}
      else if(i===typed.length)color='#38bdf8'
      return{ch,color,curr:i===typed.length}
    })
    return(
      <div style={{minHeight:'100vh',background:'#0f172a',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif',color:'#e2e8f0',padding:'2rem'}}>
        <div style={{maxWidth:720,width:'100%'}}>
          <h1 style={{fontWeight:800,fontSize:'1.75rem',marginBottom:'0.5rem',color:'#f8fafc',textAlign:'center'}}>⌨️ Typing Speed Test</h1>
          <p style={{color:'#94a3b8',textAlign:'center',marginBottom:'2rem',fontSize:'0.9rem'}}>Measure your WPM and accuracy</p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',marginBottom:'1.5rem'}}>
            {[{label:'WPM',val:wpm,color:'#38bdf8'},{label:'Accuracy',val:acc+'%',color:'#22c55e'},{label:'Errors',val:errors,color:'#ef4444'},{label:'Time',val:time+'s',color:'#f59e0b'}].map(({label,val,color})=>(
              <div key={label} style={{background:'#1e293b',border:'1px solid #334155',borderRadius:10,padding:'0.75rem 1.25rem',textAlign:'center',minWidth:80}}>
                <div style={{fontSize:'1.5rem',fontWeight:700,color}}>{val}</div>
                <div style={{color:'#94a3b8',fontSize:'0.75rem'}}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{background:'#111827',border:'1px solid #1e293b',borderRadius:12,padding:'1.5rem',marginBottom:'1rem',lineHeight:2}}>
            <p style={{fontFamily:'JetBrains Mono,monospace',fontSize:'1rem',letterSpacing:'0.02em'}}>
              {chars.map(({ch,color,curr},i)=>(
                <span key={i} style={{color,position:'relative'}}>
                  {curr&&<span style={{position:'absolute',left:0,top:0,height:'100%',width:2,background:'#38bdf8',animation:'blink 1s infinite'}}/>}
                  {ch}
                </span>
              ))}
            </p>
          </div>
          <input ref={inp} value={typed} onChange={onChange} disabled={status!=='running'} placeholder={status==='idle'?'Press Start to begin...':''} style={{width:'100%',background:'#111827',border:'1px solid #334155',borderRadius:8,padding:'0.75rem 1rem',color:'#e2e8f0',fontFamily:'JetBrains Mono,monospace',fontSize:'0.9rem',outline:'none',marginBottom:'1rem'}}/>
          {status==='done'&&<div style={{background:'#052e16',border:'1px solid #166534',borderRadius:10,padding:'1rem',marginBottom:'1rem',textAlign:'center',color:'#86efac'}}>🎉 Finished! {wpm} WPM · {acc}% accuracy · {time}s</div>}
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <button onClick={start} style={{padding:'0.7rem 2rem',background:'#0ea5e9',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700}}>{status==='done'?'Try Again':'Start'}</button>
            <button onClick={reset} style={{padding:'0.7rem 1.5rem',background:'#1e293b',color:'#94a3b8',border:'1px solid #334155',borderRadius:8,cursor:'pointer',fontWeight:600}}>Reset</button>
            <select value={textIdx} onChange={e=>{setTextIdx(+e.target.value);reset()}} style={{padding:'0.7rem',background:'#1e293b',color:'#94a3b8',border:'1px solid #334155',borderRadius:8}}>
              {TEXTS.map((_,i)=><option key={i} value={i}>Text {i+1}</option>)}
            </select>
          </div>
        </div>
      </div>
    )
  }