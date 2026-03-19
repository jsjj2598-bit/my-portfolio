FROM golang:1.20-alpine AS builder

WORKDIR /app

COPY . .

RUN go mod tidy
RUN cd backend && go build -o /app/server cmd/server/main.go

FROM alpine:latest

RUN apk add --no-cache ca-certificates

WORKDIR /root/

COPY --from=builder /app/server .

EXPOSE 8080

ENTRYPOINT ["./server"]
