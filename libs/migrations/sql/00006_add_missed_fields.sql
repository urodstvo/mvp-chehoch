-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- Добавление новых колонок
ALTER TABLE answers
    ADD COLUMN content TEXT NOT NULL,
    ADD COLUMN answer_variant_id BIGINT;

ALTER TABLE answers
    ADD CONSTRAINT fk_answer_variant FOREIGN KEY (answer_variant_id) REFERENCES answer_variants (id) ON DELETE SET NULL;
   
-- Переименование колонки question в question_id
ALTER TABLE answers
    RENAME COLUMN question TO question_id;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE answers
    DROP COLUMN answer_variant_id,     -- Удаляем колонку answer_variation_id
    DROP COLUMN content;

ALTER TABLE answers
    DROP CONSTRAINT fk_answer_variant; -- Удаляем ограничение внешнего ключа

ALTER TABLE answers
    RENAME COLUMN question_id TO question;

-- +goose StatementEnd
