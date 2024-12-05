package models

import "time"

type Tag struct {
	Id         int64     `json:"id"`
	Name       string    `json:"name"`
	TCreatedAt time.Time `json:"t_created_at"`
	TUpdatedAt time.Time `json:"t_updated_at"`
	TDeleted   bool      `json:"t_deleted"`
}

func (Tag) TableName() string {
	return "tags"
}
