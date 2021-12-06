from os import path
from typing import AnyStr


class Notepad:
    content: bytearray

    def __init__(self, wd: str):
        self.content = bytearray(32)

        self.load_content(wd)

    def load_content(self, wd: str):
        fp = open(path.join(wd, 'notepad.txt'), 'rb')

        fdata = fp.read(33)  # 16 bytes for each line, 1 byte for linebreak.
        self.update(fdata)

        fp.close()

    def get_content(self):
        return self.content

    def update(self, content: bytes):
        self.content[:16] = content[:16]
        self.content[16:] = content[17:33]

        self.render()

    def render(self):  # TODO: Implement me!
        print(
            'render: note content: ',
            str(self.content[:16], 'utf-8'),
            str(self.content[16:], 'utf-8'),
            sep='\n    '
        )
