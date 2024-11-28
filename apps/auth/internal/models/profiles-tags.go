package models

import "time"

type ProfilesTags struct {
	ProfileId  int64
	TagId      int64
	TCreatedAt time.Time
	TUpdatedAt time.Time
	TDeleted   bool
}

func (ProfilesTags) TableName() string {
	return "profiles_tags"
}
