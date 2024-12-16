-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
ALTER TABLE organisations
    ALTER COLUMN inn DROP NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
ALTER TABLE organisations
    ALTER COLUMN inn SET NOT NULL;
-- +goose StatementEnd
