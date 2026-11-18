-- CreateTable
CREATE TABLE `articles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `article_category_id` BIGINT UNSIGNED NOT NULL,
    `admin_id` BIGINT UNSIGNED NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` JSON NOT NULL,
    `excerpt` JSON NOT NULL,
    `content` JSON NOT NULL,
    `image` VARCHAR(500) NULL,
    `meta_title` JSON NOT NULL,
    `meta_description` JSON NOT NULL,
    `status` ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `views` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `published_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `articles_article_category_id_foreign`(`article_category_id`),
    INDEX `articles_admin_id_foreign`(`admin_id`),
    INDEX `articles_status_published_at_index`(`status`, `published_at`),
    UNIQUE INDEX `articles_slug_unique`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_article_category_id_foreign` FOREIGN KEY (`article_category_id`) REFERENCES `article_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `articles` ADD CONSTRAINT `articles_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
