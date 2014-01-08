CREATE TABLE `users` (
  `id` VARCHAR(255) PRIMARY KEY,
  `organizationId` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `email` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255),
  `invitedBy` VARCHAR(255),
  `createdAt` INT(11) UNSIGNED,
  `updatedAt` INT(11) UNSIGNED,
  KEY `organizationId` (`organizationId`),
  UNIQUE KEY `email` (`email`)
)

CREATE TABLE `auths` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `secret` VARCHAR(255) NOT NULL,
  `identifier` VARCHAR(255),
  `salt` VARCHAR(255),
  `createdAt` INT(11) UNSIGNED,
  `updatedAt` INT(11) UNSIGNED,
  KEY `userId` (`userId`)
)

CREATE TABLE `organizations` (
  `id` VARCHAR(255) PRIMARY KEY,
  `name` VARCHAR(255),
  `domain` VARCHAR(255),
  `createdAt` INT(11) UNSIGNED,
  `updatedAt` INT(11) UNSIGNED
)

CREATE TABLE `followers` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `followingUserId` VARCHAR(255) NOT NULL,
  `createdAt` INT(11) UNSIGNED,
  `updatedAt` INT(11) UNSIGNED,
  KEY `userId` (`userId`)
)

CREATE TABLE `assetMetadatas` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255),
  `organizationId` VARCHAR(255),
  `assetHash` VARCHAR(255) NOT NULL,
  `createdAt` INT(11) UNSIGNED,
  `updatedAt` INT(11) UNSIGNED,
  KEY `userId` (`userId`),
  KEY `organizationId` (`organizationId`)
)

CREATE TABLE `assets` (
  `id` VARCHAR(255) PRIMARY KEY,
  `hash` VARCHAR(255) NOT NULL,
  `data` BLOB NOT NULL,
  `createdAt` INT(11) UNSIGNED,
  `updatedAt` INT(11) UNSIGNED,
  UNIQUE KEY `hash` (`hash`)
)

CREATE TABLE `receipts` (
  `id` VARCHAR(255) PRIMARY KEY,
  `userId` VARCHAR(255) NOT NULL,
  `organizationId` VARCHAR(255) NOT NULL,
  `assetMetadatasId` VARCHAR(255) NOT NULL,
  `expenseItemId` VARCHAR(255),
  KEY `userId` (`userId`),
  KEY `organizationId` (`organizationId`),
  KEY `assetMetadatasId` (`assetMetadatasId`),
  KEY `expenseItemId` (`expenseItemId`)
)

CREATE TABLE `expenseItems` (
  `id` VARCHAR(255) PRIMARY KEY

)

CREATE TABLE `expenseReport` (


)

