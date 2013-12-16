module.exports = {
  app: {
    port: 4000,
    host: 'localhost:4000'
  },

  auth: {
    ttl: 86400000 * 365, // 1 year
    salt: 'cool'
  },

  store: {
    mongo: {
      host: 'localhost',
      port: 27017,
      maxMillisOnWarn: 5000
    },

    mysql: {
      host: 'localhost',
      port: 3306,
      maxMillisOnWarn: 5000
    }
  },

/*
  googleOAuth: {
    clientId: '669677576804-oiqgaqu5qao3606jlqpjij2vln6l4sh5.apps.googleusercontent.com',
    secret: 'vQbQB798l2q08UmhwfJADzW-',
    contactScope: 'https://www.google.com/m8/feeds',
    redirectUri: 'http://localhost:4000/api/auth/google/oauth2callback'
  },

  facebookOAuth: {
    clientId: '266039076862542',
    secret: '3fc1f4abc2677b1afc5039cf6cda8db3',
    responseType: 'token',
    contactScope: '',
    redirectUri: 'http://localhost:4000/api/auth/facebook/oauthcallback'
  },

  smtp: {
    service: 'Gmail',
    user: 'weddingbot@apricotwhisk.com',
    password: 'ApriC0tWh1sk'
  },

  aws: {
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-west-2',
    sslEnabled: false,
    s3: {
      bucket: 'apricotwhisk.com'
    }
  }
*/

};
