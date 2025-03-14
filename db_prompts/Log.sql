CREATE TABLE
    USERS (
        user_id int(4),
        username varchar(20),
        subscription char(1) CHECK (subscription in ("o", "n")),
        hash varchar(100),
        section varchar(10),
        PRIMARY KEY (user_id)
    );

--
ALTER TABLE USERS
DROP PRIMARY KEY,
MODIFY COLUMN user_id int(4) PRIMARY KEY AUTO_INCREMENT;

--
CREATE TABLE
    travail (
        user_id int(4) REFERENCES USERS (user_id) ON DELETE CASCADE ON UPDATE CASCADE ,
        exercice_id varchar(100) REFERENCES exercices (exercice_id) ON DELETE CASCADE ON UPDATE CASCADE,
        date_travail date,
        note int(2),
        PRIMARY KEY (user_id, exercice_id),
        CHECK (
            note >= 0
            AND note <= 20
        )
    );

---

alter table users MODIFY COLUMN section varchar(15);