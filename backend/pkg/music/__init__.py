import re
from dataclasses import dataclass
from os import path
from typing import List

import vlc

regex = r'^[ \t\n\r]*((?:[^,\n\\]|\\.)+),((?:[^,\n\\]|\\.)+),((?:[^,' \
        r'\n\\]|\\.)+),([0-9]+):([0-5][0-9])[ \t]*(?:\n|$)'


@dataclass
class MusicInfo:
    title: str
    artist: str
    file: str
    duration: int


class MusicPlayer:
    wd: str
    vlc_instance: vlc.MediaPlayer
    event_manager: vlc.EventManager
    playlist: List[MusicInfo]
    play_index: int

    def __init__(self, wd):
        self.wd = wd
        self.play_index = 0

        self.reset()

        self.parse_playlist(wd)

    def reset(self):
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
                file=caps.group(3),
                duration=int(caps.group(4)) * 60000 + int(caps.group(5)) * 1000
            ))

        self.playlist = playlist
        fp.close()

    def get_playlist(self):
        return self.playlist

    def get_music_info(self):
        return self.playlist[self.play_index]

    def is_playing(self):
        return self.vlc_instance.is_playing()

    def get_time(self):
        return self.vlc_instance.get_time()

    def seek_to(self, t: int):
        self.vlc_instance.set_time(t)

    def play(self):
        self.stop()
        self.set_media(self.playlist[self.play_index])
        self.vlc_instance.play()

    def next(self):
        self.adjust_play_index(1)
        self.stop()
        self.set_media(self.playlist[self.play_index])
        self.vlc_instance.play()

    def prev(self):
        self.adjust_play_index(-1)
        self.stop()
        self.set_media(self.playlist[self.play_index])
        self.vlc_instance.play()

    def stop(self):
        if self.vlc_instance.is_playing():
            self.vlc_instance.stop()

    def set_media(self, item: MusicInfo):
        media = vlc.Media(item.file)
        self.vlc_instance.set_media(media)
        self.vlc_instance.set_time(0)

    def adjust_play_index(self, n: int):
        self.play_index += n
        if self.play_index >= len(self.playlist):
            self.play_index -= len(self.playlist)
        elif self.play_index < 0:
            self.play_index += len(self.playlist)

    def on_play_ended(self, event):
        self.reset()
        self.next()
