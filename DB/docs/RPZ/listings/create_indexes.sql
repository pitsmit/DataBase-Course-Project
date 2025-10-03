CREATE INDEX IF NOT EXISTS idx_stdtraining_name_btree 
ON StandartTraining USING BTREE(name);

CREATE INDEX IF NOT EXISTS idx_stdtraining_datetime_hash 
ON StandartTraining USING HASH(datetime);

CREATE INDEX IF NOT EXISTS idx_stdtraining_coach_hall_gin 
ON StandartTraining USING GIN((array[CoachID, HallID]));