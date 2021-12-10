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
class JukeboxCurrentMusicResponse(MusicInfo):
    is_playing: bool
    current_time: int


@dataclass
class JukeboxStatusResponse:
    playlist: List[MusicInfo]


@dataclass
class NotepadContentResponse:
    status: str
    content: str


@dataclass
class APIResponse:
    status: str
    error: str = None
