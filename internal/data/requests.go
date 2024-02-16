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

func (r RequestModel) GetAll() ([]Request, error) {
	query := `
		SELECT id, method, path, ip_address, referer, ua_name, ua_os, ua_device_type, ua_device_name, timestamp
		FROM requests
		ORDER BY id DESC`

	ctx, cancel := context.WithTimeout(context.Background(), queryTimeout)
	defer cancel()

	rows, err := r.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	requests := []Request{}

	for rows.Next() {
		var request Request

		err := rows.Scan(
			&request.ID,
			&request.Method,
			&request.Path,
			&request.IpAddress,
			&request.Referer,
			&request.UAName,
			&request.UAOS,
			&request.UADeviceType,
			&request.UADeviceName,
			&request.TimeStamp,
		)
		if err != nil {
			return nil, err
		}

		requests = append(requests, request)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return requests, nil
}
