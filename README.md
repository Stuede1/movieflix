# MovieFlix

A responsive movie browsing and discovery application built with React. Search any title, browse curated random picks, view full movie details, and simulate a checkout flow — all powered by the OMDb API.

**Live Demo:** [movieflix-cole-stuedeman.vercel.app](https://movieflix-cole-stuedeman.vercel.app/)

---

## Overview

MovieFlix lets users search the OMDb movie database by title, browse randomly surfaced films by genre, filter and sort results, and click through to a detail-rich checkout page with dynamic pricing. The app is a single-page application with client-side routing via React Router.

---

## Features

- **Live movie search** — queries the OMDb API by title with automatic fallback handling for short or ambiguous search terms
- **Browse mode** — surfaces up to 9 random movies from a rotating pool of genre keywords, with one-click refresh
- **Sort & filter** — sort results by title (A–Z / Z–A) or release year, and filter by year from a dynamically generated dropdown
- **Movie detail & checkout** — full metadata view (plot, director, cast, awards, runtime, IMDb rating with star display) plus quantity selection and dynamically calculated pricing
- **Animated landing page** — scrolling film-reel animation and floating cinema icons built with CSS
- **Example search chips** — one-click suggested searches on the home screen
- **Fallback poster handling** — graceful image fallback for movies with no poster in the API response
- **GitHub Pages deployment** — automated build and deploy with `gh-pages`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Create React App) |
| Language | JavaScript (JSX) |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Styling | Custom CSS |
| Movie Data | OMDb API |
| Deployment | GitHub Pages |

---

## App Routes

| Route | Description |
|---|---|
| `/` | Home page with search bar and animated landing section |
| `/results/:searchTerm` | Search results grid with sort and year filter controls |
| `/browse` | Random movie discovery with refresh button |
| `/checkout/:movieId` | Full movie detail view with purchase sidebar |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Stuede1/movieflix.git
cd movieflix
npm install
```

### Development

```bash
npm start
```

Open [http://localhost:3000/movieflix](http://localhost:3000/movieflix) in your browser.

### Build

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

---

## External API

Movie data is sourced from the [OMDb API](https://www.omdbapi.com/).

| Endpoint | Usage |
|---|---|
| `?s=<title>` | Search movies by title, returns up to 10 results per page |
| `?i=<imdbID>` | Fetch full detail for a single movie by IMDb ID |

---

## Project Structure

```
src/
├── App.js                  # Router setup and route definitions
├── Pages/
│   ├── Home.jsx            # Landing page with search and animation
│   ├── Results.jsx         # Search results with sort and filter
│   ├── Browse.jsx          # Random movie discovery
│   └── Checkout.jsx        # Movie detail and purchase flow
├── utils/
│   └── movieUtils.js       # Shared API helpers and filter/sort logic
├── index.css               # Global styles
└── App.css                 # App-level styles
```

---

## Testing

The project includes a comprehensive test suite built with **Jest** and **React Testing Library**, covering three layers:

| Layer | File | Tests |
|---|---|---|
| Unit | `src/utils/movieUtils.test.js` | 22 |
| Integration | `src/Pages/Results.test.jsx` | 9 |
| Component | `src/Pages/Home.test.jsx` | 14 |

### Run Tests

```bash
npm test
```

### What's Covered

- **Pure utility logic** — `processMovieResults`, `getFilteredMovies`, `extractYears` with edge cases (NaN years, failed responses, empty arrays)
- **Async data fetching** — mocked Axios calls verifying loading spinners, successful renders, API error handling, and network failure states
- **User interactions** — form submission with validation (empty, whitespace, special characters), sort/filter dropdowns, navigation via buttons and links, search chip population

---

## Author

**Cole Stuedeman** — [GitHub](https://github.com/Stuede1) · [LinkedIn](https://www.linkedin.com/in/cole-stuedeman) · [Portfolio](https://colestuedeman.dev)
