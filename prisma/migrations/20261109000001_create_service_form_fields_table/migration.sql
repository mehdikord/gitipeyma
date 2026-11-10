-- CreateTable
CREATE TABLE `service_form_fields` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `service_id` BIGINT UNSIGNED NOT NULL,
    `type` ENUM('text', 'number', 'select', 'checkbox') NOT NULL DEFAULT 'text',
    `label` JSON NOT NULL,
    `help` JSON NOT NULL,
    `is_required` BOOLEAN NOT NULL DEFAULT false,
    `is_multiple` BOOLEAN NOT NULL DEFAULT false,
    `is_multiline` BOOLEAN NOT NULL DEFAULT false,
    `options` JSON NOT NULL,
    `sort_order` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `service_form_fields_service_id_foreign`(`service_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `service_form_fields` ADD CONSTRAINT `service_form_fields_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Every service keeps the optional description box its form had until now, so the site looks the
-- same until an admin designs the service's own form.
INSERT INTO `service_form_fields` (`service_id`, `type`, `label`, `help`, `is_required`, `is_multiple`, `is_multiline`, `options`, `sort_order`, `created_at`, `updated_at`)
SELECT `id`, 'text',
    JSON_OBJECT('fa', 'توضیحات', 'en', 'Details', 'tr', 'Açıklama'),
    JSON_OBJECT(
        'fa', 'هر چیزی که به کارشناس کمک می‌کند؛ مثل تاریخ، مسیر، وزن بار یا شرایط خاص پرونده.',
        'en', 'Anything that helps our specialist, such as dates, route, cargo weight or special circumstances.',
        'tr', 'Uzmanımıza yardımcı olacak her şey; tarih, güzergâh, yük ağırlığı veya dosyanızın özel durumu gibi.'
    ),
    false, false, true, JSON_ARRAY(), 1, CURRENT_TIMESTAMP(0), CURRENT_TIMESTAMP(0)
FROM `services`;
