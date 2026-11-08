from pathlib import Path
import json, math, html
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
import pypdfium2 as pdfium

BASE=Path(__file__).resolve().parent
ROOT=BASE.parents[1]
OUT=ROOT/'assets/provino-pubblicazioni-20261108'
OUT.mkdir(parents=True,exist_ok=True)
ARTICLES=json.loads((BASE/'articoli.json').read_text(encoding='utf8'))
for name,file in [('Serif','georgia.ttf'),('SerifBold','georgiab.ttf'),('SerifItalic','georgiai.ttf'),('Sans','arial.ttf'),('SansBold','arialbd.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(Path('C:/Windows/Fonts')/file)))
W,H=595.276,841.89
INK=HexColor('#122d43'); GOLD=HexColor('#9c783f'); PAPER=HexColor('#fbf8f0'); MUTED=HexColor('#53616a')
METRICS=[]
def text(c,value,x,top,width,size=10.3,leading=None,font='Serif',color=INK,maxh=None):
    st=ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.43,textColor=color,spaceAfter=0,allowWidows=0,allowOrphans=0)
    para=Paragraph(value,st)
    _,height=para.wrap(width,2000)
    if maxh is not None and height>maxh+0.5:raise ValueError(f'Testo troppo alto: {value[:60]} {height} > {maxh}')
    if top-height<48:raise ValueError(f'Testo vicino al piede: {value[:50]}')
    para.drawOn(c,x,top-height)
    METRICS.append({'page':c.getPageNumber(),'top':round(top,2),'bottom':round(top-height,2),'font':size})
    return top-height
def line(c,x1,y,x2,color=GOLD,width=.5):
    c.setStrokeColor(color);c.setLineWidth(width);c.line(x1,y,x2,y)
def shell(c,a,page,count):
    c.setFillColor(PAPER);c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFillColor(INK);c.setFont('SansBold',8.1);c.drawString(40,807,'AD ASTRA  /  PUBBLICAZIONI')
    c.setFont('Sans',7.1);c.setFillColor(MUTED);c.drawRightString(W-40,807,'ARTICOLO CAMPIONE · ANTEPRIMA EDITORIALE')
    line(c,40,793,W-40)
    line(c,40,47,W-40,color=HexColor('#d2c7b1'))
    c.setFont('Sans',6.6);c.setFillColor(MUTED);c.drawString(40,32,'Testo dimostrativo AD ASTRA · impaginazione da valutare')
    c.setFont('SansBold',8);c.drawRightString(W-40,31,f'{page:02d} / {count:02d}')
def image(c,file,x,y,w,h,contain=False):
    reader=ImageReader(str(ROOT/file));iw,ih=reader.getSize();scale=min(w/iw,h/ih) if contain else max(w/iw,h/ih)
    c.saveState();p=c.beginPath();p.rect(x,y,w,h);c.clipPath(p,stroke=0)
    c.setFillColor(HexColor('#07121c'));c.rect(x,y,w,h,fill=1,stroke=0)
    c.drawImage(reader,x+(w-iw*scale)/2,y+(h-ih*scale)/2,iw*scale,ih*scale,mask='auto')
    c.restoreState()
def quote(c,value,x,top,width,size=18):
    line(c,x,top+10,x+34,width=1.5)
    return text(c,html.escape(value),x,top-3,width,size,font='SerifItalic',color=GOLD)
def notes(c,a,x,top,width):
    text(c,'LE PAROLE PER CAPIRE',x,top,width,7.7,font='SansBold',color=GOLD)
    y=top-28
    for title,body in a['notes']:
        y=text(c,html.escape(title),x,y,width,10.1,font='SansBold')-7
        y=text(c,html.escape(body),x,y,width,9.1,font='Sans',color=MUTED)-23
    return y
def body(c,paras,x,top,width,size=10.5):
    y=top
    for value in paras:y=text(c,html.escape(value),x,y,width,size)-13
    return y
def sources(c,a,top=145):
    text(c,'FONTI, IMMAGINI E APPROFONDIMENTI',40,top,515,7.6,font='SansBold',color=GOLD)
    y=top-20
    for label,url in a['sources']:
        y=text(c,f'<link href="{html.escape(url,quote=True)}" color="#244e67">{html.escape(label)}</link>',40,y,515,8,font='Sans')-7
    y=text(c,html.escape(a['credit']),40,y-2,515,6.8,font='Sans',color=MUTED)-5
    if a.get('secondaryCredit'):text(c,html.escape(a['secondaryCredit']),40,y,515,6.8,font='Sans',color=MUTED)
def label(c,value,x,top,width):
    c.setFillColor(HexColor('#f1ce57'));c.rect(x,top-23,width,25,fill=1,stroke=0)
    return text(c,html.escape(value),x+7,top-3,width-14,12.5,leading=16,font='SansBold',maxh=22)

def cover(c,a,count):
    shell(c,a,1,count)
    image(c,a['hero'],0,365,W,477,contain=a['id']=='viaggiare-gravita')
    c.saveState();c.setFillColor(INK);c.setFillAlpha(.82);c.rect(0,365,W*.69,477,fill=1,stroke=0);c.restoreState()
    text(c,'AD ASTRA',30,815,350,21,font='SerifBold',color=PAPER)
    text(c,'RACCONTARE MONDI · '+a['category'],31,786,390,8,font='SansBold',color=HexColor('#f1ce57'))
    text(c,'MONOGRAFIA CAMPIONE',380,813,190,7.4,font='SansBold',color=PAPER)
    bottom=text(c,html.escape(a['title']),30,745,345,42,leading=46,font='SansBold',color=PAPER,maxh=145)
    bottom=text(c,html.escape(a['subtitle']),31,bottom-15,313,19,leading=23,font='SansBold',color=HexColor('#f1ce57'),maxh=80)
    text(c,html.escape(a['summary']),31,bottom-22,290,11.3,leading=15.1,font='Sans',color=PAPER,maxh=130)
    text(c,'di '+html.escape(a['author']),31,408,330,11,font='SansBold',color=PAPER)
    text(c,'Nome e testo dimostrativi · anteprima editoriale',31,389,330,7.2,font='Sans',color=PAPER)
    label(c,'Da dove comincia il racconto',30,342,535)
    end=text(c,html.escape(a['intro']),30,299,254,11,leading=15.1,maxh=220)
    text(c,html.escape(a['sections'][0]['paragraphs'][0]),310,299,254,10.8,leading=14.8,maxh=220)
    line(c,298,74,298,color=HexColor('#c3cccf')) if False else None
    c.setStrokeColor(HexColor('#c3cccf'));c.setLineWidth(.5);c.line(297,78,297,299)
    c.showPage()

def second(c,a,count):
    shell(c,a,2,count);sec=a['sections'][0]
    label(c,sec['title'],30,766,535)
    body(c,sec['paragraphs'][1:],30,715,255,10.8)
    photo=a.get('secondary') or a['hero']
    image(c,photo,310,507,255,205,contain=True)
    credit=a.get('secondaryCredit') or a['credit']
    text(c,html.escape(credit),310,496,255,7,leading=9,maxh=50)
    c.setFillColor(HexColor('#eee7d7'));c.rect(310,190,255,235,fill=1,stroke=0)
    text(c,'IN BREVE',323,409,225,12,font='SansBold')
    y=382
    for title,paragraph in a['notes']:
        y=text(c,html.escape(title),323,y,225,9.3,font='SansBold')-5
        y=text(c,html.escape(paragraph),323,y,225,8.8,font='Sans',color=MUTED)-14
    quote(c,a['quote'],30,300,255,15)
    if count==2:sources(c,a,153)
    else:text(c,'Continua nelle pagine successive: immagini, indizi e domande per approfondire.',30,135,255,10.1,font='Sans',color=MUTED,maxh=60)
    c.showPage()

def third(c,a):
    shell(c,a,3,4);sec=a['sections'][1]
    label(c,sec['title'],30,766,535)
    image(c,a['secondary'],30,400,535,320,contain=True)
    text(c,html.escape(a['secondaryCredit']),30,389,535,7.1,leading=9,maxh=35)
    for i,p in enumerate(sec['paragraphs']):text(c,html.escape(p),30+i*280,343,255,10.7,leading=14.8,maxh=200)
    c.setFillColor(INK);c.rect(30,75,535,58,fill=1,stroke=0)
    text(c,'Le strutture del disco sono indizi da interpretare, non un elenco di pianeti già identificati.',43,119,508,13.5,leading=18,font='SerifItalic',color=PAPER,maxh=45)
    c.showPage()

def fourth(c,a):
    shell(c,a,4,4);sec=a['sections'][2]
    label(c,'Vedere gli indizi, ricostruire la storia',30,766,535)
    body(c,sec['paragraphs'],30,715,255,10.8)
    image(c,a['hero'],310,495,255,215)
    text(c,html.escape(a['credit']),310,484,255,7,leading=9,maxh=50)
    c.setFillColor(HexColor('#eee7d7'));c.rect(310,226,255,200,fill=1,stroke=0)
    text(c,'TRE DOMANDE DA PORTARE CON SÉ',323,409,229,9.5,font='SansBold')
    y=377
    for title,paragraph in [('Che cosa emette?','Individua la componente che produce il segnale osservato.'),('Che cosa nasconde?','Cerca il ruolo della polvere e della banda utilizzata.'),('Che cosa ricostruiamo?','Distingui la misura dalle ipotesi necessarie a interpretarla.')]:
        y=text(c,title,323,y,229,10,font='SansBold')-6
        y=text(c,paragraph,323,y,229,9,font='Sans',color=MUTED)-16
    quote(c,'La meraviglia cresce quando impariamo a fare una domanda migliore.',30,308,255,15)
    sources(c,a,163);c.showPage()

manifest=[]
for a in ARTICLES:
    count=4 if len(a['sections'])==3 else 2
    file=OUT/(a['id']+'.pdf');c=canvas.Canvas(str(file),pagesize=(W,H),pageCompression=1)
    c.setTitle(a['title']+' · articolo campione AD ASTRA');c.setAuthor(a['author']+' · nome dimostrativo');c.setSubject('Provino editoriale, non articolo pubblicato')
    cover(c,a,count);second(c,a,count)
    if count==4:third(c,a);fourth(c,a)
    c.save()
    doc=pdfium.PdfDocument(str(file));assert len(doc)==count
    pages=[]
    for n in range(count):
        page=doc[n];bitmap=page.render(scale=1.8);im=bitmap.to_pil();preview=OUT/f'{a["id"]}-{n+1:02d}.webp';im.save(preview,'WEBP',quality=96,method=5)
        high=page.render(scale=300/72).to_pil();png=OUT/f'{a["id"]}-{n+1:02d}.png';high.save(png,optimize=True)
        page_text=page.get_textpage().get_text_range();assert len(page_text)>300
        pages.append({'image':'assets/provino-pubblicazioni-20261108/'+preview.name,'png':'assets/provino-pubblicazioni-20261108/'+png.name,'alt':f'{a["title"]}, pagina {n+1} di {count}','text':page_text})
    doc.close()
    manifest.append({**a,'pdf':'assets/provino-pubblicazioni-20261108/'+file.name,'pages':pages,'demo':True})
(OUT/'articoli.js').write_text('window.AdAstraPublicationPreview='+json.dumps(manifest,ensure_ascii=False)+';\n',encoding='utf8')
# Le metriche vengono verificate durante la generazione, senza file di lavoro nel sito.
print('Creati',len(manifest),'PDF e',sum(len(a['pages']) for a in manifest),'pagine renderizzate. Tutti i testi controllati nei limiti di pagina.')
