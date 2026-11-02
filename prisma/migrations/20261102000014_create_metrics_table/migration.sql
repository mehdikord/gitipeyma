-- CreateTable
CREATE TABLE `metrics` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `value` VARCHAR(50) NOT NULL,
    `label` VARCHAR(255) NOT NULL,
    `subtext` VARCHAR(255) NULL,
    `trend` VARCHAR(255) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
