from dataclasses import dataclass
from typing import List

from pkg.music import MusicInfo


@dataclass
class LightStatusResponse:
    is_on: bool


@dataclass
class AlertStatusResponse:
    is_on: bool


@dataclass
class FanStatusResponse:
    is_on: bool


@dataclass
class JukeboxStatusResponse:
    current_music: MusicInfo
    playlist: List[MusicInfo]
