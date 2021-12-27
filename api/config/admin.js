module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '27fea70f43964e7c636e76e7c3be5dff'),
  },
});
