#!/bin/bash

# === Configuration ===
DB_HOST="localhost"
DB_USER="your_user"
DB_PASS="your_password"
DB_NAME="my_database"

# === SQL commands ===
SQL_COMMANDS=$(cat <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
USE ${DB_NAME};

CREATE TABLE IF NOT EXISTS USERS (
    user_id int(4),
    username varchar(20),
    subscription char(1) CHECK (subscription IN ("o", "n")),
    hash varchar(100),
    section varchar(10),
    PRIMARY KEY (user_id)
);

ALTER TABLE USERS
DROP PRIMARY KEY,
MODIFY COLUMN user_id int(4) AUTO_INCREMENT PRIMARY KEY;
EOF
)

# === Run SQL and show output ===
echo "Running SQL on MariaDB..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "$SQL_COMMANDS"

echo ""
echo "✅ SQL executed. Verifying..."
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SHOW DATABASES;"
echo ""
echo "📂 Tables in '$DB_NAME':"
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "USE ${DB_NAME}; SHOW TABLES;"

echo ""
echo "🕵️ Finished. Press ENTER to exit."
read
