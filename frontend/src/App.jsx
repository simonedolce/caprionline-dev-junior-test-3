import React, { useEffect, useState } from 'react';
import { Button, Rating, Spinner } from 'flowbite-react';

const App = props => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const host = 'http://localhost:8000/';
  const endPoints = {
      getMovies : 'movies',
      getGenres : 'genres'
  };

  const fetchMovies = () => {
    setLoading(true);

    return fetch(host + endPoints.getMovies)
      .then(response => response.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      });
  }

  const fetchGenres = () => {
      return fetch(host + endPoints.getGenres)
          .then(response => response.json())
          .then(data => {
              setGenres(data)
          });
  }

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);

  return (
    <Layout>
      <Heading />

      <Filters genres={genres}></Filters>
      <MovieList loading={loading}>
        {movies.map((item, key) => (
          <MovieItem key={key} {...item} />
        ))}
      </MovieList>
    </Layout>
  );
};

const FilterGenre = props => {
    return (
        <div className="mr-4">
            <label htmlFor="category" className="block font-light text-gray-500 text-sm dark:text-gray-400">Genre</label>
            <select id="category"  className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500">
                {props.genres.map((item, key) => (
                    <OptionGenre key={key} {...item} />
                ))}
            </select>
        </div>
    );
}

const Filters = props => {
    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <p className="text-center font-light text-gray-500 sm:text-xl dark:text-gray-400">
                    Filters
                </p>
                <div className="flex">
                    <FilterGenre genres={props.genres}></FilterGenre>
                </div>
            </div>
        </div>
    );
};

const OptionGenre = props => {
    return (
        <option value={props.id}>{props.name}</option>
    );

}

const Layout = props => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        {props.children}
      </div>
    </section>
  );
};

const Heading = props => {
  return (
    <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
      <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
        Movie Collection
      </h1>

      <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
        Explore the whole collection of movies
      </p>
    </div>
  );
};

const MovieList = props => {
  if (props.loading) {
    return (
      <div className="text-center">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-y-8 xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3">
      {props.children}
    </div>
  );
};

const MovieItem = props => {
  return (
    <div className="flex flex-col w-full h-full rounded-lg shadow-md lg:max-w-sm">
      <div className="grow">
        <img
          className="object-cover w-full h-60 md:h-80"
          src={props.imageUrl}
          alt={props.title}
          loading="lazy"
        />
      </div>

      <div className="grow flex flex-col h-full p-3">
        <div className="grow mb-3 last:mb-0">
          {props.year || props.rating
            ? <div className="flex justify-between align-middle text-gray-900 text-xs font-medium mb-2">
                <span>{props.year}</span>

                {props.rating
                  ? <Rating>
                      <Rating.Star />

                      <span className="ml-0.5">
                        {props.rating}
                      </span>
                    </Rating>
                  : null
                }
              </div>
            : null
          }

          <h3 className="text-gray-900 text-lg leading-tight font-semibold mb-1">
            {props.title}
          </h3>

          <p className="text-gray-600 text-sm leading-normal mb-4 last:mb-0">
            {props.plot.substr(0, 80)}...
          </p>
        </div>

        {props.wikipediaUrl
          ? <Button
              color="light"
              size="xs"
              className="w-full"
              onClick={() => window.open(props.wikipediaUrl, '_blank')}
            >
              More
            </Button>
          : null
        }
      </div>
    </div>
  );
};

export default App;
