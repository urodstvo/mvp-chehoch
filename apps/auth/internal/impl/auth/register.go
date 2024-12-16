package auth

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"golang.org/x/crypto/bcrypt"
)

func (h *Auth) Register(ctx context.Context, req *proto.RegisterRequest) (*proto.RegisterResponse, error) {
	var user models.User

	tx, err := h.DB.Begin()
	if err != nil {
		h.Logger.Error("Error while starting transaction")
		return nil, err
	}
	defer tx.Rollback()

	checkIfUserExistQuery := squirrel.Select("id").From(models.User{}.TableName()).Where(squirrel.Eq{"login": req.Login}).PlaceholderFormat(squirrel.Dollar)
	err = checkIfUserExistQuery.RunWith(tx).QueryRowContext(ctx).Scan(&user.Id)
	if err == nil {
		return nil, fmt.Errorf("User with login=%s already exists", req.Login)
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), 16)
	if err != nil {
		h.Logger.Error("Errow while encrypting password")
		return nil, err
	}

	createUserQuery := squirrel.Insert(models.User{}.TableName()).Columns("login", "password", "email").
		Values(req.Login, string(hashedPassword), req.Email).Suffix("RETURNING *").PlaceholderFormat(squirrel.Dollar)
	err = createUserQuery.RunWith(tx).QueryRowContext(ctx).Scan(&user.Id, &user.Login, &user.Password, &user.Email, &user.TCreatedAt, &user.TUpdatedAt, &user.TDeleted)
	if err != nil {
		h.Logger.Error("Error while creating user")
		return nil, err
	}

	createProfileQuery := squirrel.Insert(models.Profile{}.TableName()).Columns("id").Values(user.Id).PlaceholderFormat(squirrel.Dollar)
	_, err = createProfileQuery.RunWith(tx).ExecContext(ctx)
	if err != nil {
		h.Logger.Error("Error while creating profile")
		return nil, err
	}

	session := models.NewSession(user)
	err = h.Redis.HSet(ctx, "session:"+session.Id, user).Err()
	if err != nil {
		h.Logger.Error("Error while creating session")
		return nil, err
	}
	err = h.Redis.ExpireAt(ctx, "session:"+session.Id, session.ExpiredAt).Err()
	if err != nil {
		h.Logger.Error("Error while set expiration time for session")
		h.Redis.Del(ctx, "session:"+session.Id)

		return nil, err
	}

	err = tx.Commit()
	if err != nil {
		h.Logger.Error("Error while commiting transaction")
		h.Redis.Del(ctx, "session:"+session.Id)
		return nil, err
	}

	return &proto.RegisterResponse{SessionId: session.Id}, nil

}
