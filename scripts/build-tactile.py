import base64
import os,pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
F=os.environ.get('FONTS_DIR','/tmp/fnt/')
app=open(ROOT/'src/app.html').read()
shared=app[app.index('// ================= labels'):app.index('// ================= settings')]
fonts=[("Noto Sans Myanmar",w,F+f'fontsource-noto-sans-myanmar-5.3.0/files/noto-sans-myanmar-myanmar-{w}-normal.woff2','') for w in (400,500)]
b64=lambda p:base64.b64encode(open(p,'rb').read()).decode()
css=''.join(f"@font-face{{font-family:'{n}';font-weight:{w};font-style:normal;font-display:swap;src:url(data:font/woff2;base64,{b64(p)}) format('woff2')}}\n" for n,w,p,_ in fonts)
css+=f"@font-face{{font-family:'Martian Mono Variable';font-style:normal;font-display:swap;font-weight:100 800;font-stretch:75% 112.5%;src:url(data:font/woff2;base64,{b64(F+'mm/package/files/martian-mono-latin-wdth-normal.woff2')}) format('woff2-variations')}}\n"
eng=(lambda t:t[:t.index('class ceMmChronicle {')])((lambda t:t[:t.index('(() => {')]+t[t.index('})();',t.index('(() => {'))+5:])(open(ROOT/'vendor/mmcal/ceMmDateTime.js').read())).replace('</script','<\\/script')
s=open(ROOT/'src/tactile.html').read().replace('/*FONTS*/',css).replace('/*ENGINE*/',eng).replace('/*SHARED*/',shared)
for out in ('tactile/index.html','docs/tactile/index.html'):
    (ROOT/out).parent.mkdir(parents=True,exist_ok=True); (ROOT/out).write_text(s)
print(len(s))
