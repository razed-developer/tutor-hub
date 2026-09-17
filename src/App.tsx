import { ChangeEvent, DragEvent, FormEvent, useEffect, useState } from 'react'

type ItemType='game'|'tool'|'link'
type HubItem={id:string;name:string;url:string;image:string;type:ItemType;enabled:boolean;sortOrder:number}
type Draft={id?:string;name:string;url:string;image:string;type:ItemType;enabled:boolean;sortOrder:number}
type HubView='game'|'tool'

const emptyDraft:Draft={name:'',url:'',image:'',type:'game',enabled:true,sortOrder:0}
const fallbackItems:HubItem[]=[{id:'cat-burglar',name:'C-A-T Burglar',url:'#',image:'',type:'game',enabled:true,sortOrder:1}]
const appearsIn=(type:ItemType,view:HubView)=>type==='link'||type===view
const placementLabel=(type:ItemType)=>type==='link'?'Games + Tools':type==='game'?'Games':'Tools'
const setPlacement=(draft:Draft,place:HubView,checked:boolean):Draft=>{
 const games=draft.type==='game'||draft.type==='link',tools=draft.type==='tool'||draft.type==='link'
 const nextGames=place==='game'?checked:games,nextTools=place==='tool'?checked:tools
 if(!nextGames&&!nextTools)return draft
 return {...draft,type:nextGames&&nextTools?'link':nextGames?'game':'tool'}
}

function PublicHub(){
 const[items,setItems]=useState<HubItem[]>(fallbackItems)
 const[view,setView]=useState<HubView>('game')
 useEffect(()=>{fetch('/api/items').then(r=>r.ok?r.json():Promise.reject()).then(setItems).catch(()=>undefined)},[])
 const visible=items.filter(i=>i.enabled&&appearsIn(i.type,view)).sort((a,b)=>a.sortOrder-b.sortOrder)
 return <main className="hub-shell"><div className="geo geo-one"/><div className="geo geo-two"/><div className="geo geo-three"/><div className="geo geo-four"/><div className="dot-field dots-left"/><div className="dot-field dots-right"/><section className="hub"><header className="hub-header"><div className="compass" aria-hidden="true">✦</div><h1>TUTOR HUB</h1><p>LEARN <b>✦</b> EXPLORE <b>✦</b> PLAY <b>✦</b> GROW</p></header><nav className="hub-switch" aria-label="Choose games or tools"><button className={view==='game'?'active':''} onClick={()=>setView('game')}><span aria-hidden="true">♟</span> Games</button><button className={view==='tool'?'active':''} onClick={()=>setView('tool')}><span aria-hidden="true">◆</span> Tools</button></nav><section className="card-grid" aria-label={view==='game'?'Games':'Tools'}>{visible.map(item=><a className="hub-card" key={item.id} href={item.url} target={item.url.startsWith('http')?'_blank':undefined} rel="noreferrer">{item.image?<img src={item.image} alt=""/>:<div className="card-placeholder" aria-hidden="true">{item.name.slice(0,1)}</div>}<span>{item.name}</span></a>)}</section>{!visible.length&&<p className="empty-state">No {view==='game'?'games':'tools'} here yet.</p>}<footer className="hub-footer"><span/>EVERY EXPERT WAS ONCE A <strong>BEGINNER</strong><span/></footer></section></main>
}

