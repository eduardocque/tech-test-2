-- Forzar plugin compatible con Prisma
ALTER USER 'user'@'%' IDENTIFIED WITH mysql_native_password BY 'password';

-- Dar todos los permisos sobre todas las DBs
GRANT ALL PRIVILEGES ON *.* TO 'user'@'%';

-- Permiso para crear bases de datos (necesario para shadow DB)
GRANT CREATE ON *.* TO 'user'@'%';

FLUSH PRIVILEGES;