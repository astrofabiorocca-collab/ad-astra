"""Indicizza il glossario originale nella banca privata, senza copiare i PDF nel sito.

Uso: python tools/integra-glossario-banca.py --banca /percorso/banca
Le correlazioni FTS sono candidati, mai attestazioni di verifica scientifica.
"""
import argparse
import hashlib
import json
import re
import sqlite3
from datetime import date
from pathlib import Path

SID = 'ad-astra-glossario-originale'
EVIDENCE = 'Testo originale AD ASTRA; riferimenti nella scheda. Non è una fonte indipendente dalle lezioni del progetto.'


def digest(text):
    return hashlib.sha256(text.encode('utf8')).hexdigest()


def read_js(path):
    return json.loads(path.read_text(encoding='utf8').split('=', 1)[1].rstrip(';\n'))


def atomic_js(path, variable, value):
    temp = path.with_suffix('.sync-tmp')
    temp.write_text(variable + '=' + json.dumps(value, ensure_ascii=False) + ';\n', encoding='utf8')
    temp.replace(path)


def sync(bank, glossary, seen):
    entries = read_js(glossary)
    assert len({e['id'] for e in entries}) == len(entries)
    catalog_path = bank / 'catalogo-consultabile.js'
    catalog = read_js(catalog_path)
    db = sqlite3.connect(bank / 'ad-astra.sqlite')
    db.execute('PRAGMA foreign_keys=ON')
    db.execute('''CREATE TABLE IF NOT EXISTS glossary_candidates (
        glossary_id TEXT NOT NULL, unit_id TEXT NOT NULL REFERENCES units(id),
        status TEXT NOT NULL, query TEXT NOT NULL,
        PRIMARY KEY(glossary_id,unit_id))''')
    card = dict(id=SID, kind='testo originale AD ASTRA', title='Glossario scientifico AD ASTRA',
                url='', file='', status=f'{len(entries)} schede originali indicizzate; non fonte esterna indipendente',
                rights='Testi del progetto; le fonti citate mantengono i propri diritti',
                metadata=dict(entries=len(entries), glossary_sha256=digest(glossary.read_text(encoding='utf8')),
                              links='Correlazioni automatiche candidate, da verificare nel contesto'),
                areas=[f'{n:02}' for n in range(1, 11)], topics=['glossario', 'raccordi didattici'])
    serialized = json.dumps(card, ensure_ascii=False, sort_keys=True)
    old = db.execute('SELECT hash FROM sources WHERE id=?', (SID,)).fetchone()
    changed = 0
    with db:
        if not old or old[0] != digest(serialized):
            revision = db.execute('SELECT coalesce(max(revision),0)+1 FROM source_versions WHERE source_id=?', (SID,)).fetchone()[0]
            db.execute('INSERT INTO source_versions VALUES(?,?,?,?,?)', (SID, revision, serialized, digest(serialized), seen))
            db.execute('''INSERT INTO sources VALUES(?,?,?,?,?,?,?,?,?,?)
                ON CONFLICT(id) DO UPDATE SET title=excluded.title,status=excluded.status,
                metadata_json=excluded.metadata_json,hash=excluded.hash,seen_date=excluded.seen_date''',
                (SID, card['kind'], card['title'], '', '', card['status'], card['rights'], serialized, digest(serialized), seen))
        for area in card['areas']:
            db.execute('INSERT OR IGNORE INTO source_areas VALUES(?,?,?)', (SID, area, 'Raccordi delle schede alle lezioni'))
        db.execute('DELETE FROM glossary_candidates')
        for e in entries:
            uid = SID + ':' + e['id']
            locator = 'voce ' + e['id']
            parts = [e['name'], e['definition']]
            for section in e['sections']:
                parts += [section['title'], *section['paragraphs']]
            parts += e.get('facts', [])
            parts += ['Riferimento: ' + s['title'] + ' — ' + s['url'] for s in e.get('sources', [])]
            text = '\n\n'.join(parts)
            previous = db.execute('SELECT text FROM units WHERE id=?', (uid,)).fetchone()
            if not previous or previous[0] != text:
                rev = db.execute('SELECT coalesce(max(revision),0)+1 FROM unit_versions WHERE unit_id=?', (uid,)).fetchone()[0]
                db.execute('INSERT INTO unit_versions VALUES(?,?,?,?,?,?,?,?)',
                           (uid, rev, SID, locator, text, EVIDENCE, digest(text), seen))
                area = re.search(r'lezione-(\d+)-', e['lesson'])
                areas = [f'{int(area[1]):02}'] if area else ['07', '09']
                db.execute('''INSERT INTO units VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE
                    SET text=excluded.text,evidence=excluded.evidence,areas_json=excluded.areas_json''',
                    (uid, SID, locator, text, EVIDENCE, json.dumps(areas)))
                db.execute('DELETE FROM search_units WHERE unit_id=?', (uid,))
                db.execute('INSERT INTO search_units VALUES(?,?,?)', (uid, SID, text))
                changed += 1
            # Frase esatta; esclusi video, playlist e tutti i testi interni del progetto.
            query = '"' + e['name'].replace('"', '""') + '"'
            hits = db.execute('''SELECT search_units.unit_id FROM search_units
                JOIN sources s ON s.id=search_units.source_id WHERE search_units MATCH ?
                AND s.kind NOT IN ('video','playlist','testo originale AD ASTRA')
                ORDER BY rank LIMIT 5''', (query,)).fetchall()
            for (hit,) in hits:
                db.execute('INSERT INTO glossary_candidates VALUES(?,?,?,?)',
                           (e['id'], hit, 'candidato FTS da verificare; non fonte validata', query))
        assert db.execute('PRAGMA integrity_check').fetchone()[0] == 'ok'
        assert not db.execute('PRAGMA foreign_key_check').fetchall()
        assert db.execute('SELECT count(*) FROM units WHERE source_id=?', (SID,)).fetchone()[0] == len(entries)
        assert db.execute('SELECT count(*) FROM units').fetchone()[0] == db.execute('SELECT count(*) FROM search_units').fetchone()[0]
    catalog['sources'] = [s for s in catalog['sources'] if s['id'] != SID] + [card]
    catalog['summary'].update(date=seen, sources=db.execute('SELECT count(*) FROM sources').fetchone()[0],
                              units=db.execute('SELECT count(*) FROM units').fetchone()[0])
    texts = [dict(source=s, locator=l, text=t, evidence=v)
             for s, l, t, v in db.execute('SELECT source_id,locator,text,evidence FROM units ORDER BY source_id,id')]
    atomic_js(catalog_path, 'window.AD_ASTRA_BANK', catalog)
    atomic_js(bank / 'testi-consultabili.js', 'window.AD_ASTRA_TEXTS', texts)
    result = dict(schede=len(entries), unita_modificate=changed,
                  candidati=db.execute('SELECT count(*) FROM glossary_candidates').fetchone()[0],
                  documenti_esterni=db.execute("SELECT count(*) FROM sources WHERE kind='documento'").fetchone()[0],
                  unita_totali=len(texts), pubblicazione=False)
    db.close()
    return result


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--banca', required=True, type=Path)
    parser.add_argument('--glossario', type=Path,
                        default=Path(__file__).resolve().parents[1] / 'assets/scuola-attiva/glossario-dati.js')
    parser.add_argument('--data', default=date.today().isoformat())
    args = parser.parse_args()
    print(json.dumps(sync(args.banca, args.glossario, args.data), ensure_ascii=False))
