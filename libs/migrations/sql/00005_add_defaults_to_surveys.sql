-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- Установить значения по умолчанию для столбцов
ALTER TABLE surveys
ALTER COLUMN questions_amount SET DEFAULT 0;

ALTER TABLE surveys
ALTER COLUMN answers_amount SET DEFAULT 0;

-- Обновить существующие строки, чтобы исключить NULL
UPDATE surveys
SET questions_amount = 0
WHERE questions_amount IS NULL;

UPDATE surveys
SET answers_amount = 0
WHERE answers_amount IS NULL;

-- Сделать столбцы NOT NULL
ALTER TABLE surveys
ALTER COLUMN questions_amount SET NOT NULL;

ALTER TABLE surveys
ALTER COLUMN answers_amount SET NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- Сделать столбцы NULLABLE
ALTER TABLE surveys
ALTER COLUMN questions_amount DROP NOT NULL;

ALTER TABLE surveys
ALTER COLUMN answers_amount DROP NOT NULL;

-- Удалить значения по умолчанию
ALTER TABLE surveys
ALTER COLUMN questions_amount DROP DEFAULT;

ALTER TABLE surveys
ALTER COLUMN answers_amount DROP DEFAULT;
-- +goose StatementEnd
