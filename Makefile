upload.zip: manifest.json *.js *.css
	zip $@ $?
