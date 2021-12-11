import json
from dataclasses import dataclass
from os import path
from typing import List


@dataclass
class LightInfo:
    name: str
    position: (int, int)


def parse_hook(obj):
    if 'position' in obj and 'name' in obj:
        return LightInfo(
            name=obj['name'],
            position=tuple(obj['position'])
        )
    return obj


def parse_lightroom_json(wd: str) -> List[LightInfo]:
    fp = open(path.join(wd, 'lightroom.json'), 'r')
    return json.load(fp, object_hook=parse_hook)
