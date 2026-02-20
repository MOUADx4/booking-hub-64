<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class AuthMeController extends AbstractController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(Security $security): JsonResponse
    {
        $user = $security->getUser();

        if (!$user) {
            return $this->json([
                "message" => "Non authentifié"
            ], 401);
        }

        return $this->json($user, 200, [], [
            "groups" => ["user:read"]
        ]);
    }
}
