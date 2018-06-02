const r = require('../responses');
const message = require('./messages');

/**
 * env config
 * EDITABLE_FIELDS=["firstName","lastName","nickNames"]
 */
const userFieldsEditable = JSON.parse(process.env.EDITABLE_FIELDS);

/**
 * check that both email and password are present
 */
exports.checkEmailAndPassword = (res, email, password) => {
	if (!email && !password) {
		r.send(res, 422, message.emailPasswordNotProvided);
		return;
	}

	if (!email) {
		r.send(res, 422, message.emailNotProvided);
		return;
	}

	if (!password) {
		r.send(res, 422, message.passwordNotProvided);
		return;
	}

	return true;
};

/**
 * check that there is an email or password
 */
exports.checkEmailOrPassword = (res, email, password) => {
	if (!email && !password) {
		r.send(res, 422, message.emailPasswordNotProvided);
		return;
	}

	return true;
};

/**
 * check that there is a first and last name
 */
exports.checkFirstnameAndLastname = (res, firstName, lastName) => {
	if (!firstName && !lastName) {
		r.send(res, 422, message.firstLastNameNotProvided);
		return;
	}

	if (!firstName) {
		r.send(res, 422, message.firstNameNotProvided);
		return;
	}

	if (!lastName) {
		r.send(res, 422, message.lastNameNotProvided);
		return;
	}

	return true;
};

/**
 * check that nickName:
 * - exists
 * - is an Array
 * - doesn't have more than the maximum number of nicknames (see below)
 * - holds variables of type string
 *
 * env config:
 * MAX_NICKNAMES=5
 */
exports.checkNicknames = (res, nickNames) => {
	if (!nickNames) {
		r.send(res, 422, message.nickName.notProvided);
		return;
	}

	if (!Array.isArray(nickNames)) {
		r.send(res, 422, message.nickName.notAnArray);
		return;
	}

	const maxNicknames = process.env.MAX_NICKNAMES;

	if (nickNames.length > maxNicknames) {
		r.send(res, 422, message.nickName.tooManyProvided(nickNames, maxNicknames));
		return;
	}

	for (let i = 0; i < nickNames.length; i++) {
		if (typeof nickNames[i] !== 'string') {
			r.send(res, 422, message.nickName(i, nickNames[i]));
			return;
		}
	}

	return true;
};

/**
 * check if there is a user and
 * check that there is at least one editiable field
 */
exports.checkUser = (res, user) => {
	if (!user) {
		r.send(res, 422, message.userNotProvided);
		return;
	}

	const userKeys = Object.keys(user);

	for (let i = 0; i < userKeys.length; i++) {
		const field = userKeys[i];

		if (userFieldsEditable.includes(field)) {
			return true;
		}
	}

	r.send(res, 422, message.userFieldNoneFound);
};

/**
 * check if there is a change in user info where
 * user is an object
 * with the info to be updated as a prop of said object with a key of `user`
 */
exports.checkForChangedFields = (res, req, user) => {
	const userFields = Object.keys(user);
	let hasChangedField = false;

	for (let i = 0; i < userFields.length; i++) {
		const field = userFields[i];

		/**
		 * because nickNames is an Array,
		 * sort the two Arrays and check stringify'd versions
		 * to see if the nickNames have changed
		 */
		if (field === 'nickNames') {
			if (
				JSON.stringify(user['nickNames'].sort()) !==
				JSON.stringify(req.user['nickNames'].sort())
			) {
				hasChangedField = true;
				break;
			}
		} else if (user[field] !== req.user[field]) {
			hasChangedField = true;
			break;
		}
	}

	if (hasChangedField) {
		return true;
	}

	r.send(res, 422, message.noUserFieldsChanged);
};

/**
 * check if there is a change in settings update where
 * user is an object
 * with the settings to be updated as a prop said object with a key of `user`
 */
exports.checkForChangedSettings = (res, req, user) => {
	const userFields = Object.keys(user);
	let hasChangedField = false;

	/**
	 * first check if there is a password change attempt
	 *
	 * if there is, hash the new password and make sure it is not the same
	 * as the password stored in the database
	 *
	 * the deserialized user in req (via passport) will have this method as
	 * it is an instance of the User model
	 */
	if (userFields.includes('password')) {
		req.user.comparePassword(user.password, (err, isMatch) => {
			if (!isMatch) {
				hasChangedField = true;
			}

			if (err) {
				r.error(res, err, `error checking password for user`);
				return;
			}
		});
	}

	/**
	 * only check more user fields if the password field hasn't been changed
	 * if it has, skip this loop
	 */
	if (!hasChangedField) {
		for (let i = 0; i < userFields.length; i++) {
			const field = userFields[i];

			/**
			 * unhashed passwords and hashed passwords will always be the different,
			 * so don't check password fields for change here
			 * (this was already done above)
			 */
			if (user[field] !== req.user[field] && field !== 'password') {
				hasChangedField = true;
				break;
			}
		}
	}

	if (hasChangedField) {
		return true;
	}

	r.send(res, 422, message.noUserFieldsChanged);
};
