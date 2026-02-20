<?php

namespace App\Controller\Api\Admin;

use App\Entity\Booking;
use App\Repository\BookingRepository;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/admin/bookings')]
class AdminBookingController extends AbstractController
{
    // ✅ GET ALL BOOKINGS (Admin only)
    #[Route('', name: 'api_admin_bookings', methods: ['GET'])]
    public function list(BookingRepository $repo): JsonResponse
    {
        // 🔒 Admin uniquement
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        return $this->json(
            $repo->findAll(),
            200,
            [],
            ["groups" => ["booking:read"]]
        );
    }

    // ✅ DELETE BOOKING (Admin only)
    #[Route('/{id}', name: 'api_admin_booking_delete', methods: ['DELETE'])]
    public function delete(
        ?Booking $booking,
        EntityManagerInterface $em
    ): JsonResponse {

        // 🔒 Admin uniquement
        $this->denyAccessUnlessGranted('ROLE_ADMIN');

        // ❌ Booking introuvable → 404 propre
        if (!$booking) {
            return $this->json([
                "status" => 404,
                "message" => "Booking not found"
            ], 404);
        }

        // ✅ Suppression SQL
        $em->remove($booking);
        $em->flush();

        return $this->json([
            "status" => 200,
            "message" => "Booking deleted by admin"
        ], 200);
    }
}
