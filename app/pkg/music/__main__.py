from os import getcwd
from . import MusicPlayer


def main():
    print('The Music Player - For testing purpose!')
    print('  Playlist is not included - which occurs an error. you must write '
          'your own playlist, save as playlist.txt')
    print('  Format is as follows:')
    print('    Title,Artist,music/name.mp3,0:00')
    print('    __END__')
    player = MusicPlayer(getcwd())
    while True:
        cmd = input('>>> ').strip()
        if cmd == 'play':
            player.play()
        elif cmd == 'stop':
            player.stop()
        elif cmd == 'next':
            player.next()
        elif cmd == 'prev':
            player.prev()
        elif cmd == 'quit' or cmd == 'exit':
            player.stop()
            return
        elif cmd == 'help':
            print('Commands:')
            print('  play, stop, next, prev, quit, exit, help')
        else:
            print('unknown command - use help command for command list!')


if __name__ == '__main__':
    main()
