// On EAS, google-services.json comes from the GOOGLE_SERVICES_JSON file environment
// variable, so the file stays out of this public repository.
module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
  },
});
