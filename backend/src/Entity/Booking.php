<?php

namespace App\Entity;

use App\Repository\BookingRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: BookingRepository::class)]
class Booking
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["booking:read"])]
    private ?int $id = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    #[Groups(["booking:read", "booking:write"])]
    #[Assert\NotNull]
    private ?\DateTimeImmutable $date = null;

    #[ORM\Column(length: 10)]
    #[Groups(["booking:read", "booking:write"])]
    #[Assert\NotBlank]
    private ?string $startTime = null;

    #[ORM\Column(length: 10)]
    #[Groups(["booking:read", "booking:write"])]
    #[Assert\NotBlank]
    private ?string $endTime = null;

    #[ORM\Column(length: 20)]
    #[Groups(["booking:read"])]
    private string $status = "pending";

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    #[Groups(["booking:read"])]
    private \DateTimeImmutable $createdAt;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["booking:read"])]
    private ?User $user = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(["booking:read"])]
    private ?Resource $resource = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }
    public function getDate(): ?\DateTimeImmutable { return $this->date; }
    public function setDate(\DateTimeImmutable $date): static
    {
        $this->date = $date;
        return $this;
    }

    public function getStartTime(): ?string { return $this->startTime; }
    public function setStartTime(string $startTime): static
    {
        $this->startTime = $startTime;
        return $this;
    }

    public function getEndTime(): ?string { return $this->endTime; }
    public function setEndTime(string $endTime): static
    {
        $this->endTime = $endTime;
        return $this;
    }

    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): static
    {
        $this->status = $status;
        return $this;
    }

    public function getUser(): ?User { return $this->user; }
    public function setUser(User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getResource(): ?Resource { return $this->resource; }
    public function setResource(Resource $resource): static
    {
        $this->resource = $resource;
        return $this;
    }
}
