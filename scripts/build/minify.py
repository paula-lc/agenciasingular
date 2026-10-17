# Minifica CSS y JS: assets/src/** (fuentes, se editan aquí) -> assets/css/ y assets/js/ (lo que carga la web).
# Requiere Node.js (usa npx: terser y csso-cli, se descargan solos la primera vez).
# Se ejecuta al final de build.py; también se puede lanzar suelto: python3 scripts/build/minify.py
import subprocess, os, shutil, sys
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))+'/'
JOBS=[
  (['npx','--yes','csso-cli@4.0.2','-i','assets/src/css/styles.css','-o','assets/css/styles.css'],'assets/css/styles.css'),
  (['npx','--yes','terser@5.36.0','assets/src/js/main.js','--compress','--mangle','-o','assets/js/main.js'],'assets/js/main.js'),
  (['npx','--yes','terser@5.36.0','assets/src/js/hola.js','--compress','--mangle','-o','assets/js/hola.js'],'assets/js/hola.js'),
]
def run():
    if not shutil.which('npx'):
        sys.exit('⚠ Falta Node.js (npx): instálalo para minificar CSS y JS.')
    npx=shutil.which('npx')  # en Windows es npx.cmd: hay que dar la ruta completa
    for cmd,out in JOBS:
        subprocess.run([npx]+cmd[1:],cwd=ROOT,check=True,stdout=subprocess.DEVNULL)
        print(f'  {out}: {os.path.getsize(ROOT+out)//1024} KB')
if __name__=='__main__': run()
