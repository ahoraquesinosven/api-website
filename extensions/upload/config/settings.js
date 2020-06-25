if (process.env.NODE_ENV === 'production') {
  module.exports = {
    provider: 'google-cloud-storage',
    providerOptions: {
      serviceAccount: process.env.GCS_SERVICE_ACCOUNT,
      bucketName: process.env.GCS_BUCKET_NAME,
      baseUrl: process.env.GCS_BASE_URL,
      basePath: "/",
      publicFiles: true,
    },
  };
} else {
  // to use the default local provider you can return an empty configuration
  module.exports = {};
}
