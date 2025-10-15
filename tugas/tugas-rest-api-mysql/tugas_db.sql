CREATE DATABASE tugas_db;

USE tugas_db;

CREATE TABLE nilai_mahasiswa (
	id INT PRIMARY KEY auto_increment,
    nama varchar(192) not null,
    mata_kuliah varchar(192) not null, 
    nilai int not null,
    indeks_nilai varchar(4) not null,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp
    ); 