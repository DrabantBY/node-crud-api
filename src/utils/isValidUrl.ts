const isValidUrl = (url: string) => /^\/api\/users\/?$/.test(url);

export default isValidUrl;
