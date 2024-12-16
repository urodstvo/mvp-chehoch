package models

import (
	"time"

	"github.com/google/uuid"
)

type Session struct {
	Id        string    `json:"id"`
	User      User      `json:"user"`
	ExpiredAt time.Time `json:"expired_at"`
}

func NewSession(user User) Session {
	sessionId := uuid.New().String()

	return Session{
		Id:        sessionId,
		ExpiredAt: time.Now().Add(time.Hour * 24 * 7),
		User:      user,
	}
}
