package tags

import (
	"context"
	"time"

	"google.golang.org/protobuf/types/known/emptypb"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/helpers"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"

	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
)

func (h *Tags) AddTagsToUser(ctx context.Context, req *proto.AddTagsToUserRequest) (*emptypb.Empty, error) {
	user, err := helpers.GetUserFromContext(ctx)
	if err != nil {
		h.Logger.Error("Error while getting user")
		return nil, err
	}

	tx, err := h.DB.BeginTx(ctx, nil) // Начинаем транзакцию
	if err != nil {
		h.Logger.Error("Error while starting transaction")
		return nil, err
	}

	updateTagsQuery := squirrel.Update(models.ProfilesTags{}.TableName()).
		Where(squirrel.Eq{"profile_id": user.Id, "t_deleted": true, "tag_id": req.Tags}).
		Set("t_deleted", false).Set("t_updated_at", time.Now()).PlaceholderFormat(squirrel.Dollar)
	_, err = updateTagsQuery.RunWith(tx).ExecContext(ctx)
	if err != nil {
		h.Logger.Error("Error while updating existing tags")
		tx.Rollback()
		return nil, err
	}

	existingTagIDs := make(map[int64]bool)
	existingTagsQuery := squirrel.Select("tag_id").From(models.ProfilesTags{}.TableName()).Where(squirrel.Eq{"tag_id": req.Tags, "t_deleted": false}).PlaceholderFormat(squirrel.Dollar)
	rows, err := existingTagsQuery.RunWith(tx).QueryContext(ctx)
	if err != nil {
		h.Logger.Error("Error while fetching existing tags")
		tx.Rollback()
		return nil, err
	}
	for rows.Next() {
		var tag_id int64
		if err := rows.Scan(&tag_id); err != nil {
			h.Logger.Error("Error while scanning tag ID")
			tx.Rollback()
			return nil, err
		}
		existingTagIDs[tag_id] = true
	}

	addTagsQuery := squirrel.Insert(models.ProfilesTags{}.TableName()).Columns("profile_id", "tag_id").PlaceholderFormat(squirrel.Dollar)
	valuesAdded := false // Флаг для проверки, были ли добавлены значения

	for _, tag_id := range req.Tags {
		if !existingTagIDs[tag_id] { // Добавляем только новые теги
			addTagsQuery = addTagsQuery.Values(user.Id, tag_id)
			valuesAdded = true // Устанавливаем флаг, если добавили значение
		}
	}

	// Проверяем, были ли добавлены значения
	if valuesAdded {
		_, err = addTagsQuery.RunWith(tx).ExecContext(ctx)
		if err != nil {
			h.Logger.Error("Error while adding tags to user")
			tx.Rollback()
			return nil, err
		}
	} else {
		h.Logger.Info("No new tags to add") // Логируем, если нечего добавлять
	}

	if err := tx.Commit(); err != nil {
		h.Logger.Error("Error while committing transaction")
		return nil, err
	}
	return &emptypb.Empty{}, nil
}
