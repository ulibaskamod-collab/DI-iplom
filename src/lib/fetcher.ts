export const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error = new Error('Ошибка загрузки данных')
    error.message = await res.text()
    throw error
  }

  return res.json()
}