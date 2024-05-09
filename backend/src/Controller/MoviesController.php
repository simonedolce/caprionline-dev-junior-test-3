<?php

namespace App\Controller;

use App\Repository\ActorRepository;
use App\Repository\GenreRepository;
use App\Repository\MovieRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Util\Costants;

class MoviesController extends AbstractController
{
    public function __construct(
        private MovieRepository $movieRepository,
        private GenreRepository $genreRepository,
        private ActorRepository $actorRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/movies', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $filters = array(
            Costants::GENRE_FIELD_NAME => null,
            Costants::ACTOR_FIELD_NAME => null,
            Costants::FILM_NAME_FIELD_NAME => null,
            Costants::DATE_ORDER => null,
            Costants::RATING_ORDER => null
        );

        foreach (Costants::MOVIE_FILTER_FIELDS as $fieldName) {
            if($request->query->get($fieldName)){
                $filters[$fieldName] = $request->query->get($fieldName);
            }
        }

        $movies = $this->movieRepository->getAllFilter($filters);
        $data = $this->getSerializer($movies);

        return new JsonResponse($data, json: true);
    }

    /**
     * @return JsonResponse
     * Api per il fetch dei generi
     */
    #[Route('/genres', methods: ['GET'])]
    public function listGenres(): JsonResponse
    {
        $genres = $this->genreRepository->findBy(array(), array('name' => 'ASC'));
        $data = $this->getSerializer($genres);
        return new JsonResponse($data, json: true);
    }

    /**
     * @return JsonResponse
     * Api per il fetch degli attori
     */
    #[Route('/actors', methods: ['GET'])]
    public function listActors(): JsonResponse
    {
        $actors = $this->actorRepository->findBy(array(), array('name' => 'ASC'));
        $data = $this->getSerializer($actors);
        return new JsonResponse($data, json: true);
    }


    private function getSerializer($data): string
    {
        return $this->serializer->serialize($data , "json", ["groups" => 'default']);
    }
}
