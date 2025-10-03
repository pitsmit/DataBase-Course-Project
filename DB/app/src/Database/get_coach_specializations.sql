CREATE OR REPLACE FUNCTION get_coach_specializations(p_login VARCHAR)
    RETURNS TABLE(
                     id INT,
                     name VARCHAR,
                     hall_name VARCHAR
                 )
    LANGUAGE sql
AS $$
SELECT
    cst.id,
    cst.name,
    h.name AS hall_name
FROM
    coachspecializationtypes cst
        JOIN coachspecialization cs ON cst.id = cs.specid
        JOIN coach c ON c.id = cs.coachid
        JOIN hall h ON cst.hallid = h.id
WHERE c.login = p_login;
$$;