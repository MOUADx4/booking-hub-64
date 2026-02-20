<?php

namespace App\Command;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:make-admin',
    description: 'Promote a user to ROLE_ADMIN',
)]
class MakeAdminCommand extends Command
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $em
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addArgument(
            'email',
            InputArgument::REQUIRED,
            'Email of the user to promote as admin'
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $email = $input->getArgument('email');

        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            $io->error("User not found with email: $email");
            return Command::FAILURE;
        }

        // Ajouter ROLE_ADMIN
        $roles = $user->getRoles();

        if (in_array("ROLE_ADMIN", $roles)) {
            $io->warning("User is already admin.");
            return Command::SUCCESS;
        }

        $roles[] = "ROLE_ADMIN";
        $user->setRoles($roles);

        $this->em->flush();

        $io->success("User {$user->getEmail()} is now ROLE_ADMIN ✅");

        return Command::SUCCESS;
    }
}
