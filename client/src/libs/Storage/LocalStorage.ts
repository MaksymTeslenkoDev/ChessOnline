export function getFromLocalStorage(key: string) {
  return localStorage.getItem(key);
}

export function setToLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value);
}