function Admin(){
 const[items,setItems]=useState<HubItem[]>([]),[draft,setDraft]=useState<Draft>(emptyDraft),[busy,setBusy]=useState(false),[message,setMessage]=useState('')
 const load=()=>fetch('/admin/api/items').then(r=>{if(!r.ok)throw new Error('Could not load catalogue');return r.json()}).then(setItems).catch(e=>setMessage(e.message))
 useEffect(()=>{load()},[])
 const upload=async(file:File)=>{setBusy(true);setMessage('Uploading image…');try{const form=new FormData();form.append('image',file);const r=await fetch('/admin/api/images',{method:'POST',body:form});const data=await r.json();if(!r.ok)throw new Error(data.error||'Upload failed');setDraft(d=>({...d,image:data.url}));setMessage('Image ready.')}catch(e){setMessage(e instanceof Error?e.message:'Upload failed')}finally{setBusy(false)}}
 const choose=(e:ChangeEvent<HTMLInputElement>)=>{const file=e.target.files?.[0];if(file)void upload(file)}
 const drop=(e:DragEvent<HTMLLabelElement>)=>{e.preventDefault();const file=e.dataTransfer.files?.[0];if(file)void upload(file)}
 const save=async(e:FormEvent)=>{e.preventDefault();setBusy(true);setMessage('Saving…');try{const r=await fetch('/admin/api/items',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...draft,id:draft.id?Number(draft.id):undefined})});const data=await r.json();if(!r.ok)throw new Error(data.error||'Save failed');setDraft(emptyDraft);setMessage('Saved.');await load()}catch(e){setMessage(e instanceof Error?e.message:'Save failed')}finally{setBusy(false)}}
 const edit=(item:HubItem)=>{setDraft({...item});window.scrollTo({top:0,behavior:'smooth'})}
 const remove=async(item:HubItem)=>{if(!confirm(`Delete ${item.name}?`))return;setBusy(true);try{const r=await fetch(`/admin/api/items?id=${encodeURIComponent(item.id)}`,{method:'DELETE'});if(!r.ok)throw new Error('Delete failed');if(draft.id===item.id)setDraft(emptyDraft);await load()}catch(e){setMessage(e instanceof Error?e.message:'Delete failed')}finally{setBusy(false)}}
 const inGames=draft.type==='game'||draft.type==='link',inTools=draft.type==='tool'||draft.type==='link'
 return <main className="admin"><header className="admin-header"><div><p>TUTOR HUB</p><h1>Catalogue</h1></div><a href="/">View site</a></header><form className="admin-form" onSubmit={save}><div className="form-fields"><label>Name<input value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})} required/></label><label>Destination URL<input value={draft.url} onChange={e=>setDraft({...draft,url:e.target.value})} placeholder="https://…" required/></label><div className="form-row"><fieldset><legend>Appears in</legend><label className="check"><input type="checkbox" checked={inGames} onChange={e=>setDraft(setPlacement(draft,'game',e.target.checked))}/> Games</label><label className="check"><input type="checkbox" checked={inTools} onChange={e=>setDraft(setPlacement(draft,'tool',e.target.checked))}/> Tools</label></fieldset><label>Display order<input type="number" value={draft.sortOrder} onChange={e=>setDraft({...draft,sortOrder:Number(e.target.value)})}/></label></div><label className="check"><input type="checkbox" checked={draft.enabled} onChange={e=>setDraft({...draft,enabled:e.target.checked})}/> Enabled</label></div><label className="image-drop" onDragOver={e=>e.preventDefault()} onDrop={drop}>{draft.image?<img src={draft.image} alt="Card preview"/>:<div><strong>Drop an image here</strong><span>or click to choose</span><small>JPG, PNG, WebP or GIF · max 8 MB</small></div>}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={choose} disabled={busy}/></label><div className="form-actions"><button type="submit" disabled={busy}>{draft.id?'Save changes':'Add item'}</button>{draft.id&&<button type="button" className="secondary" onClick={()=>setDraft(emptyDraft)}>Cancel edit</button>}<span>{message}</span></div></form><section className="admin-list"><h2>Items</h2>{items.map(item=><article className="admin-item" key={item.id}>{item.image?<img src={item.image} alt=""/>:<div className="admin-thumb">{item.name.slice(0,1)}</div>}<div className="admin-item-info"><strong>{item.name}</strong><span>{placementLabel(item.type)} · order {item.sortOrder}{!item.enabled?' · hidden':''}</span></div><button onClick={()=>edit(item)}>Edit</button><button className="danger" onClick={()=>void remove(item)}>Delete</button></article>)}{!items.length&&<p className="empty-state">No catalogue items yet.</p>}</section></main>
}

export default function App(){return location.pathname.startsWith('/admin')?<Admin/>:<PublicHub/>}
