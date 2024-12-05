package organisation

import (
	"context"
	"log/slog"

	"github.com/Masterminds/squirrel"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/helpers"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/models"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"google.golang.org/protobuf/types/known/emptypb"
	"google.golang.org/protobuf/types/known/timestamppb"
	"google.golang.org/protobuf/types/known/wrapperspb"
)

func (h *Organisation) GetUserOrganisations(ctx context.Context, req *emptypb.Empty) (*proto.GetUserOrganisationsResponse, error) {
	user, err := helpers.GetUserFromContext(ctx)
	if err != nil {
		h.Logger.Error("Error while getting user from context", slog.String("error", err.Error()))
		return nil, err
	}

	getOrgQuery := squirrel.Select("*").From(models.Organisation{}.TableName()).Where(squirrel.Eq{"t_deleted": false, "supervisor": user.Id}).PlaceholderFormat(squirrel.Dollar)

	var orgs []*proto.Organisation

	rows, err := getOrgQuery.RunWith(h.DB).QueryContext(ctx)
	if err != nil {
		h.Logger.Error("Error while getting organisations")
		return nil, err
	}

	for rows.Next() {
		var org models.Organisation
		err = rows.Scan(&org.Id, &org.Supervisor, &org.Name, &org.Email, &org.Phone, &org.Address, &org.WebSite, &org.INN,
			&org.TCreatedAt, &org.TUpdatedAt, &org.TDeleted)
		if err != nil {
			h.Logger.Error("Error while scaning organisations")
			return nil, err
		}

		var wrapper *proto.Organisation = &proto.Organisation{
			Id:         org.Id,
			Supervisor: org.Supervisor,
			Name:       org.Name,
			TCreatedAt: timestamppb.New(org.TCreatedAt),
			TUpdatedAt: timestamppb.New(org.TUpdatedAt),
			TDeleted:   org.TDeleted,
		}

		if org.Email.Valid {
			wrapper.Email = &wrapperspb.StringValue{Value: org.Email.String}
		} else {
			wrapper.Email = nil
		}

		if org.Phone.Valid {
			wrapper.Phone = &wrapperspb.StringValue{Value: org.Phone.String}
		} else {
			wrapper.Phone = nil
		}

		if org.Address.Valid {
			wrapper.Adress = &wrapperspb.StringValue{Value: org.Address.String}
		} else {
			wrapper.Adress = nil
		}

		if org.WebSite.Valid {
			wrapper.WebSite = &wrapperspb.StringValue{Value: org.WebSite.String}
		} else {
			wrapper.WebSite = nil
		}

		if org.INN.Valid {
			wrapper.Inn = &wrapperspb.StringValue{Value: org.INN.String}
		} else {
			wrapper.Inn = nil
		}

		orgs = append(orgs, wrapper)
	}

	return &proto.GetUserOrganisationsResponse{Organisations: orgs}, nil

}
