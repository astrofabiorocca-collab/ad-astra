"""Build a lexical search index from acquired captions; do not publish full captions."""
from pathlib import Path
import argparse,json,re,unicodedata
p=argparse.ArgumentParser();p.add_argument('--input',required=True);args=p.parse_args()
folder=Path(args.input);root=Path(__file__).resolve().parents[2]
manifest=json.loads((folder/'trascrizioni-stato.json').read_text(encoding='utf-8-sig'))
raw=(root/'assets/biblioteca/video-indice.js').read_text(encoding='utf-8-sig')
titles=json.JSONDecoder().raw_decode(raw[raw.index('=')+1:].lstrip())[0]
stop=set('a ad al alla alle allo ai agli anche che chi ci cio come con da dal dalla dei del della delle di e ed era essere fa gli ha hanno i il in la le lo ma mi ne nel nella non o per piu puo quale quando questa questo se si sono su sul sulla tra un una uno viene allora quindi abbiamo questo questa quello questa qui cui molto proprio tutti tutte poi perché cioè'.split())
rows=[]
for ident,info in manifest.items():
 if info.get('status')!='acquisita' or ident not in titles:continue
 data=json.loads((folder/'trascrizioni'/(ident+'.json')).read_text(encoding='utf-8-sig'))
 buckets={}
 for segment in data:
  seconds=int(float(segment['start'])//45)*45
  text=unicodedata.normalize('NFD',segment['text'].lower());text=''.join(c for c in text if not unicodedata.combining(c))
  words={w for w in re.findall(r'[^\W_]+',text) if len(w)>2 and w not in stop}
  buckets.setdefault(seconds,set()).update(words)
 for seconds,words in sorted(buckets.items()):
  if not words:continue
  rows.append({'section':titles[ident],'page':'Videoteca','text':' '.join(sorted(words)),'terms':[], 'kind':'trascrizione','href':f'videoteca.html?video={ident}&t={seconds}','id':ident,'seconds':seconds,'language':info.get('language',''),'automatic':info.get('automatic',False)})
destination=root/'assets/biblioteca/trascrizioni-ricerca.json'
destination.write_text(json.dumps(rows,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(json.dumps({'videos':len({r['id'] for r in rows}),'windows':len(rows)}))
