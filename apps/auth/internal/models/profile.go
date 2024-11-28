package models

import (
	"database/sql"
)

type MaritalStatus int32
type EducationLevel int32

const (
	SINGLE  MaritalStatus = 0
	MARRIED MaritalStatus = 1

	SCHOOL  EducationLevel = 0
	COLLEGE EducationLevel = 1
	STUDENT EducationLevel = 2
)

type Profile struct {
	Id             int64          `json:"id"`
	Proffession    sql.NullString `json:"profession"`
	BirthDate      sql.NullTime   `json:"birth_date"`
	MaritalStatus  sql.NullInt32  `json:"marital_status"`
	EducationLevel sql.NullInt32  `json:"education_level"`
}

func (Profile) TableName() string {
	return "profiles"
}
