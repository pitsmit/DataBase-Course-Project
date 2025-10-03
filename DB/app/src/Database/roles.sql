CREATE ROLE app_client NOLOGIN;
CREATE ROLE app_coach NOLOGIN;
CREATE ROLE app_admin NOLOGIN;

GRANT CONNECT ON DATABASE postgres TO app_client, app_coach, app_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_client;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_coach;

GRANT USAGE ON SCHEMA public TO app_admin;
GRANT SELECT, INSERT, DELETE ON TABLE clientdynamictypes TO app_admin;
GRANT SELECT ON TABLE hall TO app_admin;
GRANT SELECT ON TABLE individualtraining TO app_admin;
GRANT SELECT, INSERT, UPDATE ON TABLE coachschedule TO app_admin;
GRANT SELECT ON TABLE coachspecializationtypes TO app_admin;
GRANT SELECT, INSERT, DELETE ON TABLE coachspecialization TO app_admin;
GRANT SELECT, INSERT, UPDATE ON TABLE hallschedule TO app_admin;
GRANT SELECT, INSERT, UPDATE ON TABLE client TO app_admin;
GRANT SELECT, INSERT, UPDATE ON TABLE coach TO app_admin;
GRANT SELECT, INSERT, UPDATE ON TABLE admin TO app_admin;
GRANT SELECT, DELETE, INSERT, UPDATE ON TABLE standarttraining TO app_admin;


GRANT USAGE ON SCHEMA public TO app_client;
GRANT SELECT ON TABLE clientdynamictypes TO app_client;
GRANT SELECT, INSERT, DELETE ON TABLE clientdynamic TO app_client;
GRANT SELECT, UPDATE ON TABLE standarttraining TO app_client;
GRANT SELECT ON TABLE hall TO app_client;
GRANT SELECT ON TABLE coach TO app_client;
GRANT SELECT, DELETE ON TABLE individualtraining TO app_client;
GRANT SELECT, INSERT, DELETE ON TABLE trainingsigns TO app_client;


GRANT USAGE ON SCHEMA public TO app_coach;
GRANT SELECT, INSERT, UPDATE ON TABLE coachschedule TO app_coach;
GRANT SELECT ON TABLE standarttraining TO app_coach;
GRANT SELECT ON TABLE admin TO app_coach;
GRANT SELECT ON TABLE coach TO app_coach;
GRANT SELECT ON TABLE hall TO app_coach;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE individualtraining TO app_coach;
GRANT SELECT ON TABLE client TO app_coach;
GRANT SELECT ON TABLE coachspecializationtypes TO app_coach;
GRANT SELECT ON TABLE coachspecialization TO app_coach;