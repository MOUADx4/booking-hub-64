<?php

namespace App\Controller\Api;

use App\Entity\Resource;
use App\Repository\ResourceRepository;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route("/api/admin/resources")]
class AdminResourceController extends AbstractController
{
    #[Route("", name: "api_admin_resource_list", methods: ["GET"])]
    public function index(ResourceRepository $repo): JsonResponse
    {
        return $this->json(
            $repo->findAll(),
            200,
            [],
            ["groups" => ["resource:read"]]
        );
    }

    // 🔥 Normalisation des types venant du frontend
    private function normalizeType(string $type): string
    {
        return match (strtolower($type)) {
            "salle" => "room",
            "équipement" => "equipment",
            "equipement" => "equipment",
            "voiture" => "car",
            "espace" => "space",
            default => $type,
        };
    }

    #[Route("", name: "api_admin_resource_create", methods: ["POST"])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator
    ): JsonResponse {

        $data = json_decode($request->getContent(), true);

        // 🔥 Correction : on vérifie que c'est bien un tableau
        if (!is_array($data)) {
            return $this->json([
                "status" => 400,
                "error" => "Invalid JSON body"
            ], 400);
        }

        $resource = new Resource();

        // 🔥 Gestion propre des champs vides
        $resource->setName($data["name"] ?? "");

        $resource->setType(
            isset($data["type"]) ? $this->normalizeType($data["type"]) : "room"
        );

        $resource->setCapacity(
            isset($data["capacity"]) && $data["capacity"] !== ""
                ? (int) $data["capacity"]
                : 1
        );

        $resource->setLocation(
            isset($data["location"]) ? $data["location"] : ""
        );

        $resource->setDescription(
            array_key_exists("description", $data)
                ? ($data["description"] !== "" ? $data["description"] : null)
                : null
        );

        $resource->setAvailable(
            isset($data["available"]) ? (bool) $data["available"] : true
        );

        // Validation
        $errors = $validator->validate($resource);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[] = $error->getPropertyPath() . " : " . $error->getMessage();
            }
            return $this->json(["errors" => $messages], 400);
        }

        $em->persist($resource);
        $em->flush();

        return $this->json($resource, 201, [], ["groups" => ["resource:read"]]);
    }

    #[Route("/{id}", name: "api_admin_resource_update", methods: ["PUT"])]
    public function update(
        Resource $resource,
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator
    ): JsonResponse {

        $data = json_decode($request->getContent(), true);

        // 🔥 Correction ici aussi
        if (!is_array($data)) {
            return $this->json(["error" => "Invalid JSON body"], 400);
        }

        if (isset($data["name"])) {
            $resource->setName($data["name"]);
        }

        if (isset($data["type"])) {
            $resource->setType($this->normalizeType($data["type"]));
        }

        if (isset($data["capacity"])) {
            $resource->setCapacity(
                $data["capacity"] !== "" ? (int) $data["capacity"] : 1
            );
        }

        if (array_key_exists("description", $data)) {
            $resource->setDescription(
                $data["description"] !== "" ? $data["description"] : null
            );
        }

        if (isset($data["location"])) {
            $resource->setLocation($data["location"]);
        }

        if (isset($data["available"])) {
            $resource->setAvailable((bool) $data["available"]);
        }

        // Validation
        $errors = $validator->validate($resource);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[] = $error->getPropertyPath() . " : " . $error->getMessage();
            }
            return $this->json(["errors" => $messages], 400);
        }

        $em->flush();

        return $this->json($resource, 200, [], ["groups" => ["resource:read"]]);
    }

    #[Route("/{id}", name: "api_admin_resource_delete", methods: ["DELETE"])]
    public function delete(Resource $resource, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($resource);
        $em->flush();

        return $this->json(["message" => "Resource deleted successfully"], 200);
    }
}
