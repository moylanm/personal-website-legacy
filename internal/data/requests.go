package data

import (
	"context"
	"database/sql"
	"time"
)

type Request struct {
	ID           string    `json:"id"`
	Method       string    `json:"method"`
	Path         string    `json:"path"`
	IpAddress    string    `json:"ipAddress"`
	Referer      string    `json:"referer"`
	UAName       string    `json:"uaName"`
	UAOS         string    `json:"uaOS"`
	UADeviceType string    `json:"uaDeviceType"`
	UADeviceName string    `json:"uaDeviceName"`
	TimeStamp    time.Time `json:"timestamp"`
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
