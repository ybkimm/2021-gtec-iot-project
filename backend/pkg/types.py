from dataclasses import dataclass
from typing import List

from pkg.music import MusicInfo


@dataclass
class APIResponse:
    status: str
    timestamp: float


@dataclass
class ErrorResponse(APIResponse):
    error: str


@dataclass
class LightStatusResponse(APIResponse):
    lights: List[bool]


@dataclass
class AlertStatusResponse(APIResponse):
    active: bool


@dataclass
class FanStatusResponse(APIResponse):
    is_on: bool


@dataclass
class JukeboxCurrentMusicResponse(APIResponse, MusicInfo):
    index: int
    is_playing: bool


@dataclass
class JukeboxStatusResponse(APIResponse):
    playlist: List[MusicInfo]


@dataclass
class NotepadContentResponse(APIResponse):
    content: str
