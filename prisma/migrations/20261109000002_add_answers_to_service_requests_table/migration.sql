-- Requests now carry the answers to their service's own form instead of one description.
ALTER TABLE `service_requests` ADD COLUMN `answers` JSON NULL AFTER `phone`;

-- An earlier request's description becomes its answer to the "Details" question, so nothing is lost.
UPDATE `service_requests`
SET `answers` = JSON_ARRAY(JSON_OBJECT(
    'fieldId', NULL,
    'type', 'text',
    'label', JSON_OBJECT('fa', 'توضیحات', 'en', 'Details', 'tr', 'Açıklama'),
    'value', `description`
))
WHERE `description` IS NOT NULL AND `description` <> '';

ALTER TABLE `service_requests` DROP COLUMN `description`;
