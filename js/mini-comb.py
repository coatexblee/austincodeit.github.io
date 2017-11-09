from jsmin import jsmin
import shutil

filesToMinify = ['route-app','custom-script','load-task-list','print-pdf']

for filename in filesToMinify:
	newName = filename+'.min.js'
	print newName+" minified..."
	with open(filename+'.js') as js_file:
		f = open(newName,"w+")
		minified = jsmin(js_file.read())
		f.write(minified)
		f.close()


minifiedJs = ['route-app.min.js','custom-script.min.js','load-task-list.min.js','print-pdf.min.js']

with open('combined_js.js','wb') as wfd:
    for f in minifiedJs:
        with open(f,'rb') as fd:
            shutil.copyfileobj(fd, wfd, 1024*1024*10)
