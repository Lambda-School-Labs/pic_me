const User = require('./model');
const Photo = require('../photos/model')

exports.save = user => {
	return user.save();
};

exports.create = function(info) {
	const user = new User(info);
	return user.save();
};

exports.request = function(parm) {
	if (!parm) return User.find();
	return User.findOne(parm);
};

exports.requestById = _id => {
	return User.findById(_id, (err, user) => {
		if (err) return err;

		return user;
	});
};

exports.update = (_id, user) => {
	return User.findByIdAndUpdate(_id, user, { new: true });
};

exports.delete = _id => {
	return User.findByIdAndRemove({ _id });
};

exports.uploads = _id => {
	return User.findById(_id, 'uploads');
};

<<<<<<< HEAD
exports.collection = _id => {
  return User.findById(_id, 'photos');
=======
exports.collection = function(req, res, next) {
	return User.findById(_id, 'collection');
>>>>>>> 501a24e553a67c847bbdab75dfa6ae79b07e2175
};

exports.list = function(req, res, next) {
	User.find()
		.sort([['lastName', 'ascending']])
		.exec(
			(error, listUsers) =>
				error
					? next(error)
					: res.render('user_list', { title: 'User List', list: listUsers }),
		);
};
<<<<<<< HEAD

exports.photoUploadDelete =  (userid, uploadid) => {
  return User.findById(userid, function(err, user){
    const uploadsAll = user.uploads;
    const uploadsRemoved = uploadsAll.filter(function(item) {
      return item._id != uploadid
    });
    user.uploads = uploadsRemoved
    return User.findByIdAndUpdate(userid, user, {new: true}, function (err, result){
      return result;
    });
  });
};
=======
>>>>>>> 501a24e553a67c847bbdab75dfa6ae79b07e2175
