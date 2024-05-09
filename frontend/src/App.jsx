import React, { useEffect, useState } from 'react';
import { Button, Rating, Spinner } from 'flowbite-react';

const App = props => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [actors,setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
      genres: [],
      actors: [],
      filmName: '',
      dateOrder: '',
      ratingOrder: ''
  });

  const host = 'http://localhost:8000/';
  const endPoints = {
      getMovies : 'movies',
      getGenres : 'genres',
      getActors : 'actors'
  };

  const fetchFromServer = (endpoint, params= null) => {
      const url = new URL(host + endpoint);

      if(params) {
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      }

      return fetch(url)
          .then(response => response.json());
  }
  function debounce(func, timeout = 500) {
      let timer;
      return (...args) => {
          clearTimeout(timer);
          timer = setTimeout(() => {
              func.apply(this, args);
          }, timeout);
      };
  }
  const fetchMovies = () => {
      setLoading(true);
      return fetchFromServer(endPoints.getMovies,formData).then(data => {
          setMovies(data);
          setLoading(false);
      });
  }
  const fetchGenres = () => {
      return fetchFromServer(endPoints.getGenres).then(data => {
          setGenres(data)
      });
  }
  const fetchActors = () => {
      return fetchFromServer(endPoints.getActors).then(data => {
          setAuthors(data)
      });
  }

  const handleChanges = debounce((e) => {
      const { name, value, type, options } = e.target;
      let changes;

      if(type === 'select-multiple') {
        let changes = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.id);

        setFormData(prevData => ({
            ...prevData,
            [name]: changes
        }));

      } else {
          changes = value;
          setFormData(prevData => ({
              ...prevData,
              filmName: changes
          }));
      }
  });
  const handleOrders = e => {
      const {name} = e.target;
      let value;
      if(name === 'dateOrder'){
          value = formData.dateOrder === 'ASC' ? 'DESC' : 'ASC';
          setFormData(prevData => ({
              ...prevData,
              ratingOrder: ''
          }));
      } else {
          value = formData.ratingOrder === 'ASC' ? 'DESC' : 'ASC';
          setFormData(prevData => ({
              ...prevData,
              dateOrder: ''
          }));
      }

      setFormData(prevData => ({
          ...prevData,
          [name]: value
      }));
  };

  useEffect(() => {
    fetchMovies();
  }, [formData]);

  useEffect(() => {
      fetchGenres();
      fetchActors();
  }, []);

  return (
    <Layout>
      <Heading />

      <Filters onOrdersChange={handleOrders} onChange={handleChanges} form={formData} genres={genres} actors={actors}></Filters>
      <MovieList loading={loading}>
        {movies.map((item, key) => (
          <MovieItem key={key} {...item} />
        ))}
      </MovieList>
    </Layout>
  );
};

const Filters = ({ onOrdersChange, onChange, form, genres , actors }) => {
    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <p className="text-center font-light text-gray-500 sm:text-xl dark:text-gray-400">
                    Filters
                </p>
                <div className="p-4">
                    <FilterGenre  onChange={onChange} genres={genres}></FilterGenre>
                    <FilterActors onChange={onChange} actors={actors}></FilterActors>
                    <FilterName onChange={onChange} value={form.filmName}></FilterName>
                </div>
                <div className="flex p-4 space-x-4">
                    <OrderButton name='dateOrder' onClick={onOrdersChange} text={`📅 ${form.dateOrder === 'ASC' ? '🔼' : '🔽'}`}></OrderButton>
                    <OrderButton name='ratingOrder' onClick={onOrdersChange} text={`⭐ ${form.ratingOrder === 'ASC' ? '🔼' : '🔽'}`}></OrderButton>
                </div>
            </div>
        </div>
    );
};

const OrderButton = props => {
    return (
        <button name={props.name} onClick={props.onClick} className="bg-black hover:bg-gray-600 text-white font-light py-2 px-4 rounded">{props.text}</button>
    );
}

const FilterGenre = props => {
    return (
        <div className="bg-gray-100 p-4">
            <Select nameProp={'genres'} onChange={props.onChange} name={'genre'} label='Genre' list={props.genres}></Select>
        </div>
    );
}

const FilterActors = props => {
    return (
        <div className="bg-gray-100 p-4">
            <Select nameProp={'actors'} onChange={props.onChange} label='Actors' list={props.actors}></Select>
        </div>
    );
}

const FilterName = props => {
    return (
        <div className="bg-gray-100 p-4">
            <label className="block mb-2 text-sm font-light text-gray-900 dark:text-white">Film Name (or keywords)</label>
            <input name='name' onChange={props.onChange} type="text" className="rounded" placeholder="ex: The Godfather"/>
        </div>
    );
}

const Select = props => {
    return (
        <div className="mr-4">
            <label className="block mb-2 text-sm font-light text-gray-900 dark:text-white">{props.label}</label>
            <select name={props.nameProp} value={props.value} onChange={props.onChange} multiple className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                {props.list.map((item) => (
                    <Option key={item.id} value={item.id} text={item.name}/>
                ))}
            </select>
        </div>
    );
}

const Option = props => {
    return (
        <option id={props.value}> {props.text} </option>
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
