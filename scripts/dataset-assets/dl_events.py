import json, urllib.request, os, concurrent.futures as cf
f=json.load(open("hf_files.json"))
ev=[x for x in f if '/events/' in x['path'] and x['path'].endswith('.tsv')]
def get(x):
    out=os.path.join("events",x['repo']+"__"+x['path'].replace('/','__'))
    if os.path.exists(out): return
    u=f"https://huggingface.co/datasets/pnpl/{x['repo']}/resolve/main/{x['path']}"
    urllib.request.urlretrieve(u,out)
with cf.ThreadPoolExecutor(8) as ex: list(ex.map(get,ev))
print(len(ev))
