-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
CREATE TABLE IF NOT EXISTS users (
id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
login CHARACTER VARYING(256) NOT NULL UNIQUE,
password CHARACTER VARYING(256) NOT NULL,
email CHARACTER VARYING(256) UNIQUE NOT NULL,
t_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS organisations (
id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
name CHARACTER VARYING(512) NOT NULL UNIQUE,
supervisor BIGINT NOT NULL,
email CHARACTER VARYING(256) UNIQUE,
phone_number CHARACTER VARYING(10) UNIQUE,
address CHARACTER VARYING(256),
web_site CHARACTER VARYING(128) UNIQUE,
inn CHARACTER VARYING(10) NOT NULL UNIQUE,
is_verified BOOLEAN DEFAULT FALSE,
t_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_deleted BOOLEAN DEFAULT FALSE,
CONSTRAINT supervisor_fk FOREIGN KEY (supervisor) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS profiles (
id BIGINT PRIMARY KEY,
profession CHARACTER VARYING(128),
birth_date DATE,
education_level CHARACTER VARYING(128),
marital_status CHARACTER VARYING(1),
constraint fk_user_id FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tags (
id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
name CHARACTER VARYING(256) NOT NULL UNIQUE,
t_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS profiles_tags (
profile_id BIGINT NOT NULL,
tag_id BIGINT NOT NULL,
PRIMARY KEY (profile_id, tag_id),
CONSTRAINT fk_profile FOREIGN KEY (profile_id) REFERENCES profiles (id) ON DELETE CASCADE,
CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
t_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS surveys (
id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
questions_amount SMALLINT,
answers_amount BIGINT,
created_by BIGINT,
organisation_id BIGINT,
t_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_deleted BOOLEAN DEFAULT FALSE,
CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
CONSTRAINT fk_organisation FOREIGN KEY (organisation_id) REFERENCES organisations (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS questions (
id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
survey BIGINT,
type CHARACTER VARYING(1),
content CHARACTER VARYING(2048),
answers_amount BIGINT,
t_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_deleted BOOLEAN DEFAULT FALSE,
CONSTRAINT fk_survey FOREIGN KEY (survey) REFERENCES surveys (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS answers (
id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
question BIGINT,
created_by BIGINT,
priority SMALLINT,
t_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_deleted BOOLEAN DEFAULT FALSE,
CONSTRAINT fk_question FOREIGN KEY (question) REFERENCES questions (id) ON DELETE CASCADE,
CONSTRAINT fk_answer_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS answer_variants (
id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
question_id BIGINT,
content CHARACTER VARYING(256) NOT NULL,
t_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_deleted BOOLEAN DEFAULT FALSE,
CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES questions (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS surveys_tags (
survey_id BIGINT,
tag_id BIGINT,
PRIMARY KEY (survey_id, tag_id),
CONSTRAINT fk_survey FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE CASCADE,
CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE,
t_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS files (
id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
filename CHARACTER VARYING(256) NOT NULL,
mime_type CHARACTER VARYING(256),
mem_size BIGINT,
user_id BIGINT,
t_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
t_deleted BOOLEAN DEFAULT FALSE,
CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS surveys_tags;
DROP TABLE IF EXISTS answer_variants;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS surveys;
DROP TABLE IF EXISTS profiles_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS organisations;
DROP TABLE IF EXISTS users;
-- +goose StatementEnd
