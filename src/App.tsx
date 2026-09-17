import { useEffect, useState } from 'react'

type HubItem={id:string;name:string;url:string;image:string;type:'game'|'tool'|'link';enabled:boolean;sortOrder:number}

const fallbackItems:HubItem[]=[
 {id:'cat-burglar',name:'C-A-T Burglar',url:'#',image:'',type:'game',enabled:true,sortOrder:1},
]

export default function App(){
 const[items,setItems]=useState<HubItem[]>(fallbackItems)
 useEffect(()=>{fetch('/api/items').then(response=>response.ok?response.json():Promise.reject()).then((data:HubItem[])=>setItems(data)).catch(()=>undefined)},[])
 const visible=items.filter(item=>item.enabled).sort((a,b)=>a.sortOrder-b.sortOrder)
 return <main className="hub"><header className="hub-header"><h1>Games & Tools</h1></header><section className="card-grid" aria-label="Games and tools">{visible.map(item=><a className="hub-card" key={item.id} href={item.url} target={item.url.startsWith('http')?'_blank':undefined} rel="noreferrer">{item.image?<img src={item.image} alt=""/>:<div className="card-placeholder" aria-hidden="true">{item.name.slice(0,1)}</div>}<span>{item.name}</span></a>)}</section>{!visible.length&&<p className="empty-state">Nothing here yet.</p>}</main>
}
