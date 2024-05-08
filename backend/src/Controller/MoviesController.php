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
            Costants::GENRE_FIELD_NAME => array(),
            Costants::ACTOR_FIELD_NAME => array(),
            Costants::FILM_NAME_FIELD_NAME => null,
            Costants::DATE_ORDER => '',
            Costants::RATING_ORDER => ''
        );

        foreach (Costants::MOVIE_FILTER_FIELDS as $fieldName) {
            if($request->query->get($fieldName)){
                $filters[$fieldName] = $request->query->get($fieldName);
            }
        }

        $movies = $this->movieRepository->findAll();
        $data = $this->getSerializer($movies, 'default');

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
        $data = $this->getSerializer($genres,'default');
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
        $data = $this->getSerializer($actors,'default');
        return new JsonResponse($data, json: true);
    }


    private function getSerializer($data, $group): string
    {
        return $this->serializer->serialize($data , "json", ["groups" => $group]);
    }
}
