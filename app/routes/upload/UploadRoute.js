const express = require ('express');
const router = express.Router ();
const uploadCtrl = require ('../../controller/upload/UploadController');
const multer = require ('multer');
const path = require ('path');
const fs = require ('fs');

// Storage config for /photo
const uploadStoragePhoto = multer.diskStorage ({
  destination: './uploads/photo',
  filename: function (req, file, cb) {
    cb (null, Date.now () + path.extname (file.originalname));
  },
});

const uploadStorageVideo = multer.diskStorage ({
  destination: './uploads/video',
  filename: function (req, file, cb) {
    cb (null, Date.now () + path.extname (file.originalname));
  },
});

const uploadPhoto = multer ({
  storage: uploadStoragePhoto,
  limits: {fileSize: 3 * 1024 * 1024},
});

const uploadVideo = multer ({
  storage: uploadStorageVideo,
  limits: {fileSize: 20 * 1024 * 1024},
});

const fileFilter = (req, file, cb) => {
  const fileTypes = ['image/jpeg', 'image/png', 'image/gif','video/mp4', 'video/mkv', 'video/avi'];
  if (fileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type.'));
  }
};

// Multer configuration
const uploadMixed = multer({
  storage: uploadStoragePhoto,

  limits: { fileSize: 30 * 1024 * 1024 }, // Limit size to 10 MB
  fileFilter,
});


router.post ('/photo/new', uploadPhoto.single ('file'), uploadCtrl.UploadPhoto);
router.post ('/video/new', uploadVideo.single ('file'), uploadCtrl.UploadVideo);

router.post (
  '/photos/new',
  uploadPhoto.array ('files', 10),
  uploadCtrl.UploadPhotos
);
router.post (
  '/videos/new',
  uploadVideo.array ('files', 2),
  uploadCtrl.UploadVideos
);

router.post (
  '/mixed',
  uploadMixed.fields ([
    {name: 'files', maxCount: 4},
  ]),
  uploadCtrl.uploadMixedFiles
);

router.get('/logs', uploadCtrl.Logs);
router.get('/logd', uploadCtrl.LogsD);

router.post('/csv/business',uploadPhoto.single('file'), uploadCtrl.ImportBusinessCSV);
router.get('/progress', uploadCtrl.getProgress);


module.exports = router;