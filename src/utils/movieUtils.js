import axios from 'axios';

export const fetchMovieById = async (imdbId, BASE_URL) => {
  const response = await axios.get(`${BASE_URL}&i=${imdbId}`);
  return response.data;
};

export const processMovieResults = (movieResults) => {
  return movieResults
    .filter((movie) => movie && movie.Response === "True")
    .map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      year: parseInt(movie.Year),
      genre: movie.Genre,
      poster:
        movie.Poster !== "N/A"
          ? movie.Poster
          : `https://tse1.mm.bing.net/th/id/OIP.tqmQgcjoBxS1v1ZpujoLgAHaHV?rs=1&pid=ImgDetMain&o=7&rm=3${encodeURIComponent(movie.Title)}`,
    }));
};

export const extractYears = (movieList, setAvailableYears) => {
  const years = [...new Set(movieList.map((movie) => movie.year))]
    .filter(year => year && !isNaN(year))
    .sort((a, b) => b - a);
  setAvailableYears(years);
};

export const getFilteredMovies = (movies, selectedYear, currentSort) => {
  let filtered = [...movies];

  if (selectedYear) {
    filtered = filtered.filter(movie => movie.year === parseInt(selectedYear));
  }

  switch (currentSort) {
    case "alphabetical-az":
      return filtered.sort((a, b) => a.title.localeCompare(b.title));
    case "alphabetical-za":
      return filtered.sort((a, b) => b.title.localeCompare(a.title));
    case "newest-to-oldest":
      return filtered.sort((a, b) => b.year - a.year);
    case "oldest-to-newest":
      return filtered.sort((a, b) => a.year - b.year);
    case "random":
      return filtered.sort(() => Math.random() - 0.5);
    default:
      return filtered;
  }
};
