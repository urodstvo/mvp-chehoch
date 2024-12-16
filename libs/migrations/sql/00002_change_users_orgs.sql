-- +goose Up
-- +goose StatementBegin
SELECT 'up SQL query';
alter table organisations
add column logo bigint;

alter table organisations
add constraint fk_logo foreign key (logo) references files (id);

alter table profiles
add column avatar bigint;

alter table profiles
add constraint fk_avatar foreign key (avatar) references files (id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
SELECT 'down SQL query';
alter table organisations
drop constraint fk_logo;
alter table organisations
drop column logo;
alter table profiles
drop constraint fk_avatar;
alter table profiles
drop column avatar;
-- +goose StatementEnd
