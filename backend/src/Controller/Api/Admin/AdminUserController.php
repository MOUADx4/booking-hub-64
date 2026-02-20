<?php

namespace App\Controller\Api\Admin;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/admin/users')]
class AdminUserController extends AbstractController
{
    // ✅ GET ALL USERS (Admin only)
    #[Route('', name: 'api_admin_users', methods: ['GET'])]
    public function list(UserRepository $repo): JsonResponse
    {
        // 🔒 Sécurité : uniquement ADMIN
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        return $this->json(
            $repo->findAll(),
            200,
            [],
            ["groups" => ["user:read"]]
        );
    }
}
