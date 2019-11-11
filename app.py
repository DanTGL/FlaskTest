from flask import Flask, render_template, request, send_from_directory, send_file
from flask_uploads import UploadSet, configure_uploads, DATA
from string import Template
from werkzeug import secure_filename
import os
import json
import string
import random
import datetime
from sqlalchemy import create_engine, Column, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

APP_ROOT = os.path.dirname(os.path.abspath(__file__))

video_directory = '/static/videos/'

photos = UploadSet('files', DATA)
videos = UploadSet('videos', DATA)

app.config['UPLOADED_FILES_DEST'] = 'uploads'
configure_uploads(app, photos)
app.config['UPLOADED_VIDEOS_DEST'] = video_directory
configure_uploads(app, videos);

engine = create_engine('sqlite:///mindatabas.db', echo=False)
Session = sessionmaker(bind=engine)
Base = declarative_base()
session = Session()

class Sakattkopa(Base):
    __tablename__ = 'sakattkopa'
    id = Column(Integer, primary_key=True)
    saknamn = Column(Text)

Base.metadata.create_all(engine)

@app.route('/database')
def test_databas():
    enavsakerna = session.query(Sakattkopa).get(3)
    return enavsakerna.saknamn

def create_video(json_name, file_name, video_name, video_desc):
    data = {
        "filename": file_name,
        "video_name": video_name,
        "video_desc": video_desc
    }
    with open('./videos/' + json_name + '.json', 'w+') as outfile:
        json.dump(data, outfile)

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST' and 'photo' in request.files:
        filename = photos.save(request.files['photo'])
        return filename
    return render_template('upload.html')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOADED_FILES_DEST'], filename)

@app.route('/uploads')
def uploaded_files():
    return str(os.listdir('./uploads'))

@app.route('/gl')
def test_gl():
    return render_template('./rts.html');

@app.route('/videos/upload', methods=['GET', 'POST'])
def upload_video():
    #target = os.path.join(os.getcwd(), video_directory)
    #print(target)
    #if not os.path.isdir(target):
    #    os.mkdir(target)

    if request.method == 'POST' and 'video' in request.files and 'video_name' in request.form and 'video_desc' in request.form:
        print("test")
        print(request.form['video_name'])
        #filename = videos.save(request.files['video'], app.config['UPLOADED_VIDEOS_DEST'])
        file = request.files['video']
        jsonname = ''
        if 'json_name' in request.form and request.form['json_name'] is not '':
            jsonname = request.form['json_name']
        else:
            jsonname=random.choices(string.ascii_uppercase + string.digits, k=8)
            #jsonname = file.filename.split('.')[0]
        #if filename is None:
        #    filename = file.filename
        #destination = "/".join([target, filename])
        #fileType = None
        #if file.filename is not filename:
        #    if file.filename.endswith('.mp4'):
        #        fileType = '.mp4'

        print(secure_filename(os.path.join(app.config['UPLOADED_VIDEOS_DEST'], file.filename)))
        file.save(os.path.join('.' + app.config['UPLOADED_VIDEOS_DEST'], jsonname))
        
        create_video(json_name=jsonname, file_name=jsonname, video_name=request.form['video_name'], video_desc=request.form['video_desc'])
        return 'Video uploaded successfully'
    return render_template('upload_video.html')

@app.route('/videos')
def videos():
    return str(os.listdir('.' + video_directory))

@app.route('/videos/<filename>')
def show_video(filename):
    #file_path = os.path.join('/' + app.config['UPLOADED_VIDEOS_DEST'], filename)
    with open('./videos/' + filename + '.json') as f:
        data = json.load(f)
    
    file_path = os.path.join(app.config['UPLOADED_VIDEOS_DEST'], data['filename'])
    return render_template("video.html", video_file=file_path, video_name=data['video_name'], video_desc=data['video_desc'])


@app.route('/blog/<page>')
def blog_page(page):
    file = '/static/blog/' + page + '.html'
    if file is None:
        return 'test'
    return render_template('blog.html', pdf=page)

@app.route('/test')
def test():
    return 'test123'

if __name__ == '__main__':
    app.run(debug=True)
