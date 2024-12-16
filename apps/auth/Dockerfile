FROM golang:1.23-alpine AS builder

WORKDIR /app

RUN apk update && apk add --no-cache make protobuf-dev

# # Go proto dependencies
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

RUN mkdir -p "./libs/grpc/__generated__"

COPY . .
RUN protoc -I /app/libs/grpc --go_out="/app/libs/grpc/__generated__" --go-grpc_out="/app/libs/grpc/__generated__" /app/libs/grpc/auth.proto
RUN cp -r /app/libs/grpc/__generated__/proto/* /app/libs/grpc/__generated__/
RUN rm -rf "/app/libs/grpc/__generated__/proto"
RUN ls -R "/app/libs/grpc/__generated__"  # Debugging step

ENV CGO_ENABLED=0

WORKDIR /app/apps/auth
# RUN go mod edit -replace github.com/urodstvo/mvp-chehoch=/app
RUN go work sync
RUN go mod tidy
WORKDIR /app

RUN go build -o main ./apps/auth/cmd/main.go 

FROM alpine:latest AS runner

WORKDIR /app
COPY --from=builder /app/main ./main

EXPOSE 8002

ENTRYPOINT ["./main"]
