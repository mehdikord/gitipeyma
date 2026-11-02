-- CreateTable
CREATE TABLE `services` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `service_category_id` BIGINT UNSIGNED NOT NULL,
    `service_group_id` BIGINT UNSIGNED NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `short_title` VARCHAR(255) NOT NULL,
    `category_label` VARCHAR(255) NULL,
    `eyebrow` VARCHAR(255) NULL,
    `summary` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `content` TEXT NULL,
    `image` VARCHAR(500) NULL,
    `icon` VARCHAR(50) NULL,
    `badge` VARCHAR(255) NULL,
    `is_highlighted` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `services_service_category_id_foreign`(`service_category_id`),
    INDEX `services_service_group_id_foreign`(`service_group_id`),
    UNIQUE INDEX `services_slug_unique`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_service_category_id_foreign` FOREIGN KEY (`service_category_id`) REFERENCES `service_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_service_group_id_foreign` FOREIGN KEY (`service_group_id`) REFERENCES `service_groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
