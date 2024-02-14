package data

import (
	"context"
	"database/sql"
	"time"
)

type Request struct {
	Method       string
	Path         string
	IpAddress    string
	Referer      string
	UAName       string
	UAOS         string
	UADeviceType string
	UADeviceName string
	TimeStamp    time.Time
}

type RequestModel struct {
	DB *sql.DB
}

func (r RequestModel) Insert(request *Request) error {
	query := `
		INSERT INTO requests (method, path, ip_address, referer, ua_name, ua_os, ua_device_type, ua_device_name, timestamp)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

	args := []any{
		request.Method,
		request.Path,
		request.IpAddress,
		request.Referer,
		request.UAName,
		request.UAOS,
		request.UADeviceType,
		request.UADeviceName,
		request.TimeStamp,
	}

	ctx, cancel := context.WithTimeout(context.Background(), queryTimeout)
	defer cancel()

	_, err := r.DB.ExecContext(ctx, query, args...)

	return err
}
