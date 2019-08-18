-- Up
create virtual table image using fts5(filename, hash, labels, entities, content);
create table image_relation (id integer not null primary key autoincrement, filename varchar(41) not null, url text not null);
create index image_relation_idx on image_relation(filename);

-- Down
drop index image_relation_idx;
drop table image_relation;
drop table image;
