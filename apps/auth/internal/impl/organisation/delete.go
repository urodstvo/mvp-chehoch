package organisation

import (
	"context"
	"time"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"google.golang.org/protobuf/types/known/emptypb"
)

func (h *Organisation) DeleteOrganisation(ctx context.Context, req *proto.DeleteOrganisationRequest) (*emptypb.Empty, error) {
	deleteOrgQuery := squirrel.Update(models.Organisation{}.TableName()).SetMap(squirrel.Eq{"t_deleted": "true", "t_updated_at": time.Now()}).Where(squirrel.Eq{"id": req.OrganisationId}).PlaceholderFormat(squirrel.Dollar)
	_, err := deleteOrgQuery.RunWith(h.DB).ExecContext(ctx)
	if err != nil {
		h.Logger.Error("Error while deleting organization")
		return nil, err
	}

	return &emptypb.Empty{}, nil
}
