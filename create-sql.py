#!/usr/bin/env python3

import shutil
from pathlib import Path
from itertools import batched

VALID_SHARD_NAMES = "0123456789abcdefghijklmnopqrstuvwxyz"

def make_shard(name):
    for char in name:
        if char in VALID_SHARD_NAMES:
            return char
    return "_"

p1 = Path("/Users/jonchang/Downloads/fishfish/randall_fish")
p2 = Path("/Users/jonchang/Downloads/fishfish/Miyazawa_fishbase_segmented")

prefix = [x.strip() for x in Path("only-include-prefix.txt").open().readlines()]

all_files = set(p1.iterdir()) | set(p2.iterdir())

dest = Path("_site")
dest.mkdir(parents=True, exist_ok=True)

for idx in VALID_SHARD_NAMES:
    (dest / idx).mkdir(parents=True, exist_ok=True)

basenames = []
for path in all_files:
    bn = path.name
    if not any([bn.startswith(x) for x in prefix]):
        continue
    shard_prefix = make_shard(bn)
    shard = dest / shard_prefix
    basenames.append(f"('{bn}')")
    shutil.copy(path, shard)


for idx, inserts in enumerate(batched(basenames, 500)):
    insert_str = ", ".join(inserts)
    Path(f"schemas/inserts-{idx}.sql").write_text(f"INSERT INTO IMAGES (basename) VALUES {insert_str};\n")
