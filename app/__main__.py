from os import getcwd, path
from flask import Flask, send_file, jsonify
from pkg.music import MusicPlayer


class Device:
    wd: str
    music_player: MusicPlayer

    def __init__(self):
        self.wd = getcwd()
        self.music_player = MusicPlayer(self.wd)


app = Flask(__name__)
device = Device()


@app.get('/')
def get_root():
    return 'Hello, World!'


@app.get('/health')
def get_health():
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


@app.get('/device')
def get_device_info():
    return app.response_class(
        response='{"class":"dummy","name":"Dummy Device"}',
        status=200,
        mimetype='application/json'
    )


@app.get('/device/icon')
def get_device_icon():
    return send_file(path.join(device.wd, 'device_icon.png'))


@app.get('/device/light')
def get_device_led():
    return app.response_class(
        response='{""}'
    )


@app.get('/device/fan')
def get_device_fan():
    return ''


@app.get('/device/alert')
def get_device_alert():
    return ''


@app.get('/device/notepad')
def get_device_notepad():
    return ''


@app.get('/music')
def get_music():
    return jsonify(device.music_player.get_music_info())


@app.post('/music/play')
def post_music_play():
    device.music_player.play()
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


@app.post('/music/stop')
def post_music_stop():
    device.music_player.stop()
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


@app.post('/music/next')
def post_music_next():
    device.music_player.next()
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


@app.post('/music/prev')
def post_music_prev():
    device.music_player.prev()
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


if __name__ == "__main__":
    app.run()
