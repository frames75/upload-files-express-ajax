var express = require('express');
var router 	= express.Router();
var path 	= require('path');
var multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/uploads/');
    },
    filename: function (req, file, callback) {
        callback(null, 
            Date.now() + '_' + 
            path.extname(file.originalname));
    }
});
const upload = multer({ storage : storage }).array('up_files');

//*** Upload files without configuring their names ***
//const upload = multer({ dest: 'public/uploads/' });

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

router.post('/upload', upload, function (req, res, next) {
	// Up to now, files are being uploaded by 'upload'(multer) middleware.
	// Hearon, send only image files to the client.
	const img_exts = ['.png', '.jpg', '.gif'];

	const img_files = req.files
	.map( (file) => { 	// Remove 'public/' from path
		file.path = file.path.slice(7);
		return file;
	}).filter( (file) => {	// Filter only image files
		return img_exts.find( ext =>
			ext.toUpperCase() === path.extname(file.originalname).toUpperCase()
		);
	});

	res.send(img_files);
});

module.exports = router;
