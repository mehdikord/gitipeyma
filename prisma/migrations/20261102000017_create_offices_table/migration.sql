-- CreateTable
CREATE TABLE `offices` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `address` TEXT NOT NULL,
    `phones` JSON NOT NULL,
    `email` VARCHAR(255) NULL,
    `working_hours` VARCHAR(255) NOT NULL,
    `time_zone` VARCHAR(64) NOT NULL,
    `open_hour` TINYINT UNSIGNED NOT NULL,
    `close_hour` TINYINT UNSIGNED NOT NULL,
    `closed_weekdays` JSON NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
