#!/usr/bin/env python3

import itertools
import shutil
from pathlib import Path

base = Path("/Users/jonchang/Library/CloudStorage/Box-Box/image-segmentation")
p1 = base / "Miyazawa_fishpix_segmented"
p2 = base / "Miyazawa_fishbase_segmented"

dest = Path("_site")
dest.mkdir(parents=True, exist_ok=True)

for idx in "0123456789abcdefghijklmnopqrstuvwxyz":
    (dest / idx).mkdir(parents=True, exist_ok=True)

basenames = []
for path in itertools.chain(p1.iterdir(), p2.iterdir()):
    bn = path.name
    basenames.append(f"('{bn}')")
    shard = dest / bn[0]
    shutil.copy(path, shard)

insert_str = ", ".join(basenames)

Path("schemas/inserts.sql").write_text(f"INSERT INTO IMAGES (basename) VALUES {insert_str};")
