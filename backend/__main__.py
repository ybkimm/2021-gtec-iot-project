from datetime import datetime
from os import getcwd, path
from typing import List

from flask import Flask, send_file, jsonify, request
from flask_cors import CORS

from pkg.music import MusicPlayer
from pkg.notepad import Notepad
from pkg.types import LightStatusResponse, AlertStatusResponse, \
    FanStatusResponse, JukeboxStatusResponse, JukeboxCurrentMusicResponse, \
    NotepadContentResponse, APIResponse, ErrorResponse


class Device:
    wd: str
    music_player: MusicPlayer
    notepad: Notepad
    light_status: List[bool]
    alert_status: bool
    fan_status: bool

    def __init__(self):
        self.wd = getcwd()
        self.music_player = MusicPlayer(self.wd)
        self.notepad = Notepad(self.wd)
        self.light_status = [False, False]
        self.alert_status = False
        self.fan_status = False


device = Device()
app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)


def now():
    return datetime.now().timestamp()


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
                 '"features":["notepad","jukebox","light","alert","fan"]}',
        status=200,
        mimetype='application/json'
    )


@app.get('/device/icon')
def get_device_icon():
    return send_file(path.join(device.wd, 'device_icon.png'))


@app.get('/device/alert')
def get_device_alert():
    return jsonify(AlertStatusResponse(
        status='ok',
        active=device.alert_status,
        timestamp=now()
    ))


@app.post('/device/alert')
def post_device_alert():
    action = request.args.get('action')
    if action == 'toggle':
        device.alert_status = not device.alert_status
    elif action == 'on':
        device.alert_status = True
    elif action == 'off':
        device.alert_status = False
    else:
        return ErrorResponse(
            status='bad request',
            error='unknown action',
            timestamp=now()
        ), 400

    return jsonify(APIResponse(
        status='ok',
        timestamp=now()
    ))


@app.get('/device/fan')
def get_device_fan():
    return jsonify(FanStatusResponse(
        status='ok',
        active=device.fan_status,
        timestamp=now()
    ))


@app.post('/device/fan')
def post_device_fan():
    action = request.args.get('action')
    if action == 'toggle':
        device.fan_status = not device.fan_status
    elif action == 'on':
        device.fan_status = True
    elif action == 'off':
        device.fan_status = False
    else:
        return ErrorResponse(
            status='bad request',
            error='unknown action',
            timestamp=now()
        ), 400

    return jsonify(APIResponse(
        status='ok',
        timestamp=now()
    ))


@app.get('/device/light')
def get_device_light():
    return jsonify(LightStatusResponse(
        status='ok',
        lights=device.light_status,
        timestamp=now()
    ))


@app.get('/device/light/info')
def get_device_light_info():
    return send_file(
        path.join(device.wd, 'lightroom.json'),
        mimetype='application/json;charset=utf-8'
    )


@app.get('/device/light/background')
def get_device_light_background():
    return send_file(path.join(device.wd, 'lightroom.png'))


@app.post('/device/light')
def post_device_light():
    index = int(request.args.get('index'))
    if index >= len(device.light_status):
        return ErrorResponse(
            status='bad request',
            error='unknown light id',
            timestamp=now()
        ), 400

    action = request.args.get('action')
    if action == 'toggle':
        device.light_status[index] = not device.light_status[index]
    elif action == 'on':
        device.light_status[index] = True
    elif action == 'off':
        device.light_status[index] = False
    else:
        return ErrorResponse(
            status='bad request',
            error='unknown action',
            timestamp=now()
        ), 400

    return jsonify(APIResponse(
        status='ok',
        timestamp=now()
    ))


@app.get('/device/jukebox')
def get_device_jukebox():
    return jsonify(JukeboxStatusResponse(
        status='ok',
        playlist=device.music_player.get_playlist(),
        timestamp=now()
    ))


@app.get('/device/jukebox/current_music')
def get_device_jukebox_current_music():
    current_music = device.music_player.get_music_info(-1)
    return jsonify(JukeboxCurrentMusicResponse(
        status='ok',
        title=current_music.title,
        artist=current_music.artist,
        album=current_music.album,
        file=current_music.file,
        cover=current_music.cover,
        duration=current_music.duration,
        is_playing=device.music_player.is_playing(),
        index=device.music_player.play_index,
        timestamp=now()
    ))


@app.get('/device/jukebox/cover')
def get_device_jukebox_cover():
    index = int(request.args.get('index'))
    music = device.music_player.get_music_info(index)
    print(music.cover)
    return send_file(path.join(device.wd, music.cover))


@app.post('/device/jukebox/play')
def post_device_jukebox_play():
    index = int(request.args.get('index'))
    device.music_player.play(
        index=index
    )
    return jsonify(APIResponse(
        status='ok',
        timestamp=datetime.now().timestamp()
    ))


@app.post('/device/jukebox/stop')
def post_device_jukebox_stop():
    device.music_player.stop()
    return jsonify(APIResponse(
        status='ok',
        timestamp=datetime.now().timestamp()
    ))


@app.get('/device/notepad')
def get_device_notepad():
    content = str(device.notepad.get_content(), 'utf-8')
    return jsonify(NotepadContentResponse(
        status='ok',
        content=content,
        timestamp=now()
    ))


@app.put('/device/notepad')
def put_device_notepad():
    content = request.get_data()
    if len(content) < 33:
        return jsonify(ErrorResponse(
            status='error',
            error='short content',
            timestamp=now()
        )), 400
    device.notepad.update(content)
    return jsonify(NotepadContentResponse(
        status='ok',
        content=str(device.notepad.get_content(), 'utf-8'),
        timestamp=now()
    ))


if __name__ == "__main__":
    app.run()
