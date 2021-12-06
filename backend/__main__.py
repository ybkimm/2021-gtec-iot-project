from os import getcwd, path

from flask import Flask, send_file, jsonify, request

from pkg.music import MusicPlayer
from pkg.notepad import Notepad
from pkg.types import LightStatusResponse, AlertStatusResponse, \
    FanStatusResponse, JukeboxStatusResponse, JukeboxCurrentMusicResponse


class Device:
    wd: str
    music_player: MusicPlayer
    notepad: Notepad
    light_status: bool
    alert_status: bool
    fan_status: bool

    def __init__(self):
        self.wd = getcwd()
        self.music_player = MusicPlayer(self.wd)
        self.notepad = Notepad(self.wd)


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
        response='{"class":"dummy","name":"Dummy Device",'
                 '"features":["light","jukebox","alert","notepad","fan"]}',
        status=200,
        mimetype='application/json'
    )


@app.get('/device/icon')
def get_device_icon():
    return send_file(path.join(device.wd, 'device_icon.png'))


@app.get('/device/alert')
def get_device_alert():
    return jsonify(AlertStatusResponse(device.alert_status))


@app.post('/device/alert')
def post_device_alert():
    action = request.form.get('action')
    if action == 'toggle':
        device.alert_status = not device.alert_status
    elif action == 'on':
        device.alert_status = True
    elif action == 'off':
        device.alert_status = False
    else:
        return 'invalid request', 400
    return get_device_alert()


@app.get('/device/light')
def get_device_light():
    return jsonify(LightStatusResponse(device.light_status))


@app.post('/device/light')
def post_device_light():
    action = request.form.get('action')
    if action == 'toggle':
        device.light_status = not device.light_status
    elif action == 'on':
        device.light_status = True
    elif action == 'off':
        device.light_status = False
    else:
        return 'invalid request', 400
    return get_device_light()


@app.get('/device/fan')
def get_device_fan():
    return jsonify(FanStatusResponse(device.fan_status))


@app.post('/device/fan')
def post_device_fan():
    action = request.form.get('action')
    if action == 'toggle':
        device.fan_status = not device.fan_status
    elif action == 'on':
        device.fan_status = True
    elif action == 'off':
        device.fan_status = False
    else:
        return 'invalid request', 400
    return get_device_fan()


@app.get('/device/jukebox')
def get_device_jukebox():
    return jsonify(JukeboxStatusResponse(
        playlist=device.music_player.get_playlist()
    ))


@app.get('/device/jukebox/current_music')
def get_device_jukebox_current_music():
    current_music = device.music_player.get_music_info()
    return jsonify(JukeboxCurrentMusicResponse(
        title=current_music.title,
        artist=current_music.artist,
        file=current_music.file,
        duration=current_music.duration,
        is_playing=device.music_player.is_playing(),
        current_time=device.music_player.get_time()
    ))


@app.post('/device/jukebox/play')
def post_device_jukebox_play():
    device.music_player.play()
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


@app.post('/device/jukebox/stop')
def post_device_jukebox_stop():
    device.music_player.stop()
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


@app.post('/device/jukebox/next')
def post_device_jukebox_next():
    device.music_player.next()
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


@app.post('/device/jukebox/prev')
def post_device_music_prev():
    device.music_player.prev()
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


@app.get('/device/notepad')
def get_device_notepad():
    return str(device.notepad.get_content(), 'utf-8')


@app.put('/device/notepad')
def put_device_notepad():
    content = request.get_data()
    if len(content) < 33:
        return 'short content', 400
    device.notepad.update(content)
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


if __name__ == "__main__":
    app.run()
