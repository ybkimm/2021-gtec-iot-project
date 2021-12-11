import re
from dataclasses import dataclass
from os import path
from time import sleep
from typing import List

import vlc

regex = r'^[ \t\n\r]*((?:[^,\n\\]|\\.)+),((?:[^,\n\\]|\\.)+),((?:[^,' \
        r'\n\\]|\\.)+),((?:[^,\n\\]|\\.)+),((?:[^,\n\\]|\\.)+),([0-9]+):([' \
        r'0-5][0-9])(?:\n|$)'


@dataclass
class MusicInfo:
    title: str
    artist: str
    album: str
    file: str
    cover: str
    duration: int


class MusicPlayer:
    wd: str
    vlc_instance: vlc.MediaPlayer
    event_manager: vlc.EventManager
    playlist: List[MusicInfo]
    play_index: int
    is_playing: bool

    def __init__(self, wd):
        self.wd = wd
        self.play_index = 0

        self.reset()

        self.parse_playlist(wd)

    def reset(self):
        # FIXME: 플레이 끝나고 나서 플레이어 Freeze 되는 문제 해결되면 고칠 것
        vlc_instance = vlc.MediaPlayer()
        self.vlc_instance = vlc_instance
        self.event_manager = vlc_instance.event_manager()
        self.event_manager.event_attach(
            vlc.EventType.MediaPlayerEndReached,
            self.on_play_ended
        )

    def parse_playlist(self, wd):
        playlist = []
        fp = open(path.join(wd, 'playlist.txt'), 'r')

        fdata = fp.read().strip()
        while True:
            if fdata.startswith('__END__'):
                break

            caps = re.match(regex, fdata, re.MULTILINE)
            if not caps:
                raise Exception('invalid playlist format')

            fdata = fdata[len(caps.group(0)):]

            playlist.append(MusicInfo(
                title=caps.group(1),
                artist=caps.group(2),
                album=caps.group(3),
                file=caps.group(4),
                cover=caps.group(5),
                duration=int(caps.group(6)) * 60000 + int(caps.group(7)) * 1000
            ))

        self.playlist = playlist
        fp.close()

    def get_playlist(self):
        return self.playlist

    def get_music_info(self, index: int):
        if index < 0:
            return self.playlist[self.play_index]
        return self.playlist[index]

    def is_playing(self):
        return self.vlc_instance.is_playing()

    def get_time(self):
        return self.vlc_instance.get_time()

    def seek_to(self, t: int):
        self.vlc_instance.set_time(t)

    def play(self, index: int):
        self.stop()
        if index >= 0:
            self.play_index = index
        self.set_media(self.playlist[self.play_index])
        self.vlc_instance.play()
        sleep(0.1)

    def stop(self):
        if self.vlc_instance.is_playing():
            self.vlc_instance.stop()
            sleep(0.1)

    def set_media(self, item: MusicInfo):
        media = vlc.Media(item.file)
        self.vlc_instance.set_media(media)
        self.vlc_instance.set_time(0)

    def on_play_ended(self, event):
        self.reset()

        self.play_index += 1
        if self.play_index >= len(self.playlist):
            self.play_index -= len(self.playlist)
        elif self.play_index < 0:
            self.play_index += len(self.playlist)
        self.play(-1)
