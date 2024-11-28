package organisation

import (
	"context"
	"database/sql"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (h *Organisation) UpdateOrganisation(ctx context.Context, req *proto.UpdateOrganisationRequest) (*emptypb.Empty, error) {
	getOrgQuery := squirrel.Select("*").From(models.Organisation{}.TableName()).Where(squirrel.Eq{"id": req.OrganisationId, "t_deleted": false}).PlaceholderFormat(squirrel.Dollar)

	var org models.Organisation

	err := getOrgQuery.RunWith(h.DB).QueryRowContext(ctx).Scan(&org.Id, &org.Supervisor, &org.Name, &org.Email, &org.Phone, &org.Address, &org.WebSite, &org.INN,
		&org.TCreatedAt, &org.TUpdatedAt, &org.TDeleted)
	if err != nil {
		h.Logger.Error("Error while getting organisation")
		return nil, err
	}

	if req.Name != nil {
		org.Name = *req.Name
	}
	if req.Email != nil {
		org.Email = sql.NullString{String: *req.Email, Valid: true}
	}
	if req.Phone != nil {
		org.Phone = sql.NullString{String: *req.Phone, Valid: true}
	}
	if req.Address != nil {
		org.Address = sql.NullString{String: *req.Address, Valid: true}
	}
	if req.Inn != nil {
		org.INN = sql.NullString{String: *req.Inn, Valid: true}
	}
	if req.WebSite != nil {
		org.WebSite = sql.NullString{String: *req.WebSite, Valid: true}
	}

	updateOrganisationQuery := squirrel.Update(models.Organisation{}.TableName()).SetMap(squirrel.Eq{
		"t_updated_at": time.Now(),
		"name":         org.Name,
		"email":        org.Email,
		"phone":        org.Phone,
		"address":      org.Address,
		"web_site":     org.WebSite,
		"inn":          org.INN,
	}).Where(squirrel.Eq{"id": req.OrganisationId, "t_deleted": false}).PlaceholderFormat(squirrel.Dollar)
	_, err = updateOrganisationQuery.RunWith(h.DB).ExecContext(ctx)
	if err != nil {
		h.Logger.Error("Error while updating organisation")
		return nil, err
	}

	return &emptypb.Empty{}, nil

}
