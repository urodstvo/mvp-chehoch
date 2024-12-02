-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE surveys
    ADD COLUMN name VARCHAR(255),
    ADD COLUMN description TEXT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE surveys
    DROP COLUMN name,
    DROP COLUMN description;
-- +goose StatementEnd
