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

