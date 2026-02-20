<?php

namespace App\Controller\Api;

use App\Entity\Resource;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/resources')]
class ResourceController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $resources = $em->getRepository(Resource::class)->findAll();

        return $this->json($resources, 200, [], [
            'groups' => 'resource:read'
        ]);
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $resource = new Resource();
        $resource->setName($data['name']);
        $resource->setType($data['type']);
        $resource->setCapacity($data['capacity']);
        $resource->setLocation($data['location']);
        $resource->setAvailable($data['available'] ?? true);
        $resource->setDescription($data['description'] ?? null);

        $em->persist($resource);
        $em->flush();

        return $this->json($resource, 201, [], [
            'groups' => 'resource:read'
        ]);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(Resource $resource): JsonResponse
    {
        return $this->json($resource, 200, [], [
            'groups' => 'resource:read'
        ]);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(Resource $resource, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) $resource->setName($data['name']);
        if (isset($data['type'])) $resource->setType($data['type']);
        if (isset($data['capacity'])) $resource->setCapacity($data['capacity']);
        if (isset($data['location'])) $resource->setLocation($data['location']);
        if (isset($data['available'])) $resource->setAvailable($data['available']);
        if (array_key_exists('description', $data)) $resource->setDescription($data['description']);

        $em->flush();

        return $this->json($resource, 200, [], [
            'groups' => 'resource:read'
        ]);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(Resource $resource, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($resource);
        $em->flush();

        return $this->json(["message" => "Resource deleted"]);
    }
}
