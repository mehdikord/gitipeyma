-- CreateTable
CREATE TABLE `service_request_notes` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `service_request_id` BIGINT UNSIGNED NOT NULL,
    `admin_id` BIGINT UNSIGNED NULL,
    `editor_id` BIGINT UNSIGNED NULL,
    `body` TEXT NOT NULL,
    `edited_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `service_request_notes_service_request_id_foreign`(`service_request_id`),
    INDEX `service_request_notes_admin_id_foreign`(`admin_id`),
    INDEX `service_request_notes_editor_id_foreign`(`editor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `service_request_notes` ADD CONSTRAINT `service_request_notes_service_request_id_foreign` FOREIGN KEY (`service_request_id`) REFERENCES `service_requests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `service_request_notes` ADD CONSTRAINT `service_request_notes_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `service_request_notes` ADD CONSTRAINT `service_request_notes_editor_id_foreign` FOREIGN KEY (`editor_id`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- The single internal note a service request had becomes its first note (author unknown).
INSERT INTO `service_request_notes` (`service_request_id`, `admin_id`, `editor_id`, `body`, `edited_at`, `created_at`, `updated_at`)
SELECT `id`, NULL, NULL, `admin_note`, NULL, `updated_at`, `updated_at`
FROM `service_requests`
WHERE `admin_note` IS NOT NULL AND TRIM(`admin_note`) <> '';

ALTER TABLE `service_requests` DROP COLUMN `admin_note`;
