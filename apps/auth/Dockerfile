FROM golang:1.23-alpine as builder

WORKDIR /app

COPY . .

ENV CGO_ENABLED=0

RUN go work sync
RUN go build -o main apps/backend/cmd/main.go 
RUN go run apps/backend/migrations/main.go 

FROM alpine:latest as runner

WORKDIR /app
COPY --from=builder /app/main ./main

EXPOSE 8080

CMD ["./main"]