from os import path, getcwd
import re
from typing import List
import vlc
from dataclasses import dataclass

regex = r'^[ \t\n\r]*((?:[^,\n\\]|\\.)+),((?:[^,\n\\]|\\.)+),((?:[^,' \
        r'\n\\]|\\.)+),([0-9]+:[0-5][0-9])[ \t]*(?:\n|$)'


@dataclass
class MusicInfo:
    title: str
    artist: str
    file: str
    duration: str


class MusicPlayer:
    wd: str
    vlc_instance: vlc.MediaPlayer
    playlist: List[MusicInfo]
    play_index: int

    def __init__(self, wd):
        self.wd = wd
        self.vlc_instance = vlc.MediaPlayer()
        self.play_index = 0

        self.parse_playlist(wd)

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
                duration=caps.group(4)
            ))

        self.playlist = playlist
        fp.close()

    def get_music_info(self):
        return self.playlist[self.play_index]

    def play(self):
        self.vlc_instance.stop()
        self.set_media(self.playlist[self.play_index])
        self.vlc_instance.play()

    def next(self):
        self.adjust_play_index(1)
        self.vlc_instance.stop()
        self.set_media(self.playlist[self.play_index])
        self.vlc_instance.play()

    def prev(self):
        self.adjust_play_index(-1)
        self.vlc_instance.stop()
        self.set_media(self.playlist[self.play_index])
        self.vlc_instance.play()

    def stop(self):
        self.vlc_instance.stop()

    def set_media(self, item: MusicInfo):
        media = vlc.Media(item.file)
        self.vlc_instance.set_media(media)

    def adjust_play_index(self, n: int):
        self.play_index += n
        if self.play_index >= len(self.playlist):
            self.play_index -= len(self.playlist)
        elif self.play_index < 0:
            self.play_index += len(self.playlist)
