-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
-- Добавление поля `image` в существующую таблицу `questions`
ALTER TABLE questions
ADD COLUMN image BIGINT NULL;

-- Добавление внешнего ключа к полю `image`, ссылающегося на `files.id`
ALTER TABLE questions
ADD CONSTRAINT fk_image FOREIGN KEY (image) REFERENCES files(id) ON DELETE SET NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
-- Удаление внешнего ключа и поля `image`
ALTER TABLE questions DROP CONSTRAINT fk_image;
ALTER TABLE questions DROP COLUMN image;
-- +goose StatementEnd
