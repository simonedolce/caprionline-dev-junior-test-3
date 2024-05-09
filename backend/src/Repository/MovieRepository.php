<?php

namespace App\Repository;

use App\Entity\Movie;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Util\Costants;
/**
 * @extends ServiceEntityRepository<Movie>
 *
 * @method Movie|null find($id, $lockMode = null, $lockVersion = null)
 * @method Movie|null findOneBy(array $criteria, array $orderBy = null)
 * @method Movie[]    findAll()
 * @method Movie[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class MovieRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Movie::class);
    }

    //    /**
    //     * @return Movie[] Returns an array of Movie objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('m.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Movie
    //    {
    //        return $this->createQueryBuilder('m')
    //            ->andWhere('m.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    /**
     * @param array $filters
     * @return Movie[]
     */
    public function getAllFilter(array $filters = []): array
    {

        $qb = $this->createQueryBuilder('m');

        if(!is_null($filters[Costants::GENRE_FIELD_NAME])){
            $ids = array_map('intval', explode(',',$filters[Costants::GENRE_FIELD_NAME]));
            $qb->leftJoin('m.movieGenres', 'mg')
            ->andWhere($qb->expr()->in('mg.genre', ':ids'))
                ->setParameter('ids', $ids);
        }

        if(!is_null($filters[Costants::ACTOR_FIELD_NAME])){
            $ids = array_map('intval', explode(',',$filters[Costants::ACTOR_FIELD_NAME]));

            $qb->leftJoin('m.movieActors', 'ma')
            ->andWhere($qb->expr()->in('ma.actor', ':ids'))
                ->setParameter('ids', $ids);
        }

        // Cerco il testo nel titolo del film o nell'associativa MovieKeyword
        if(!is_null($filters[Costants::FILM_NAME_FIELD_NAME])){
            $qb->leftJoin('m.movieKeywords', 'mk');

            $qb->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->like('m.title', ':title'),
                    $qb->expr()->like('mk.keyword', ':title')
                ))
                ->setParameter('title', "%{$filters[Costants::FILM_NAME_FIELD_NAME]}%");
        }

        if(!is_null($filters[Costants::DATE_ORDER])){
            $qb->orderBy('m.releaseDate', $filters[Costants::DATE_ORDER]);
        }

        if(!is_null($filters[Costants::RATING_ORDER])){
            $qb->orderBy('m.rating', $filters[Costants::RATING_ORDER]);
        }

        return $qb->getQuery()->getResult();

    }

}
