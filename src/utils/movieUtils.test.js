/**
 * UNIT TESTS — movieUtils.js
 *
 * Category: Pure function / logic testing
 * Strategy: Test each utility in isolation with deterministic inputs.
 *           Axios is mocked so no real HTTP calls are made.
 *
 * Covers:
 *  - fetchMovieById: API call construction and error propagation
 *  - processMovieResults: data normalization, fallback poster logic, filtering invalid entries
 *  - extractYears: deduplication, NaN handling, descending sort
 *  - getFilteredMovies: year filtering, five sort modes, immutability guarantee
 */
import axios from 'axios';
import {
  fetchMovieById,
  processMovieResults,
  extractYears,
  getFilteredMovies,
} from './movieUtils';

jest.mock('axios');

describe('fetchMovieById', () => {
  afterEach(() => jest.clearAllMocks());

  it('calls axios with the correct URL and returns data', async () => {
    const mockData = { imdbID: 'tt1234567', Title: 'Test Movie', Response: 'True' };
    axios.get.mockResolvedValue({ data: mockData });

    const result = await fetchMovieById('tt1234567', 'https://www.omdbapi.com/?apikey=test');
    expect(axios.get).toHaveBeenCalledWith('https://www.omdbapi.com/?apikey=test&i=tt1234567');
    expect(result).toEqual(mockData);
  });

  it('throws when the network request fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    await expect(fetchMovieById('tt0000000', 'https://example.com')).rejects.toThrow('Network Error');
  });
});

describe('processMovieResults', () => {
  const validMovie = {
    imdbID: 'tt1234567',
    Title: 'Avengers',
    Year: '2012',
    Genre: 'Action',
    Poster: 'https://example.com/poster.jpg',
    Response: 'True',
  };

  const movieWithNoPoster = {
    ...validMovie,
    imdbID: 'tt7654321',
    Title: 'No Poster Film',
    Poster: 'N/A',
  };

  const failedResponse = {
    Response: 'False',
    Error: 'Movie not found!',
  };

  it('maps OMDb fields to the expected shape', () => {
    const result = processMovieResults([validMovie]);
    expect(result).toEqual([
      {
        id: 'tt1234567',
        title: 'Avengers',
        year: 2012,
        genre: 'Action',
        poster: 'https://example.com/poster.jpg',
      },
    ]);
  });

  it('parses year as an integer', () => {
    const result = processMovieResults([validMovie]);
    expect(typeof result[0].year).toBe('number');
  });

  it('uses fallback poster URL when Poster is "N/A"', () => {
    const result = processMovieResults([movieWithNoPoster]);
    expect(result[0].poster).toContain('tse1.mm.bing.net');
    expect(result[0].poster).toContain(encodeURIComponent('No Poster Film'));
  });

  it('filters out failed API responses', () => {
    const result = processMovieResults([validMovie, failedResponse]);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Avengers');
  });

  it('filters out null/undefined entries', () => {
    const result = processMovieResults([null, undefined, validMovie]);
    expect(result).toHaveLength(1);
  });

  it('returns an empty array when all responses failed', () => {
    const result = processMovieResults([failedResponse, null]);
    expect(result).toEqual([]);
  });
});

describe('extractYears', () => {
  it('calls the setter with deduplicated years sorted descending', () => {
    const mockSetter = jest.fn();
    const movies = [
      { year: 2020 },
      { year: 2018 },
      { year: 2020 },
      { year: 2015 },
    ];

    extractYears(movies, mockSetter);
    expect(mockSetter).toHaveBeenCalledWith([2020, 2018, 2015]);
  });

  it('filters out NaN values', () => {
    const mockSetter = jest.fn();
    const movies = [
      { year: 2022 },
      { year: NaN },
      { year: undefined },
      { year: 2019 },
    ];

    extractYears(movies, mockSetter);
    expect(mockSetter).toHaveBeenCalledWith([2022, 2019]);
  });

  it('handles empty movie list', () => {
    const mockSetter = jest.fn();
    extractYears([], mockSetter);
    expect(mockSetter).toHaveBeenCalledWith([]);
  });

  it('handles a single movie', () => {
    const mockSetter = jest.fn();
    extractYears([{ year: 2023 }], mockSetter);
    expect(mockSetter).toHaveBeenCalledWith([2023]);
  });
});

describe('getFilteredMovies', () => {
  const movies = [
    { id: '1', title: 'Avengers', year: 2012, genre: 'Action' },
    { id: '2', title: 'Batman', year: 2022, genre: 'Action' },
    { id: '3', title: 'Casablanca', year: 1942, genre: 'Drama' },
    { id: '4', title: 'Dune', year: 2021, genre: 'Sci-Fi' },
  ];

  it('returns all movies with default sort and no year filter', () => {
    const result = getFilteredMovies(movies, '', 'default');
    expect(result).toHaveLength(4);
  });

  it('does not mutate the original array', () => {
    const original = [...movies];
    getFilteredMovies(movies, '', 'alphabetical-az');
    expect(movies).toEqual(original);
  });

  describe('year filtering', () => {
    it('filters movies by selected year', () => {
      const result = getFilteredMovies(movies, '2022', 'default');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Batman');
    });

    it('returns empty array when no movies match the year', () => {
      const result = getFilteredMovies(movies, '1999', 'default');
      expect(result).toEqual([]);
    });
  });

  describe('sorting', () => {
    it('sorts alphabetically A-Z', () => {
      const result = getFilteredMovies(movies, '', 'alphabetical-az');
      expect(result.map((m) => m.title)).toEqual(['Avengers', 'Batman', 'Casablanca', 'Dune']);
    });

    it('sorts alphabetically Z-A', () => {
      const result = getFilteredMovies(movies, '', 'alphabetical-za');
      expect(result.map((m) => m.title)).toEqual(['Dune', 'Casablanca', 'Batman', 'Avengers']);
    });

    it('sorts by newest to oldest', () => {
      const result = getFilteredMovies(movies, '', 'newest-to-oldest');
      expect(result.map((m) => m.year)).toEqual([2022, 2021, 2012, 1942]);
    });

    it('sorts by oldest to newest', () => {
      const result = getFilteredMovies(movies, '', 'oldest-to-newest');
      expect(result.map((m) => m.year)).toEqual([1942, 2012, 2021, 2022]);
    });

    it('returns a shuffled array for random sort', () => {
      // Random sort should still return the same items regardless of order
      const result = getFilteredMovies(movies, '', 'random');
      expect(result).toHaveLength(4);
      expect(result.map((m) => m.id).sort()).toEqual(['1', '2', '3', '4']);
    });
  });

  describe('combined filter and sort', () => {
    const extendedMovies = [
      ...movies,
      { id: '5', title: 'Eternals', year: 2021, genre: 'Action' },
    ];

    it('filters by year then sorts alphabetically', () => {
      const result = getFilteredMovies(extendedMovies, '2021', 'alphabetical-az');
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Dune');
      expect(result[1].title).toBe('Eternals');
    });
  });
});
