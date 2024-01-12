const url = process.env.NEXT_PUBLIC_API_URL;

export const getGenres = async () => {
  const response = await fetch(`${url}genres`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const genresData = await response.json()
  return genresData  
}