CREATE TABLE `users` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255),
  `email` VARCHAR(255),
  `role` VARCHAR(255),
  UNIQUE KEY `email` (`email`)
)

CREATE TABLE `auths` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255),
  `type` VARCHAR(255),
  `secret` VARCHAR(255),
  `identifier` VARCHAR(255),
  `salt` VARCHAR(255),
  KEY `userId` (`userId`)
)
