from os import path
from typing import AnyStr


class Notepad:
    wd: str
    content: bytearray

    def __init__(self, wd: str):
        self.wd = wd
        self.content = bytearray(32)

        self.load_content()

    def load_content(self):
        fp = open(path.join(self.wd, 'notepad.txt'), 'rb')

        fdata = fp.read(33)  # 16 bytes for each line, 1 byte for linebreak.
        self.set_content(fdata)

        fp.close()

    def save_content(self):
        fp = open(path.join(self.wd, 'notepad.txt'), 'wb')

        fp.write(self.content[:16])
        fp.write(bytes('\n', 'utf-8'))
        fp.write(self.content[16:])
        fp.write(bytes(';', 'utf-8'))

        fp.close()

    def set_content(self, contents: bytes):
        self.content[:16] = contents[:16]
        self.content[16:] = contents[17:33]

    def get_content(self):
        return self.content

    def update(self, contents: bytes):
        self.set_content(contents)
        self.save_content()
        self.render()

    def render(self):  # TODO: Implement me!
        print(
            'render: note content: ',
            str(self.content[:16], 'utf-8'),
            str(self.content[16:], 'utf-8'),
            sep='\n    '
        )
