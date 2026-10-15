import json, urllib.request
out=[]
def ls(repo,path):
    u=f"https://huggingface.co/api/datasets/pnpl/{repo}/tree/main/{path}"
    return json.load(urllib.request.urlopen(u))
for repo,dsets in [("LibriBrain",[f"Sherlock{i}" for i in range(1,8)]),("LibriBrain2",["Sherlock1","Sherlock8","Sherlock9","TIMIT","MOCHATIMIT","TheMoth"])]:
    for d in dsets:
        for sub in ["derivatives/serialised","derivatives/events","stimuli/audio","stimuli"]:
            try:
                for x in ls(repo,f"{d}/{sub}"):
                    if x['type']=='file': out.append(dict(repo=repo,path=x['path'],size=x['size']))
            except Exception as e: print("err",repo,d,sub,e)
json.dump(out,open("hf_files.json","w"),indent=0)
print(len(out))
