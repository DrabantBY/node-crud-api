const isValidUrlById = (url: string) => /^\/api\/users\/[\w-]+$/.test(url);

export default isValidUrlById;
