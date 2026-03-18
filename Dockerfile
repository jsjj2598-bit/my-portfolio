FROM golang:1.20-alpine

WORKDIR /app

COPY . .

RUN cd backend && go build -o server cmd/server/main.go

EXPOSE 8080

CMD ["./backend/server"]
