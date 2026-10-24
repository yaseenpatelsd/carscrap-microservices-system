-- ============================================================
-- CarScrapy database bootstrap
--
-- Creates one database per service. Hibernate (ddl-auto=update)
-- creates the tables inside each database on first startup.
--
-- The MySQL image runs this automatically ONLY when the data
-- volume is empty. If you already have the mysql_data volume,
-- either run these statements manually or reset the volume with:
--     docker compose down -v
-- ============================================================

CREATE DATABASE IF NOT EXISTS auth_service;
CREATE DATABASE IF NOT EXISTS yard_service;
CREATE DATABASE IF NOT EXISTS car_service;
CREATE DATABASE IF NOT EXISTS booking_service;

-- Email_Service has no database (it excludes DataSourceAutoConfiguration).

-- The services connect as root, which already has access to every
-- database created above, so no extra GRANTs are needed.
FLUSH PRIVILEGES;