<?php

namespace App\Util;

class Costants
{
    const GENRE_FIELD_NAME = 'genres';
    const ACTOR_FIELD_NAME = 'actors';
    const FILM_NAME_FIELD_NAME = 'filmName';
    const DATE_ORDER = 'dateOrder';
    const RATING_ORDER = 'ratingOrder';
    const MOVIE_FILTER_FIELDS = array(
        self::GENRE_FIELD_NAME => self::GENRE_FIELD_NAME,
        self::ACTOR_FIELD_NAME => self::ACTOR_FIELD_NAME,
        self::FILM_NAME_FIELD_NAME => self::FILM_NAME_FIELD_NAME,
        self::DATE_ORDER => self::DATE_ORDER,
        self::RATING_ORDER => self::RATING_ORDER,
    );

}