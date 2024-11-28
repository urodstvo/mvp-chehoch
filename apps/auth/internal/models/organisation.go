package models

import (
	"database/sql"
	"time"
)

type Organisation struct {
	Id         int64          `json:"id"`
	Name       string         `json:"name"`
	Supervisor int64          `json:"supervisor"`
	Email      sql.NullString `json:"email"`
	Phone      sql.NullString `json:"phone_number"`
	Address    sql.NullString `json:"address"`
	WebSite    sql.NullString `json:"web_site"`
	INN        sql.NullString `json:"inn"`
	IsVerified bool           `json:"is_verified"`
	TCreatedAt time.Time      `json:"t_created_at"`
	TUpdatedAt time.Time      `json:"t_updated_at"`
	TDeleted   bool           `json:"t_deleted"`
}

func (Organisation) TableName() string {
	return "organisations"
}
