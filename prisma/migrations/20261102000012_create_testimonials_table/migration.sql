-- CreateTable
CREATE TABLE `testimonials` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `service_category_id` BIGINT UNSIGNED NULL,
    `client_name` VARCHAR(255) NOT NULL,
    `service_title` VARCHAR(255) NOT NULL,
    `context` VARCHAR(500) NULL,
    `comment` TEXT NOT NULL,
    `year` VARCHAR(10) NULL,
    `rating` TINYINT UNSIGNED NOT NULL DEFAULT 5,
    `category_label` VARCHAR(255) NULL,
    `verified_code` VARCHAR(255) NULL,
    `outcome_headline` VARCHAR(500) NULL,
    `origin_destination` VARCHAR(255) NULL,
    `tracking_code` VARCHAR(100) NULL,
    `source` ENUM('admin', 'visitor') NOT NULL DEFAULT 'admin',
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `testimonials_service_category_id_foreign`(`service_category_id`),
    INDEX `testimonials_is_published_index`(`is_published`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `testimonials` ADD CONSTRAINT `testimonials_service_category_id_foreign` FOREIGN KEY (`service_category_id`) REFERENCES `service_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
