upload.zip: manifest.json *.js *.css *.png
	zip $@ $?
