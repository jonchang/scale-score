#!/usr/bin/env python3

import itertools
from pathlib import Path

base = Path("/Users/jonchang/Library/CloudStorage/Box-Box/image-segmentation")
p1 = base / "Miyazawa_fishpix_segmented"
p2 = base / "Miyazawa_fishbase_segmented"

def inserts():
    for path in itertools.chain(p1.iterdir(), p2.iterdir()):
        yield f"('{path.name}')"

insert_str = ", ".join(inserts())

Path("schemas/inserts.sql").write_text(f"INSERT INTO IMAGES (basename) VALUES {insert_str};")
