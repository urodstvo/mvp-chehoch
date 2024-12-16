package models

import "time"

type User struct {
	Id         int64     `json:"id" redis:"id"`
	Login      string    `json:"login"  redis:"login"`
	Password   string    `redis:"password"`
	Email      string    `json:"email" redis:"email"`
	TCreatedAt time.Time `json:"t_created_at" redis:"t_created_at"`
	TUpdatedAt time.Time `json:"t_updated_at" redis:"t_updated_at"`
	TDeleted   bool      `json:"t_deleted" redis:"t_deleted"`
}

func (User) TableName() string {
	return "users"
}
