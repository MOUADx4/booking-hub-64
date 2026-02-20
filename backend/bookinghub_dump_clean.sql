SET FOREIGN_KEY_CHECKS=0;

-- Table structure for table `resource`
DROP TABLE IF EXISTS `resource`;
CREATE TABLE `resource` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `capacity` int NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `available` tinyint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `resource` VALUES
(16,'Salle Atlas','room',30,'Salle lumineuse équipée d’un vidéoprojecteur.','12 Rue de la République, 92120 Montrouge, France',1),
(17,'Salle Horizon','room',12,'Petite salle idéale pour réunions rapides.','5 Avenue Jean Jaurès, 92220 Bagneux, France',1),
(18,'Salle Neptune','room',50,'Grande salle de conférence avec sonorisation.','18 Rue du Général Leclerc, 92340 Bourg‑la‑Reine, France',1),
(19,'Salle Pixel','room',20,'Salle moderne avec écran tactile interactif.','27 Rue de Fontenay, 92260 Fontenay‑aux‑Roses, France',1),
(20,'Vidéoprojecteur Epson X200','equipment',1,'Projecteur HD compatible HDMI.','Stock technique – 14 Rue Blanchard, 92220 Bagneux, France',1),
(21,'Kit Micro HF Sennheiser','equipment',1,'Micro sans fil professionnel.','Studio Audio – 3 Rue de la Mairie, 92160 Antony, France',1),
(22,'Ordinateur Portable Dell Latitude','equipment',1,'Laptop i7, 16 Go RAM.','Stock informatique – 22 Rue de l’Avenir, 92320 Châtillon, France',1),
(23,'Caméra Sony A6400','equipment',10,'Caméra 4K pour tournages.','Studio Vidéo – 9 Rue des Écoles, 92140 Clamart, France',1),
(24,'Renault Clio','car',5,'Véhicule compact économique.','Parking P1 – 10 Avenue Henri Barbusse, 92220 Bagneux, France',1),
(25,'Peugeot 3008','car',5,'SUV confortable pour déplacements longs.','Parking P2 – 2 Rue des Meuniers, 92160 Antony, France',1),
(26,'Tesla Model 3','car',5,'Véhicule électrique autonomie 450 km.','Parking Bornes Électriques – 15 Rue de la Gare, 92320 Châtillon, France',1),
(27,'Citroën Berlingo','car',7,'Véhicule utilitaire pour transport de matériel.','Parking P3 – 8 Rue de Verdun, 92140 Clamart, France',1),
(28,'Terrasse Rooftop','space',40,'Espace extérieur pour événements.','Toit – 33 Avenue Aristide Briand, 92160 Antony, France',1),
(29,'Jardin Zen','space',15,'Espace calme pour pauses et réunions informelles.','Cour intérieure – 7 Rue Victor Hugo, 92220 Bagneux, France',1),
(30,'Open Space Nord','space',10,'Zone de coworking modulable.','Bâtiment B – 4 Rue de la Liberté, 92340 Bourg‑la‑Reine, France',1),
(31,'Salle de repos','space',10,'Espace détente avec canapés et machine à café.','Rez‑de‑chaussée – 19 Rue de Sceaux, 92260 Fontenay‑aux‑Roses, France',1);

-- Table structure for table `user`
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user` VALUES
(1,'test@mail.com','["ROLE_ADMIN"]','$2y$13$jk89jxED67MXWiWOk86cTewdixmwmOpU9hDF4Kw5rjOy54VdePGSa','Mouad','2026-02-18 18:09:07'),
(2,'malo@gmail.com','[]','$2y$13$6i9jR3KRnSfrl5y/7icLh.MK9SowU2Xdv4bwFJASqdGNkDgfJCeES','Malo','2026-02-19 17:44:25'),
(3,'user@gmail.com','[]','$2y$13$5mUMwo3fiBAtApybk2hldOeAsi8Kwe99xEXbYTHlYYbnRYwySQhle','user','2026-02-19 23:48:48');

-- Table structure for table `booking`
DROP TABLE IF EXISTS `booking`;
CREATE TABLE `booking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `start_time` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `end_time` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `user_id` int NOT NULL,
  `resource_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_E00CEDDEA76ED395` (`user_id`),
  KEY `IDX_E00CEDDE89329D25` (`resource_id`),
  CONSTRAINT `FK_E00CEDDE89329D25` FOREIGN KEY (`resource_id`) REFERENCES `resource` (`id`),
  CONSTRAINT `FK_E00CEDDEA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `booking` VALUES
(13,'2026-02-17','13:00','18:06','pending','2026-02-19 21:12:57',1,16),
(14,'2026-04-08','09:00','10:00','pending','2026-02-19 23:49:24',3,16),
(15,'2026-04-23','09:00','10:00','pending','2026-02-19 23:49:39',3,21),
(16,'2026-04-19','12:00','20:00','pending','2026-02-19 23:49:59',3,26),
(17,'2026-05-13','09:00','18:00','pending','2026-02-19 23:50:18',3,30);

-- Table structure for table `doctrine_migration_versions`
DROP TABLE IF EXISTS `doctrine_migration_versions`;
CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `doctrine_migration_versions` VALUES
('DoctrineMigrations\\Version20260218172535','2026-02-18 17:25:53',58),
('DoctrineMigrations\\Version20260219160731','2026-02-19 16:07:34',25);

-- Table structure for table `messenger_messages`
DROP TABLE IF EXISTS `messenger_messages`;
CREATE TABLE `messenger_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `body` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `headers` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue_name` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `available_at` datetime NOT NULL,
  `delivered_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750` (`queue_name`,`available_at`,`delivered_at`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS=1;
