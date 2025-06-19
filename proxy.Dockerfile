FROM golang:1.24-alpine as build

WORKDIR /

COPY go.mod go.sum main.go ./

RUN --mount=type=cache,target=/go/pkg/mod \
    go build -v -o main main.go

FROM gcr.io/distroless/static-debian12

COPY --from=build /main /main

ENTRYPOINT ["/main"]