const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getGenres = async () => {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}genres`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const genresData = await response.json()
  return genresData  
}