<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class ApiController extends AbstractController
{
    #[Route('/api/ping', name: 'api_ping', methods: ['GET'])]
    public function ping(): JsonResponse
    {
        return $this->json([
            "message" => "Backend Symfony fonctionne ✅"
        ]);
    }
    #[Route("/api/me", methods: ["GET"])]
    public function me(): JsonResponse
    {
        return new JsonResponse([
            "message" => "Vous êtes connecté 🔥"
        ]);
    }

}
