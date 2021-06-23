-- auto-generated definition
create table summon_caches
(
    id         integer
        constraint table_name_pk
            primary key autoincrement,
    message    VARCHAR(256) not null,
    react_id   VARCHAR(32)  not null,
    text       VARCHAR(256) not null,
    expires_at VARCHAR(12)  not null,
    owner      varchar(256) not null,
    createdAt  datetime     not null,
    updatedAt  datetime     not null,
    voice      VARCHAR(256)
);

