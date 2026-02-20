<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: "UNIQ_IDENTIFIER_EMAIL", fields: ["email"])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(["booking:read", "user:read"])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(["booking:read", "user:read"])]
    private ?string $email = null;

    /**
     * @var list<string>
     */
    #[ORM\Column]
    #[Groups(["user:read"])]
    private array $roles = [];

    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 100)]
    #[Groups(["booking:read", "user:read"])]
    private ?string $name = null;

    #[ORM\Column]
    #[Groups(["user:read"])]
    private ?\DateTimeImmutable $createdAt = null;

    /**
     * ⚠️ IMPORTANT : PAS DE GROUPS ICI
     * Sinon boucle infinie User → Booking → User → Booking...
     *
     * @var Collection<int, Booking>
     */
    #[ORM\OneToMany(targetEntity: Booking::class, mappedBy: "user")]
    private Collection $bookings;

    public function __construct()
    {
        $this->bookings = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    // =======================
    // GETTERS / SETTERS
    // =======================

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    /**
     * Identifiant principal (email)
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;

        // Chaque user a au minimum ROLE_USER
        $roles[] = "ROLE_USER";

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    /**
     * Vérifie si l'utilisateur est admin
     */
    public function isAdmin(): bool
    {
        return in_array("ROLE_ADMIN", $this->roles);
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    /**
     * Symfony 7.3+ : évite de stocker le vrai hash dans la session
     */
    public function __serialize(): array
    {
        $data = (array) $this;
        $data["\0" . self::class . "\0password"] = hash("crc32c", $this->password);

        return $data;
    }

    public function eraseCredentials(): void
    {
        // Rien à effacer ici
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    /**
     * @return Collection<int, Booking>
     */
    public function getBookings(): Collection
    {
        return $this->bookings;
    }

    public function addBooking(Booking $booking): static
    {
        if (!$this->bookings->contains($booking)) {
            $this->bookings->add($booking);
            $booking->setUser($this);
        }

        return $this;
    }

    public function removeBooking(Booking $booking): static
    {
        if ($this->bookings->removeElement($booking)) {
            if ($booking->getUser() === $this) {
                $booking->setUser(null);
            }
        }

        return $this;
    }
}
