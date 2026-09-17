(() => {
  const $ = id => document.getElementById(id);
  const table=$('multiplication-table'), input=$('equation'), result=$('result'), drawer=$('drawer');
  let size=12;
  const state={primes:false,squares:false,symmetry:false,parity:false,multiple:0,practice:false};
  const isPrime=n=>{if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true};
  const cell=(r,c)=>table.querySelector(`td[data-row="${r}"][data-col="${c}"]`);

  function build(){
    table.innerHTML='';
    const head=document.createElement('thead'), hr=document.createElement('tr'), corner=document.createElement('th');corner.className='corner';corner.textContent='×';hr.append(corner);
    for(let c=1;c<=size;c++){const th=document.createElement('th');th.textContent=c;th.dataset.colHead=c;hr.append(th)}head.append(hr);table.append(head);
    const body=document.createElement('tbody');
    for(let r=1;r<=size;r++){const tr=document.createElement('tr'),th=document.createElement('th');th.textContent=r;th.dataset.rowHead=r;tr.append(th);for(let c=1;c<=size;c++){const td=document.createElement('td');td.textContent=r*c;td.dataset.row=r;td.dataset.col=c;td.dataset.value=r*c;td.tabIndex=0;td.setAttribute('aria-label',`${r} times ${c} equals ${r*c}`);tr.append(td)}body.append(tr)}table.append(body);
    bindCells();applyModes();evaluate();
  }
  function bindCells(){table.querySelectorAll('td').forEach(td=>{td.addEventListener('mouseenter',()=>hover(td));td.addEventListener('mouseleave',clearHover);td.addEventListener('click',()=>tap(td));td.addEventListener('focus',()=>hover(td));td.addEventListener('blur',clearHover);td.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tap(td)}})})}
  function hover(td){clearHover();const r=td.dataset.row,c=td.dataset.col;table.querySelectorAll(`td[data-row="${r}"]`).forEach(x=>x.classList.add('hover-row'));table.querySelectorAll(`td[data-col="${c}"]`).forEach(x=>x.classList.add('hover-col'));table.querySelector(`[data-row-head="${r}"]`)?.classList.add('hover-head');table.querySelector(`[data-col-head="${c}"]`)?.classList.add('hover-head')}
  function clearHover(){table.querySelectorAll('.hover-row,.hover-col,.hover-head').forEach(x=>x.classList.remove('hover-row','hover-col','hover-head'))}
  function tap(td){if(state.practice){td.classList.toggle('revealed');result.textContent=td.classList.contains('revealed')?`${td.dataset.row} × ${td.dataset.col} = ${td.dataset.value}`:'Answer hidden again.'}else{input.value=`${td.dataset.row}×${td.dataset.col}=`;evaluate();input.focus()}}
  function clearTargets(){table.querySelectorAll('.target,.target-secondary').forEach(x=>x.classList.remove('target','target-secondary'))}
  function markPair(a,b,cls='target'){cell(a,b)?.classList.add(cls);if(a!==b)cell(b,a)?.classList.add(cls)}
  function normalize(v){return v.replace(/\s/g,'').replace(/[xX*]/g,'×').replace(/\//g,'÷')}
  function evaluate(){clearTargets();const q=normalize(input.value);if(!q){result.textContent='Hover or tap a square to explore the table.';return}
    let m;
    if((m=q.match(/^(\d+)×(\d+)=?$/))){const a=+m[1],b=+m[2],p=a*b;markPair(a,b);result.textContent=`${a} × ${b} = ${p}. The mirrored square shows ${b} × ${a} = ${p}.`;return}
    if((m=q.match(/^=(\d+)$/))){const n=+m[1],pairs=[];for(let a=1;a<=size;a++)if(n%a===0&&n/a<=size){markPair(a,n/a);if(a<=n/a)pairs.push(`${a}×${n/a}`)}result.textContent=pairs.length?`${n} can be made by ${pairs.join(', ')}.`:`No factor pairs for ${n} fit in this table.`;return}
    if((m=q.match(/^(\d+)÷(\d+)=?$/))){const n=+m[1],d=+m[2];if(d===0){result.textContent='Division by zero is not defined.';return}if(n%d!==0){result.textContent=`${n} ÷ ${d} is not a whole-number fact.`;return}const answer=n/d;markPair(d,answer);result.textContent=`${n} ÷ ${d} = ${answer}, because ${d} × ${answer} = ${n}.`;return}
    if((m=q.match(/^(\d+)×\?=(\d+)$/))||(m=q.match(/^\?×(\d+)=(\d+)$/))){const known=+m[1],total=+m[2];if(known&&total%known===0){const answer=total/known;markPair(known,answer);result.textContent=`The missing number is ${answer}: ${known} × ${answer} = ${total}.`}else result.textContent='That equation does not have a whole-number answer.';return}
    if((m=q.match(/^(\d+)÷\?=(\d+)$/))){const total=+m[1],answer=+m[2];if(answer&&total%answer===0){const divisor=total/answer;markPair(divisor,answer);result.textContent=`The missing divisor is ${divisor}: ${total} ÷ ${divisor} = ${answer}.`}else result.textContent='That equation does not have a whole-number answer.';return}
    if((m=q.match(/^(\d+)÷(\d+)=\?$/))){const total=+m[1],divisor=+m[2];if(divisor&&total%divisor===0){const answer=total/divisor;markPair(divisor,answer);result.textContent=`The missing number is ${answer}.`}else result.textContent='That equation does not have a whole-number answer.';return}
    result.textContent='Try something like 5×4=, =20, 20÷5=, or 5×?=20.';
  }
  function applyModes(){table.classList.toggle('practice',state.practice);table.querySelectorAll('td').forEach(td=>{const r=+td.dataset.row,c=+td.dataset.col,v=+td.dataset.value;td.classList.toggle('prime',state.primes&&isPrime(v));td.classList.toggle('square',state.squares&&r===c);td.classList.toggle('symmetry',state.symmetry&&r!==c);td.classList.toggle('symmetry-line',state.symmetry&&r===c);td.classList.toggle('even',state.parity&&v%2===0);td.classList.toggle('odd',state.parity&&v%2!==0);td.classList.toggle('multiple',state.multiple>0&&v%state.multiple===0);if(!state.practice)td.classList.remove('revealed')})}
  function setDrawer(open){drawer.classList.toggle('open',open);drawer.setAttribute('aria-hidden',String(!open));$('drawerButton').setAttribute('aria-expanded',String(open))}
  $('drawerButton').addEventListener('click',()=>setDrawer(!drawer.classList.contains('open')));$('closeDrawer').addEventListener('click',()=>setDrawer(false));
  input.addEventListener('input',evaluate);input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();evaluate()}if(e.key==='Escape'){input.value='';evaluate()}});$('clearEquation').addEventListener('click',()=>{input.value='';evaluate();input.focus()});
  const keypad=$('keypad'),keys=['7','8','9','×','4','5','6','÷','1','2','3','=','0','?','⌫','C'];keys.forEach(k=>{const b=document.createElement('button');b.type='button';b.textContent=k;b.className='×÷='.includes(k)?'operator':(k==='⌫'||k==='C'?'action':'');b.addEventListener('click',()=>{if(k==='C')input.value='';else if(k==='⌫')input.value=input.value.slice(0,-1);else input.value+=k;evaluate();input.focus()});keypad.append(b)});$('keyboardButton').addEventListener('click',()=>{const show=keypad.hidden;keypad.hidden=!show;$('keyboardButton').setAttribute('aria-expanded',String(show))});
  const toggles=[['primesToggle','primes'],['squaresToggle','squares'],['symmetryToggle','symmetry'],['parityToggle','parity'],['practiceToggle','practice']];toggles.forEach(([id,key])=>$(id).addEventListener('change',e=>{state[key]=e.target.checked;applyModes()}));
  for(let n=1;n<=20;n++){const o=document.createElement('option');o.value=n;o.textContent=`${n} times table`; $('multipleSelect').append(o)}$('multipleSelect').addEventListener('change',e=>{state.multiple=+e.target.value;applyModes();result.textContent=state.multiple?`Highlighting multiples of ${state.multiple}.`:'Multiples highlight cleared.'});
  $('rangeSelect').addEventListener('change',e=>{size=+e.target.value;build()});$('resetTools').addEventListener('click',()=>{Object.assign(state,{primes:false,squares:false,symmetry:false,parity:false,multiple:0,practice:false});toggles.forEach(([id])=>$(id).checked=false);$('multipleSelect').value='';$('rangeSelect').value='12';size=12;build()});
  build();
})();
