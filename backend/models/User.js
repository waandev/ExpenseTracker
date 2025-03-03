const mongoose = require('mongoose');

const bycript = require('bcryptjs');

const userSchema = new mongoose.Schema(
	{
		fullname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		profileImageUrl: { type: String, default: null },
	},
	{ timestamp: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();
	this.password = await bycript.hash(this.password, 10);
	next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bycript.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
