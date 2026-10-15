import os, re, csv, json, collections, math
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'datasets')
VOCAB="is the a to it i not was we be he that have this they of there and are in but will so all my for she were any really at out our am it's had him an very has do can time think good always new people as on".split()
book=collections.defaultdict(collections.Counter); corp=collections.defaultdict(collections.Counter)
phon=collections.defaultdict(collections.Counter); sessions=[]
for fn in sorted(os.listdir('events')):
    repo, corpus = fn.split('__')[:2]
    m=re.search(r'sub-(\d+)_ses-(\d+)_task-(\w+?)_run-(\d+)', fn); sub,ses=int(m[1]),int(m[2])
    C='Sherlock' if corpus.startswith('Sherlock') else corpus
    T0=None;T1=0;nw=0
    for r in csv.DictReader(open('events/'+fn), delimiter='\t'):
        try: t=float(r['timemeg']); d=float(r['duration'] or 0)
        except: continue
        T0=t if T0 is None else min(T0,t); T1=max(T1,t+d)
        if r['kind']=='word': nw+=1
        if sub!=0: continue
        if r['kind']=='word':
            w=r['segment'].lower()
            corp[C][w]+=1
            if C=='Sherlock': book[corpus][w]+=1
        elif r['kind']=='phoneme':
            p=r['segment'].split('_')[0].lower()
            phon[C][p]+=1
            if repo=='LibriBrain': phon['LibriBrain'][p]+=1
    sessions.append([corpus,sub,ses,round((T1-T0)/60,2),nw])
# distinctive words per book (smoothed log-ratio vs the rest of the canon)
tot=collections.Counter();[tot.update(c) for c in book.values()]
books={}
for b,c in sorted(book.items()):
    Nb=sum(c.values()); rest={w:tot[w]-c[w] for w in c}; Nr=sum(tot.values())-Nb
    sc=sorted(((math.log((c[w]+1)/Nb)-math.log((rest[w]+1)/Nr))*math.log(c[w]), w) for w in c if c[w]>=12 and len(w)>2)
    books[b]=dict(words=Nb,vocab=len(c),distinctive=[w for _,w in sc[::-1][:14]])
    print(b, books[b]['distinctive'])
lbw=collections.Counter();[lbw.update(book[f'Sherlock{i}']) for i in range(1,8)]
ranked=lbw.most_common()
zipf=[[i+1,v] for i,(w,v) in enumerate(ranked) if i<300 or (i+1) in {int(10**(k/20)) for k in range(0,100)}]
out=dict(
 books=books,
 libribrain=dict(words=sum(lbw.values()),vocab=len(lbw),top=ranked[:300],zipf=zipf,phon=dict(phon['LibriBrain'])),
 corpora={C:dict(words=sum(corp[C].values()),vocab=len(corp[C]),top=corp[C].most_common(60),phon=dict(phon[C]),target={w:corp[C][w] for w in VOCAB}) for C in corp},
 sessions=sessions, vocab50=VOCAB)
json.dump(out,open(f'{OUT}/stats.json','w'),separators=(',',':'))
print(os.path.getsize(f'{OUT}/stats.json'), sorted(phon['LibriBrain']))
