module.exports = {
	reactStrictMode: false,
	webpack: (config) => {
	  config.resolve.fallback = { fs: false, net: false, tls: false };
	  return config;
	},
  };
  