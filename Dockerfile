FROM golang:1.20-alpine

WORKDIR /app

COPY . .

RUN go mod tidy && go build -o server backend/cmd/server/main.go

EXPOSE 8080

CMD ["./server"]
