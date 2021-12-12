create table channels
(
    id            INTEGER
        primary key autoincrement,
    owner         VARCHAR(255) not null,
    owner_name    VARCHAR(255) not null,
    channel_name  VARCHAR(128) not null,
    text_channel  VARCHAR(128),
    voice_channel VARCHAR(128),
    is_deleted    TINYINT(1),
    createdAt     DATETIME     not null,
    updatedAt     DATETIME     not null
);

create table message_rooms
(
    id            integer
        constraint message_room_pk
            primary key autoincrement,
    message       VARCHAR(256) not null,
    text_channel  VARCHAR(256) not null,
    voice_channel VARCHAR(256),
    expires       CARCHAR(12)  not null,
    createdAt     datetime     not null,
    updatedAt     datetime     not null
);

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

