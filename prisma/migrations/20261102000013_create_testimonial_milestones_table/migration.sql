-- CreateTable
CREATE TABLE `testimonial_milestones` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `testimonial_id` BIGINT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` VARCHAR(500) NULL,
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `testimonial_milestones_testimonial_id_foreign`(`testimonial_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `testimonial_milestones` ADD CONSTRAINT `testimonial_milestones_testimonial_id_foreign` FOREIGN KEY (`testimonial_id`) REFERENCES `testimonials`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
