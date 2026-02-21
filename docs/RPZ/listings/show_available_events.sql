CREATE OR REPLACE FUNCTION show_available_events()
    RETURNS TABLE (
                      id INT,
                      name VARCHAR,
                      coach_name VARCHAR,
                      coach_surname VARCHAR,
                      hall_name VARCHAR,
                      datetime TIMESTAMP,
                      capacity INT,
                      duration INT
                  )
    LANGUAGE sql
AS $$
SELECT
    st.id,
    st.name,
    c.name as coach_name,
    c.surname as coach_surname,
    h.name as hall_name,
    st.datetime,
    st.capacity,
    st.duration
FROM standarttraining st
         JOIN coach c ON c.id = st.coachid
         JOIN hall h ON h.id = st.hallid
WHERE st.datetime >= NOW()
  AND st.capacity > (
    SELECT COUNT(ts.id)
    FROM trainingsigns ts
    WHERE ts.stdtrainingid = st.id
)
ORDER BY st.datetime;
$$;