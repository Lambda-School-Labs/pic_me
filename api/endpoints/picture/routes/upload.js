const router = require('express').Router();

/**
 * models
 */
const image = require('../../../photos/model');
const user = require('../../../users/model');

/**
 * photo model helper
 */
const { upload } = require('../../../photos/transform');

/**
 * controller that interacts with the users table in database
 */
const userCTR = require('../../../users/controller');

/**
 * controller that interacts with the photos table in database
 */
const photoCTR = require('../../../photos/controller');

/**
 * general helper functions for all api endpoints
 */
const authenticate = require('../../../helpers/authenticate');
const r = require('../../../helpers/responses');
const sanitize = require('../../../helpers/sanitize');

/**
 * /api/pictures/upload
 * - POST: saves photos to photos database
 */
router
	.route('/')

	/**
	 * POST /api/pictures/upload
	 *
	 * saves photos to photos database
	 */
	.post(authenticate.sid, upload.array('images'), (req, res) => {
		const uploaded = req.files;
		const ownerId = req.user.id;
		console.log('in /upload');

		const uploadedImages = uploaded.map((i, idx) => {
			let newImage = {};
			// console.log(req.body.tags);
			console.log('Tags =>', req.body.tags);
			newImage.tags = JSON.parse(req.body.tags);
			newImage.url = i.transforms[0].location;
			newImage.owner = req.user.id;
			console.log('newimage', newImage);
			return newImage;
		});

		image.insertMany(uploadedImages, function(error, docs) {
			if (error) {
				r.send(res, 500, { error, message: 'failed to save images' });
				return;
			}

			const pictureIds = [];
			docs.forEach(image => {
				// console.log('Image obj:', image);
				pictureIds.push(image._id);
			});

			console.log('pciture ids', pictureIds);
			console.log('fpciture ids 0', pictureIds[0]);
			console.log('typeofpciture ids', typeof pictureIds[0]);

			user
				.findOneAndUpdate(
					{ _id: ownerId },
					{ $push: { uploads: pictureIds } },
					{ new: true },
				)
				.then(editedUser => r.send(res, 200, sanitize.response(editedUser)))
				.catch(err =>
					r.send(res, 500, { err, message: `server failed to edit user` }),
				);
		});
		// const uploaded = req.files;
		// uploaded.forEach(i => {
		// 	let newImage = new image();
		// 	// using shift() to make postman associate proper tags with image instead
		// 	// of just appending all tags from uploads as an array for each upload
		// 	newImage.tags = req.body.tags.shift();
		// 	newImage.url = i.transforms[0].location;
		// 	newImage.save();
		// });
		// // res.json(`Uploaded ${req.files.length} files!`);
		// res.send();
	});

module.exports = router;