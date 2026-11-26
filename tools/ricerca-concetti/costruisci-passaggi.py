"""Corpus comune: pagine, glossario, schede, argomenti dei poster e lessico dei sottotitoli."""
from pathlib import Path
from html.parser import HTMLParser
import subprocess,json,re,hashlib
ROOT=Path(__file__).resolve().parents[2]
class Pages(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True);self.stack=[];self.main=0;self.ignored=0;self.capture=None;self.parts=[];self.rows=[];self.heading='';self.anchor='';self.title='';self.metadata={}
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=='meta':self.metadata[attrs.get('name',attrs.get('property',''))]=attrs.get('content','')
  if tag in ['br','img','meta','link','hr','input','source','wbr','area','base','embed']:return
  self.stack.append((tag,attrs))
  if tag=='main':self.main+=1
  if tag in ['script','style','nav','footer']:self.ignored+=1
  if self.ignored:return
  if (tag=='title' and not self.main and not self.title) or self.main and (tag in ['p','h1','h2','h3','h4','h5','figcaption','li','dt','dd','tr'] or tag=='div' and attrs.get('class') in ['software-meta-row','modal-data-row','software-category','software-name']):
   self.capture=(tag,attrs);self.parts=[]
 def handle_data(self,data):
  if self.capture and not self.ignored:self.parts.append(data)
 def handle_endtag(self,tag):
  if self.capture and tag==self.capture[0]:
   kind,attrs=self.capture;text=' '.join(''.join(self.parts).split());self.capture=None
   if kind=='title':self.title=re.sub(r'\s*\| AD ASTRA$','',text)
   elif kind.startswith('h'):
    self.heading=text;self.anchor=attrs.get('id') or next((a.get('id') for t,a in reversed(self.stack) if a.get('id')),'')
   elif 25<=len(text)<=5000 and not re.search(r'(?i)titolo della notizia|data da inserire|archivio da compilare|bozza da revisionare',text):
    self.rows.append({'section':self.heading,'anchor':attrs.get('id') or self.anchor or next((a.get('id') for t,a in reversed(self.stack) if a.get('id')),''),'text':text,'terms':attrs.get('data-galatea-terms','').split('|') if attrs.get('data-galatea-terms') else []})
  if tag in ['script','style','nav','footer']:self.ignored=max(0,self.ignored-1)
  if tag=='main':self.main=max(0,self.main-1)
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==tag:self.stack=self.stack[:i];break
files=[name for name in subprocess.check_output(['git','ls-files','*.html'],cwd=ROOT,text=True).splitlines() if not Path(name).name.startswith('provino-')]
# Include nuove notizie approvate nell'anteprima prima del commit, senza indicizzare
# bozze private o file temporanei. In produzione sono già file versionati.
for candidate in sorted(ROOT.glob('notizia-*.html')):
 if candidate.name not in files:
  probe=Pages();probe.feed(candidate.read_text(encoding='utf-8-sig'))
  if probe.metadata.get('ad-astra-editorial-status')=='approved':files.append(candidate.name)
rows=[];article_sources=set();excluded_articles=0
for name in files:
 if name in ['glossario.html','poster-imparare-il-cielo.html','poster-universo.html','poster-sistema-solare.html','poster-strumenti.html']:continue
 page=Pages();page.feed((ROOT/name).read_text(encoding='utf-8-sig'))
 if page.metadata.get('ad-astra-editorial-status','').lower() in ['draft','bozza','inedito','in revisione']:continue
 kind=page.metadata.get('ad-astra-content-type')
 if kind not in ['articolo','notizia']:
  kind='notizia' if name.startswith(('notizia-','notizie/')) else 'articolo' if name.startswith(('articolo-','articoli/')) or page.metadata.get('og:type')=='article' else 'lezione' if name.startswith('lezione-') else 'pagina'
 for row in page.rows:
  row['href']=name+('#'+row.pop('anchor') if row['anchor'] else '')
  row['page']=page.title;row['kind']=kind;rows.append(row)
# Textual articles in the existing reader are public only with explicit editorial status.
for name in files:
 source=(ROOT/name).read_text(encoding='utf-8-sig')
 for script in re.findall(r'<script[^>]+src=["\']([^"\']*articoli\.js)(?:\?[^"\']*)?["\']',source):
  from urllib.parse import urljoin,urlparse
  resolved=urlparse(urljoin('https://local/'+name,script))
  if resolved.netloc!='local':continue
  filename=resolved.path.lstrip('/');path=ROOT/filename
  if filename in article_sources or not path.is_file():continue
  raw=path.read_text(encoding='utf-8-sig')
  if not re.match(r'\s*window\.AdAstraPublicationPreview\s*=',raw):continue
  article_sources.add(filename)
  articles=json.JSONDecoder().raw_decode(raw[raw.index('=')+1:].lstrip())[0]
  for article in articles:
   if article.get('demo') or article.get('status') not in ['pubblicato','published']:
    excluded_articles+=1;continue
   from urllib.parse import quote
   href=name+'?articolo='+quote(article['id'])+'#pub-reader'
   parts=[article.get('intro',''),article.get('summary','')]
   for section in article.get('sections',[]):parts.extend(section.get('paragraphs',[]))
   for text in parts:
    if text.strip():rows.append({'section':article['title'],'page':'Articoli AD ASTRA','text':text,'terms':[],'href':href,'kind':'articolo'})
