package organisation

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (h *Organisation) CreateOrganisation(ctx context.Context, req *proto.CreateOrganisationRequest) (*emptypb.Empty, error) {
	createOrgQuery := squirrel.Insert(models.Organisation{}.TableName()).Columns("supervisor", "name", "email", "phone", "address", "web_site", "inn").
		Values(req.Supervisor, req.Name, req.Email, req.Phone, req.Address, req.WebSite, req.Inn).PlaceholderFormat(squirrel.Dollar)

	_, err := createOrgQuery.RunWith(h.DB).ExecContext(ctx)
	if err != nil {
		h.Logger.Error("Error while creating organization")
		return nil, err
	}
	return &emptypb.Empty{}, nil
}
