package impl

import (
	"context"
	"database/sql"

	"github.com/redis/go-redis/v9"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/config"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/impl/auth"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/impl/organisation"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/impl/session"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/impl/tags"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/impl/user"
	impldeps "github.com/urodstvo/mvp-chehoch/apps/auth/internal/impl_deps"
	"github.com/urodstvo/mvp-chehoch/apps/auth/internal/logger"
	proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"
	"go.uber.org/fx"
	"google.golang.org/protobuf/types/known/emptypb"
)

type Impl struct {
	*proto.UnimplementedAuthServer
	*auth.Auth
	*user.User
	*session.Session
	*organisation.Organisation
	*tags.Tags
}

type Opts struct {
	fx.In

	DB     *sql.DB
	Redis  *redis.Client
	Logger logger.Logger
	Config config.Config
}

func New(opts Opts) Impl {
	deps := impldeps.ImplDeps{
		DB:     opts.DB,
		Redis:  opts.Redis,
		Logger: opts.Logger,
		Config: opts.Config,
	}

	return Impl{
		User:         &user.User{ImplDeps: &deps},
		Auth:         &auth.Auth{ImplDeps: &deps},
		Session:      &session.Session{ImplDeps: &deps},
		Organisation: &organisation.Organisation{ImplDeps: &deps},
		Tags:         &tags.Tags{ImplDeps: &deps},
	}
}

func (i Impl) AddTagsToUser(ctx context.Context, req *proto.AddTagsToUserRequest) (*emptypb.Empty, error) {
	return i.Tags.AddTagsToUser(ctx, req)
}
func (i Impl) CheckAccess(ctx context.Context, req *proto.CheckAccessRequest) (*proto.CheckAccessResponse, error) {
	return i.Auth.CheckAccess(ctx, req)
}
func (i Impl) CheckSession(ctx context.Context, req *emptypb.Empty) (*proto.CheckSessionResponse, error) {
	return i.Session.CheckSession(ctx, req)
}
func (i Impl) CreateOrganisation(ctx context.Context, req *proto.CreateOrganisationRequest) (*emptypb.Empty, error) {
	return i.Organisation.CreateOrganisation(ctx, req)
}
func (i Impl) DeleteOrganisation(ctx context.Context, req *proto.DeleteOrganisationRequest) (*emptypb.Empty, error) {
	return i.Organisation.DeleteOrganisation(ctx, req)
}
func (i Impl) DeleteTagsFromUser(ctx context.Context, req *proto.DeleteTagsFromUserRequest) (*emptypb.Empty, error) {
	return i.Tags.DeleteTagsFromUser(ctx, req)
}
func (i Impl) DeleteUser(ctx context.Context, req *emptypb.Empty) (*emptypb.Empty, error) {
	return i.User.DeleteUser(ctx, req)
}
func (i Impl) GetOrganisation(ctx context.Context, req *proto.GetOrganisationRequest) (*proto.GetOrganisationResponse, error) {
	return i.Organisation.GetOrganisation(ctx, req)
}
func (i Impl) GetOrganisations(ctx context.Context, req *proto.GetOrganisationsRequest) (*proto.GetOrganisationsResponse, error) {
	return i.Organisation.GetOrganisations(ctx, req)
}
func (i Impl) GetUser(ctx context.Context, req *proto.GetUserRequest) (*proto.GetUserResponse, error) {
	return i.User.GetUser(ctx, req)
}
func (i Impl) GetUserFromSession(ctx context.Context, req *emptypb.Empty) (*proto.GetUserFromSessionResponse, error) {
	return i.Session.GetUserFromSession(ctx, req)
}
func (i Impl) GetUsers(ctx context.Context, req *proto.GetUsersRequest) (*proto.GetUsersResponse, error) {
	return i.User.GetUsers(ctx, req)
}
func (i Impl) Login(ctx context.Context, req *proto.LoginRequest) (*proto.LoginResponse, error) {
	return i.Auth.Login(ctx, req)
}
func (i Impl) Logout(ctx context.Context, req *emptypb.Empty) (*emptypb.Empty, error) {
	return i.Auth.Logout(ctx, req)
}
func (i Impl) RefreshSession(ctx context.Context, req *emptypb.Empty) (*emptypb.Empty, error) {
	return i.Session.RefreshSession(ctx, req)
}
func (i Impl) Register(ctx context.Context, req *proto.RegisterRequest) (*proto.RegisterResponse, error) {
	return i.Auth.Register(ctx, req)
}
func (i Impl) UpdateOrganisation(ctx context.Context, req *proto.UpdateOrganisationRequest) (*emptypb.Empty, error) {
	return i.Organisation.UpdateOrganisation(ctx, req)
}
func (i Impl) UpdateUser(ctx context.Context, req *proto.UpdateUserRequest) (*emptypb.Empty, error) {
	return i.User.UpdateUser(ctx, req)
}
