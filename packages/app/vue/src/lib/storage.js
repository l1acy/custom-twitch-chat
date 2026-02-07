const getItem = (key, defaultValue) => localStorage.getItem(key) ?? defaultValue

export default getItem