# Dynamic software cards are public HTML templates, not arbitrary executable scripts.
software=(ROOT/'software.html').read_text(encoding='utf-8-sig')
apps=re.findall(r'(\w+):\s*\{\s*icon:\s*"[^"]*",\s*title:\s*"([^"]*)",\s*subtitle:\s*"([^"]*)",\s*content:\s*`(.*?)`',software,re.S)
assert len(apps)==9, 'Software schema changed: update the extractor before rebuilding'
for ident,title,subtitle,content in apps:
 parser=Pages();parser.feed('<main><h2>'+title+'</h2>'+content+'</main>')
 for item in parser.rows:
  item.pop('anchor',None);item.update(section=title+' · '+subtitle,page='Software',href='software.html?software='+ident,kind='software',terms=[title,ident])
  rows.append(item)
# Poster descriptions and reviewed textual supplements are kept distinct from full OCR.
catalog=json.loads((ROOT/'assets/poster/revisioni-20261023/catalogo.json').read_text(encoding='utf-8-sig'))
poster_text_path=ROOT/'assets/poster/testi-ricerca.json'
poster_text=json.loads(poster_text_path.read_text(encoding='utf-8')) if poster_text_path.exists() else {}
for poster in catalog['posters']:
 ident=poster['id'];area=ident[:2];name={'IC':'poster-imparare-il-cielo.html','UN':'poster-universo.html','SS':'poster-sistema-solare.html','SA':'poster-strumenti.html'}[area]
 source=(ROOT/name).read_text(encoding='utf-8-sig')
 description=''
 for attrs in re.findall(r'<button\b([^>]*data-poster-src[^>]*)>',source,re.S):
  if ident+'.png' in attrs:
   from html import unescape
   m=re.search(r'data-poster-description="([^"]*)"',attrs);description=unescape(m[1]) if m else ''
 supplement=poster_text.get(ident,{})
 rows.append({'section':poster['title'],'text':description or poster['title'],'terms':[poster['title']], 'page':'Poster · '+area,'href':name+'?tavola='+ident,'kind':'poster','coverage':'scheda'})
 if supplement.get('text'):
  import hashlib
  assert supplement['imageSha256']==hashlib.sha256((ROOT/poster['png']).read_bytes()).hexdigest(), 'Poster changed: review thematic index '+ident
  rows.append({'section':poster['title'],'text':supplement['text'],'terms':supplement.get('terms',[]),'page':'Poster · '+area,'href':name+'?tavola='+ident,'kind':'poster','coverage':'argomenti verificati'})
# Glossary text and aliases become searchable without treating it as an external source.
def assignment(name):
 raw=(ROOT/name).read_text(encoding='utf-8-sig');return json.JSONDecoder().raw_decode(raw[raw.index('=')+1:].lstrip())[0]
glossary=assignment('assets/scuola-attiva/glossario-dati.js')
concepts=[]
for entry in glossary:
 concepts.append({k:entry.get(k,[]) for k in ['id','name','aliases','related']})
 texts=[entry['definition'],*entry.get('facts',[])]
 for section in entry.get('sections',[]):texts.extend(section.get('paragraphs',[]))
 for i,text in enumerate(texts):
  rows.append({'section':entry['name'],'text':text,'terms':[entry['name'],*entry.get('aliases',[])] if i==0 else [],'page':'Glossario','href':'glossario.html#'+entry['id'],'kind':'glossario','concept':entry['id']})
# Repeated passages are kept once per page; no menu/footer/JavaScript is indexed.
seen=set();rows=[r for r in rows if not ((r['href'],r['text']) in seen or seen.add((r['href'],r['text'])))]
raw=(ROOT/'assets/biblioteca/video-indice.js').read_text(encoding='utf-8-sig')
titles=json.JSONDecoder().raw_decode(raw[raw.index('=')+1:].lstrip())[0]
videos=[{'id':k,'title':v,'href':'videoteca.html?video='+k} for k,v in titles.items() if re.fullmatch(r'[A-Za-z0-9_-]{11}',k)]
transcripts_path=ROOT/'assets/biblioteca/trascrizioni-ricerca.json'
transcripts=json.loads(transcripts_path.read_text(encoding='utf-8')) if transcripts_path.exists() else []
rows.extend(transcripts)
dependencies=[*files,*sorted(article_sources),'assets/scuola-attiva/glossario-dati.js','assets/biblioteca/video-indice.js','assets/biblioteca/trascrizioni-ricerca.json','assets/poster/revisioni-20261023/catalogo.json','assets/poster/testi-ricerca.json','tools/ricerca-concetti/costruisci-passaggi.py']
# Text sources have identical fingerprints on Windows and the publishing checkout.
sources={name:hashlib.sha256((ROOT/name).read_text(encoding='utf-8-sig').replace('\r\n','\n').encode('utf-8')).hexdigest() for name in dependencies}
data={'version':'20261125-corpus','pages':len(files),'passages':rows,'videos':videos,'concepts':concepts,'sources':sources,'excludedArticleDrafts':excluded_articles}
out=ROOT/'assets/galatea/contenuti-sito.js'
out.write_text('/* Generato da costruisci-passaggi.py: testi AD ASTRA, argomenti dei poster, metadati e lessico dei sottotitoli; non ripubblica le trascrizioni. */\nwindow.AdAstraSitePassages='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print(json.dumps({'pages':data['pages'],'passages':len(rows),'videos':len(videos),'bytes':out.stat().st_size}))
