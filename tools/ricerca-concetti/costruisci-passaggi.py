"""Indicizza i passaggi pubblici originali del sito e i titoli video disponibili."""
from pathlib import Path
from html.parser import HTMLParser
import subprocess,json,re
ROOT=Path(__file__).resolve().parents[2]
class Pages(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True);self.stack=[];self.main=0;self.ignored=0;self.capture=None;self.parts=[];self.rows=[];self.heading='';self.anchor='';self.title=''
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag in ['br','img','meta','link','hr','input','source','wbr','area','base','embed']:return
  self.stack.append((tag,attrs))
  if tag=='main':self.main+=1
  if tag in ['script','style','nav','footer']:self.ignored+=1
  if self.ignored:return
  if (tag=='title' and not self.main and not self.title) or self.main and tag in ['p','h2','h3','h4','h5','figcaption']:
   self.capture=(tag,attrs);self.parts=[]
 def handle_data(self,data):
  if self.capture and not self.ignored:self.parts.append(data)
 def handle_endtag(self,tag):
  if self.capture and tag==self.capture[0]:
   kind,attrs=self.capture;text=' '.join(''.join(self.parts).split());self.capture=None
   if kind=='title':self.title=re.sub(r'\s*\| AD ASTRA$','',text)
   elif kind.startswith('h'):
    self.heading=text;self.anchor=attrs.get('id') or next((a.get('id') for t,a in reversed(self.stack) if a.get('id')),'')
   elif 65<=len(text)<=2200 and not re.search(r'(?i)titolo della notizia|data da inserire|archivio da compilare|bozza da revisionare',text):
    self.rows.append({'section':self.heading,'anchor':self.anchor,'text':text,'terms':attrs.get('data-galatea-terms','').split('|') if attrs.get('data-galatea-terms') else []})
  if tag in ['script','style','nav','footer']:self.ignored=max(0,self.ignored-1)
  if tag=='main':self.main=max(0,self.main-1)
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==tag:self.stack=self.stack[:i];break
files=subprocess.check_output(['git','ls-files','*.html'],cwd=ROOT,text=True).splitlines()
rows=[]
for name in files:
 if name=='glossario.html':continue
 page=Pages();page.feed((ROOT/name).read_text(encoding='utf-8-sig'))
 for row in page.rows:
  row['href']=name+('#'+row.pop('anchor') if row['anchor'] else '')
  row['page']=page.title;rows.append(row)
# Repeated passages are kept once per page; no menu/footer/JavaScript is indexed.
seen=set();rows=[r for r in rows if not ((r['href'],r['text']) in seen or seen.add((r['href'],r['text'])))]
raw=(ROOT/'assets/biblioteca/video-indice.js').read_text(encoding='utf-8-sig')
titles=json.JSONDecoder().raw_decode(raw[raw.index('=')+1:].lstrip())[0]
videos=[{'id':k,'title':v,'href':'videoteca.html?video='+k} for k,v in titles.items() if re.fullmatch(r'[A-Za-z0-9_-]{11}',k)]
data={'version':'20261124-passaggi','pages':len(files)-1,'passages':rows,'videos':videos}
out=ROOT/'assets/galatea/contenuti-sito.js'
out.write_text('/* Generato da costruisci-passaggi.py: testi AD ASTRA e metadati video, non trascrizioni. */\nwindow.AdAstraSitePassages='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print(json.dumps({'pages':data['pages'],'passages':len(rows),'videos':len(videos),'bytes':out.stat().st_size}))
