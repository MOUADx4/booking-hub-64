<?php

namespace App\Entity;

use App\Repository\ResourceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ResourceRepository::class)]
class Resource
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["resource:read", "booking:read"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(["resource:read", "resource:write", "booking:read"])]
    private string $name;

    #[ORM\Column(length: 50)]
    #[Groups(["resource:read", "resource:write"])]
    private string $type;

    #[ORM\Column]
    #[Groups(["resource:read", "resource:write"])]
    private int $capacity;

    #[ORM\Column(length: 255)]
    #[Groups(["resource:read", "resource:write"])]
    private string $location;

    #[ORM\Column(type: "boolean")]
    #[Groups(["resource:read", "resource:write"])]
    private bool $available = true;

    #[ORM\Column(type: "text", nullable: true)]
    #[Groups(["resource:read", "resource:write"])]
    private ?string $description = null;

    public function getId(): ?int { return $this->id; }

    public function getName(): string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }

    public function getType(): string { return $this->type; }
    public function setType(string $type): self { $this->type = $type; return $this; }

    public function getCapacity(): int { return $this->capacity; }
    public function setCapacity(int $capacity): self { $this->capacity = $capacity; return $this; }

    public function getLocation(): string { return $this->location; }
    public function setLocation(string $location): self { $this->location = $location; return $this; }

    public function isAvailable(): bool { return $this->available; }
    public function setAvailable(bool $available): self { $this->available = $available; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): self { $this->description = $description; return $this; }
}
