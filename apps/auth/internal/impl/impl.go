package impl

import proto "github.com/urodstvo/mvp-chehoch/libs/grpc/__generated__"

type Impl struct {
	*proto.UnimplementedAuthServer
}

func New() Impl {
	return Impl{}
}
