package organisation

import (
	"context"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

func (h *Organisation) GetOrganisation(ctx context.Context, req *proto.GetOrganisationRequest) (*proto.GetOrganisationResponse, error) {
	getOrganisationQuery := squirrel.Select("*").From(models.Organisation{}.TableName()).Where(squirrel.Eq{"id": req.OrganisationId, "t_deleted": false}).PlaceholderFormat(squirrel.Dollar)

	var org models.Organisation

	err := getOrganisationQuery.RunWith(h.DB).QueryRowContext(ctx).Scan(&org.Id, &org.Supervisor, &org.Name, &org.Email, &org.Phone, &org.Address, &org.WebSite, &org.INN,
		&org.TCreatedAt, &org.TUpdatedAt, &org.TDeleted)
	if err != nil {
		h.Logger.Error("Error while getting organisation")
		return nil, err
	}

	wrapper := &proto.Organisation{
		Id:         org.Id,
		Supervisor: org.Supervisor,
		Name:       org.Name,
		TCreatedAt: timestamppb.New(org.TCreatedAt),
		TUpdatedAt: timestamppb.New(org.TUpdatedAt),
		TDeleted:   org.TDeleted,
	}

	if org.Email.Valid {
		wrapper.Email = &wrapperspb.StringValue{Value: org.Email.String}
	}

	if org.Phone.Valid {
		wrapper.Phone = &wrapperspb.StringValue{Value: org.Phone.String}
	}

	if org.Address.Valid {
		wrapper.Adress = &wrapperspb.StringValue{Value: org.Address.String}
	}

	if org.WebSite.Valid {
		wrapper.WebSite = &wrapperspb.StringValue{Value: org.WebSite.String}
	}

	if org.INN.Valid {
		wrapper.Inn = &wrapperspb.StringValue{Value: org.INN.String}
	}

	return &proto.GetOrganisationResponse{Organisation: wrapper}, nil

}
