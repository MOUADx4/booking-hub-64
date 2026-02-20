<?php

namespace App\Controller\Api;

use App\Entity\Booking;
use App\Repository\BookingRepository;
use App\Repository\ResourceRepository;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/bookings')]
class BookingController extends AbstractController
{
    // ============================
    // ✅ GET MY BOOKINGS (IMPORTANT)
    // ============================
    // ⚠️ MUST BE BEFORE "/{id}"
    #[Route('/me', name: 'api_booking_me', methods: ['GET'])]
    public function myBookings(BookingRepository $repo): JsonResponse
    {
        return $this->json(
            $repo->findBy([
                "user" => $this->getUser()
            ]),
            200,
            [],
            ["groups" => ["booking:read"]]
        );
    }

    // ============================
    // ✅ GET ALL BOOKINGS (Admin/debug)
    // ============================
    #[Route('', name: 'api_booking_list', methods: ['GET'])]
    public function index(BookingRepository $repo): JsonResponse
    {
        return $this->json(
            $repo->findAll(),
            200,
            [],
            ["groups" => ["booking:read"]]
        );
    }

    // ============================
    // ✅ CREATE BOOKING
    // ============================
    #[Route('', name: 'api_booking_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        ResourceRepository $resourceRepo,
        ValidatorInterface $validator
    ): JsonResponse {

        $data = json_decode($request->getContent(), true);

        // ❌ Invalid JSON
        if (!$data) {
            return $this->json([
                "status" => 400,
                "error" => "Invalid JSON body"
            ], 400);
        }

        // ❌ Missing fields
        if (!isset($data['date'], $data['startTime'], $data['endTime'], $data['resource_id'])) {
            return $this->json([
                "status" => 400,
                "error" => "Missing required fields"
            ], 400);
        }

        // ✅ Resource exists?
        $resource = $resourceRepo->find($data['resource_id']);

        if (!$resource) {
            return $this->json([
                "status" => 404,
                "error" => "Resource not found"
            ], 404);
        }

        // ✅ Create Booking
        $booking = new Booking();
        $booking->setDate(new \DateTimeImmutable($data['date']));
        $booking->setStartTime($data['startTime']);
        $booking->setEndTime($data['endTime']);
        $booking->setStatus("pending");

        // ✅ Connected user via JWT
        $booking->setUser($this->getUser());
        $booking->setResource($resource);

        // ✅ Validation
        $errors = $validator->validate($booking);

        if (count($errors) > 0) {

            $messages = [];

            foreach ($errors as $error) {
                $messages[] =
                    $error->getPropertyPath() . " : " . $error->getMessage();
            }

            return $this->json([
                "status" => 400,
                "errors" => $messages
            ], 400);
        }

        // ✅ Save
        $em->persist($booking);
        $em->flush();

        return $this->json(
            $booking,
            201,
            [],
            ["groups" => ["booking:read"]]
        );
    }

    // ============================
    // ✅ GET ONE BOOKING
    // ============================
    #[Route('/{id}', name: 'api_booking_show', methods: ['GET'])]
    public function show(Booking $booking): JsonResponse
    {
        return $this->json(
            $booking,
            200,
            [],
            ["groups" => ["booking:read"]]
        );
    }

    // ============================
    // ✅ UPDATE BOOKING STATUS
    // ============================
    #[Route('/{id}', name: 'api_booking_update', methods: ['PUT'])]
    public function update(
        Booking $booking,
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator
    ): JsonResponse {

        $data = json_decode($request->getContent(), true);

        if (!$data) {
            return $this->json([
                "status" => 400,
                "error" => "Invalid JSON body"
            ], 400);
        }

        // ✅ Update only status
        if (isset($data['status'])) {
            $booking->setStatus($data['status']);
        }

        // ✅ Validation
        $errors = $validator->validate($booking);

        if (count($errors) > 0) {

            $messages = [];

            foreach ($errors as $error) {
                $messages[] =
                    $error->getPropertyPath() . " : " . $error->getMessage();
            }

            return $this->json([
                "status" => 400,
                "errors" => $messages
            ], 400);
        }

        $em->flush();

        return $this->json(
            $booking,
            200,
            [],
            ["groups" => ["booking:read"]]
        );
    }

    // ============================
    // ✅ CANCEL BOOKING
    // ============================
    #[Route('/{id}', name: 'api_booking_cancel', methods: ['DELETE'])]
    public function cancel(
        Booking $booking,
        EntityManagerInterface $em
    ): JsonResponse {

        // ❌ Already cancelled
        if ($booking->getStatus() === "cancelled") {
            return $this->json([
                "status" => 400,
                "error" => "Booking already cancelled"
            ], 400);
        }

        // ✅ Logical cancel
        $booking->setStatus("cancelled");
        $em->flush();

        return $this->json(
            [
                "message" => "Booking cancelled successfully",
                "booking" => $booking
            ],
            200,
            [],
            ["groups" => ["booking:read"]]
        );
    }
}
