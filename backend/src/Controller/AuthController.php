<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AuthController extends AbstractController
{
    #[Route('/api/auth/register', name: 'api_register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {

        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'], $data['name'])) {
            return new JsonResponse(["error" => "Missing fields"], 400);
        }

        $existing = $em->getRepository(User::class)
            ->findOneBy(['email' => $data['email']]);

        if ($existing) {
            return new JsonResponse(["error" => "Email already exists"], 409);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setName($data['name']);

        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        $em->persist($user);
        $em->flush();

        return new JsonResponse([
            "message" => "User registered successfully"
        ], 201);
    }
}
