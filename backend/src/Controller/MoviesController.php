<?php

namespace App\Controller;

use App\Repository\GenreRepository;
use App\Repository\MovieRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class MoviesController extends AbstractController
{
    public function __construct(
        private MovieRepository $movieRepository,
        private GenreRepository $genreRepository,
        private SerializerInterface $serializer
    ) {}

    #[Route('/movies', methods: ['GET'])]
    public function list(): JsonResponse
    {
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
        $genres = $this->genreRepository->findAll();
        $data = $this->getSerializer($genres,'default');
        return new JsonResponse($data, json: true);
    }

    private function getSerializer($data, $group): string
    {
        return $this->serializer->serialize($data , "json", ["groups" => $group]);
    }
}
