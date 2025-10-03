CREATE TABLE IF NOT EXISTS Coach (
  ID serial PRIMARY KEY,
  name varchar(20),
  surname varchar(20),
  login varchar(10),
  password varchar(255),
  is_participate boolean
);

CREATE TABLE IF NOT EXISTS CoachSpecializationTypes (
  ID serial PRIMARY KEY,
  name varchar(20),
  HallID int
);

CREATE TABLE IF NOT EXISTS CoachSpecialization (
  ID serial PRIMARY KEY,
  SpecID int,
  CoachID int
);

CREATE TABLE IF NOT EXISTS CoachSchedule (
  ID serial PRIMARY KEY,
  CoachID int,
  date date,
  start time,
  stop time
);

CREATE TABLE IF NOT EXISTS Client (
  ID serial PRIMARY KEY,
  name varchar(20),
  surname varchar(20),
  login varchar(10),
  password varchar(255),
  is_participate boolean
);

CREATE TABLE IF NOT EXISTS ClientDynamicTypes (
  ID serial PRIMARY KEY,
  name varchar(30),
  unit varchar(20)
);

CREATE TABLE IF NOT EXISTS ClientDynamic (
  ID serial PRIMARY KEY,
  ClientID int,
  DynamicTypeID int,
  value float,
  date Date
);

CREATE TABLE IF NOT EXISTS Admin (
  ID serial PRIMARY KEY,
  name varchar(20),
  surname varchar(20),
  login varchar(10),
  password varchar(255),
  is_participate boolean
);

CREATE TABLE IF NOT EXISTS StandartTraining (
  ID serial PRIMARY KEY,
  name varchar(50),
  AdminID int,
  CoachID int,
  HallID int,
  capacity int,
  datetime timestamp,
  duration float
);

CREATE TABLE IF NOT EXISTS Hall (
  ID serial PRIMARY KEY,
  name varchar(30)
);

CREATE TABLE IF NOT EXISTS HallSchedule (
  ID serial PRIMARY KEY,
  HallID int,
  date date,
  start time,
  stop time
);

CREATE TABLE IF NOT EXISTS TrainingSigns (
  ID serial PRIMARY KEY,
  ClientID int,
  StdTrainingID int
);

CREATE TABLE IF NOT EXISTS IndividualTraining (
  ID serial PRIMARY KEY,
  CoachID int,
  ClientID int,
  HallID int,
  datetime timestamp,
  duration float,
  notes text
);
