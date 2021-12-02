from os import getcwd, path
from flask import Flask, send_file, jsonify
from pkg.music import MusicPlayer

wd = getcwd()
app = Flask(__name__)
music_player = MusicPlayer(wd)


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
    return send_file(path.join(wd, 'device_icon.png'))


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
    return jsonify(music_player.get_music_info())


@app.post('/music/play')
def post_music_play():
    music_player.play()
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


@app.post('/music/stop')
def post_music_stop():
    music_player.stop()
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


@app.post('/music/next')
def post_music_next():
    music_player.next()
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


@app.post('/music/prev')
def post_music_prev():
    music_player.prev()
    return app.response_class(
        response='{"status":"ok"}',
        status=200,
        mimetype='application/json'
    )


if __name__ == "__main__":
    app.run()
