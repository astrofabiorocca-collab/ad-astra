"""Run before publication, and in the fortnightly maintenance automation."""
from pathlib import Path
import subprocess,sys
root=Path(__file__).resolve().parents[2]
subprocess.run([sys.executable,str(root/'tools/ricerca-concetti/costruisci-passaggi.py')],cwd=root,check=True)
subprocess.run(['node',str(root/'tools/ricerca-concetti/verifica-corpus.cjs')],cwd=root,check=True)
subprocess.run(['git','diff','--check'],cwd=root,check=True)
print('Banca aggiornata e verificata. Nessuna pubblicazione effettuata da questo comando.')
