ALTER TABLE Coach
    ALTER COLUMN name SET NOT NULL,
    ADD CHECK (name ~ '^[A-Za-zА-Яа-я]+$'),

    ALTER COLUMN surname SET NOT NULL,
    ADD CHECK (surname ~ '^[A-Za-zА-Яа-я]+$'),

    ALTER COLUMN login SET NOT NULL,
    ADD CHECK (login ~ '^[A-Za-z0-9]+$'),

    ALTER COLUMN password SET NOT NULL,
    ADD CHECK (length(password) >= 8),

    ADD UNIQUE (login),
    ADD CHECK (length(login) BETWEEN 8 AND 10),

    ALTER COLUMN is_participate SET DEFAULT true;

ALTER TABLE CoachSpecializationTypes
    ALTER COLUMN name SET NOT NULL,
    ADD FOREIGN KEY (HallID) REFERENCES Hall(ID),
    ADD UNIQUE (name);

ALTER TABLE CoachSpecialization
    ADD FOREIGN KEY (SpecID) REFERENCES CoachSpecializationTypes(ID),
    ADD FOREIGN KEY (CoachID) REFERENCES Coach(ID),
    ADD CONSTRAINT unique_coachid_specid UNIQUE (CoachID, SpecID);

ALTER TABLE CoachSchedule
    ADD FOREIGN KEY (CoachID) REFERENCES Coach(ID),
    ALTER COLUMN date SET NOT NULL,
    ALTER COLUMN start SET NOT NULL,
    ALTER COLUMN stop SET NOT NULL,
    ADD CONSTRAINT unique_coachid_date UNIQUE (CoachID, date);

ALTER TABLE Client
    ALTER COLUMN name SET NOT NULL,
    ADD CHECK (name ~ '^[A-Za-zА-Яа-я]+$'),

    ALTER COLUMN surname SET NOT NULL,
    ADD CHECK (surname ~ '^[A-Za-zА-Яа-я]+$'),

    ALTER COLUMN login SET NOT NULL,
    ADD CHECK (login ~ '^[A-Za-z0-9]+$'),

    ALTER COLUMN password SET NOT NULL,
    ADD CHECK (length(password) >= 8),

    ADD UNIQUE (login),
    ADD CHECK (length(login) BETWEEN 8 AND 10),

    ALTER COLUMN is_participate SET DEFAULT true;

ALTER TABLE ClientDynamicTypes
    ALTER COLUMN name SET NOT NULL,
    ALTER COLUMN unit SET NOT NULL,
    ADD UNIQUE (name);

ALTER TABLE ClientDynamic
    ADD FOREIGN KEY (ClientID) REFERENCES Client(ID),
    ADD FOREIGN KEY (DynamicTypeID) REFERENCES ClientDynamicTypes(ID),
    ALTER COLUMN value SET NOT NULL,
    ALTER COLUMN date SET NOT NULL,
    ADD CONSTRAINT unique_dynamictypeid_date_clientid UNIQUE (DynamicTypeID, date, ClientID);

ALTER TABLE Admin
    ALTER COLUMN name SET NOT NULL,
    ADD CHECK (name ~ '^[A-Za-zА-Яа-я]+$'),

    ALTER COLUMN surname SET NOT NULL,
    ADD CHECK (surname ~ '^[A-Za-zА-Яа-я]+$'),

    ALTER COLUMN login SET NOT NULL,
    ADD CHECK (login ~ '^[A-Za-z0-9]+$'),

    ALTER COLUMN password SET NOT NULL,
    ADD CHECK (length(password) >= 8),

    ADD UNIQUE (login),
    ADD CHECK (length(login) BETWEEN 8 AND 10),

    ALTER COLUMN is_participate SET DEFAULT true;

ALTER TABLE StandartTraining
    ALTER COLUMN name SET NOT NULL,
    ADD CHECK (name ~ '^[A-Za-zА-Яа-я]+(?: [A-Za-zА-Яа-я]+)*$'
              AND name !~ '^ +$'),

    ADD FOREIGN KEY (AdminID) REFERENCES Admin(ID),
    ADD FOREIGN KEY (CoachID) REFERENCES Coach(ID),
    ADD FOREIGN KEY (HallID) REFERENCES Hall(ID),

    ALTER COLUMN capacity SET NOT NULL,
    ADD CHECK (capacity > 0),

    ALTER COLUMN datetime SET NOT NULL,

    ALTER COLUMN duration SET NOT NULL,
    ADD CHECK (duration > 0);

ALTER TABLE Hall
    ALTER COLUMN name SET NOT NULL,
    ADD CHECK (name ~ '^[A-Za-zА-Яа-я0-9\-]+(?: [A-Za-zА-Яа-я0-9\-]+)*$'
        AND name !~ '^ +$'),
    ADD UNIQUE (name);


ALTER TABLE HallSchedule
    ADD FOREIGN KEY (HallID) REFERENCES Hall(ID),
    ALTER COLUMN date SET NOT NULL,
    ALTER COLUMN start SET NOT NULL,
    ALTER COLUMN stop SET NOT NULL,
    ADD CONSTRAINT unique_hallid_date UNIQUE (HallID, date);

ALTER TABLE TrainingSigns
    ADD FOREIGN KEY (ClientID) REFERENCES Client(ID),
    ADD FOREIGN KEY (StdTrainingID) REFERENCES StandartTraining(ID),
    ADD CONSTRAINT unique_clientid_stdtrainingid UNIQUE (ClientID, StdTrainingID);

ALTER TABLE IndividualTraining
    ADD FOREIGN KEY (CoachID) REFERENCES Coach(ID),
    ADD FOREIGN KEY (ClientID) REFERENCES Client(ID),
    ADD FOREIGN KEY (HallID) REFERENCES Hall(ID),

    ALTER COLUMN datetime SET NOT NULL,
    ALTER COLUMN duration SET NOT NULL,
    ADD CHECK (duration > 0),
    ADD CONSTRAINT unique_coachid_datetime UNIQUE (CoachID, datetime);
