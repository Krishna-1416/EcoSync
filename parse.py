import json, html, re, glob, sys, pathlib

def parse_transcript():
    files = glob.glob("*.json3")
    if not files:
        sys.exit("No json3 file found.")
    
    target_file = files[0]
    with open(target_file, 'r', encoding="utf-8") as f:
        data = json.load(f)
        
    parts = ["".join(s.get("utf8","") for s in e.get("segs") or []) for e in data.get("events", [])]
    txt = re.sub(r"\s+", " ", html.unescape(" ".join(p.strip() for p in parts if p.strip()))).strip()
    
    out = pathlib.Path(target_file).with_suffix(".txt")
    out.write_text(txt, encoding="utf-8")
    print(out)

if __name__ == "__main__":
    parse_transcript()
