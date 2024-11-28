-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS users_surveys(
user_id BIGINT,
survey_id BIGINT,
PRIMARY KEY (user_id , survey_id ),
CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
CONSTRAINT fk_survey FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE CASCADE,
t_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_deleted BOOLEAN DEFAULT FALSE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS users_surveys;
-- +goose StatementEnd
