package impl

import "github.com/urodstvo/mvp-chehoch/apps/auth/proto"

type Impl struct {
	*proto.UnimplementedAuthServer
}

func New() Impl {
	return Impl{}
}
