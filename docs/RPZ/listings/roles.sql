-- =============================================
-- Создание ролей приложения
-- =============================================
CREATE ROLE app_client NOLOGIN;
CREATE ROLE app_coach NOLOGIN;
CREATE ROLE app_admin NOLOGIN;

-- Базовые разрешения для всех ролей
GRANT CONNECT ON DATABASE postgres TO app_client, app_coach, app_admin;
GRANT USAGE ON SCHEMA public TO app_client, app_coach, app_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_client, app_coach, app_admin;

-- =============================================
-- Права администратора
-- =============================================
GRANT SELECT, INSERT, UPDATE, DELETE ON 
    standarttraining
TO app_admin;

GRANT SELECT, INSERT, DELETE ON
    clientdynamictypes,
    coachspecialization
TO app_admin;

GRANT SELECT, INSERT, UPDATE ON
    coachschedule,
    hallschedule
TO app_admin;

GRANT SELECT ON
    hall,
    individualtraining,
    coachspecializationtypes
TO app_admin;

GRANT SELECT, INSERT, UPDATE ON 
    client,
    coach,
    admin
TO app_admin;

-- =============================================
-- Права клиента
-- =============================================
GRANT SELECT, INSERT, DELETE ON
    clientdynamic,
    trainingsigns
TO app_client;

GRANT SELECT, UPDATE ON
    standarttraining
TO app_client;

GRANT SELECT, DELETE ON
    individualtraining
TO app_client;

GRANT SELECT ON
    clientdynamictypes,
    hall,
    coach
TO app_client;

-- =============================================
-- Права тренера
-- =============================================
GRANT SELECT, INSERT, UPDATE, DELETE ON
    individualtraining
TO app_coach;

GRANT SELECT, INSERT, UPDATE ON
    coachschedule
TO app_coach;

GRANT SELECT ON
    standarttraining,
    admin,
    coach,
    hall,
    client,
    coachspecializationtypes,
    coachspecialization
TO app_coach;