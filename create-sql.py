#!/usr/bin/env python3

import shutil
from pathlib import Path
from collections import defaultdict

base = Path("/Users/jonchang/Library/CloudStorage/Box-Box/image-segmentation")
p1 = base / "Miyazawa_fishpix_segmented"
p2 = base / "Miyazawa_fishbase_segmented"

all_files = set(p1.iterdir()) | set(p2.iterdir())

dest = Path("_site")
dest.mkdir(parents=True, exist_ok=True)

for idx in "0123456789abcdefghijklmnopqrstuvwxyz":
    (dest / idx).mkdir(parents=True, exist_ok=True)

basenames = defaultdict(list)
for path in all_files:
    bn = path.name
    shard = dest / bn[0]
    basenames[bn[0]].append(f"('{bn}')")
    shutil.copy(path, shard)

for prefix, inserts in basenames.items():
    insert_str = ", ".join(inserts)
    Path(f"schemas/inserts-{prefix}.sql").write_text(f"INSERT INTO IMAGES (basename) VALUES {insert_str};\n")
