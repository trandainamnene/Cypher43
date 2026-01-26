const multer = require('multer');
const path = require('path');
const ImageKit = require('imagekit');

// Custom ImageKit Storage Engine
class ImageKitStorage {
    constructor(options) {
        this.options = options || {};
        this.imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });
    }

    _handleFile(req, file, cb) {
        // Collect stream data
        const chunks = [];
        file.stream.on('data', (chunk) => {
            chunks.push(chunk);
        });

        file.stream.on('end', () => {
            const buffer = Buffer.concat(chunks);

            this.imagekit.upload({
                file: buffer,
                fileName: file.originalname,
                folder: this.options.folder || 'cypher43',
                // Optional: Extensions validation is done by fileFilter below
            }, (err, result) => {
                if (err) {
                    return cb(err);
                }
                // Multer expects `path` to be present for some integrations, or at least we provide it for consistency
                cb(null, {
                    path: result.url, // Map URL to path so controllers work without change
                    url: result.url,
                    size: result.size,
                    filename: result.name,
                    fileId: result.fileId
                });
            });
        });

        file.stream.on('error', (err) => cb(err));
    }

    _removeFile(req, file, cb) {
        // Optional: Implement delete logic if needed
        cb(null);
    }
}

let storage;

// Check for ImageKit Configuration
const hasImageKitConfig = process.env.IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.IMAGEKIT_URL_ENDPOINT &&
    !process.env.IMAGEKIT_PUBLIC_KEY.includes('your_public_key');

if (hasImageKitConfig) {
    // Use ImageKit Storage
    storage = new ImageKitStorage({
        folder: 'cypher43'
    });
    console.log('✅ Using ImageKit Storage for uploads');
} else {
    // Fallback to Local Storage
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });
    console.log('⚠️ Using Local Storage for uploads (ImageKit config missing or invalid)');
}

// File Filter (Images Only)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB Limit
    }
});

module.exports = upload;
