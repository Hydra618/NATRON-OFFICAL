module.exports = {
	bot: {
		token: 'B0T.T0KEN.HERE',
		prefix: '!',
		clientSecret: 'CLIENT_SECRET',
		clientID: 'CLIENT_ID'
	},
	website: {
		protocol: 'https://',
		domain: 'domain.name',
		port: 8080,
		captcha: {
			sitekey: 'SITE_KEY', //you can get this from https://dashboard.hcaptcha.com/sites?page=1
			secretkey: 'SECRET_KEY' //and get this from https://dashboard.hcaptcha.com/settings
		}
	}
};