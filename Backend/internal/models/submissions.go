package models

import "time"

type Submission struct {
	ID        int64 		`gorm:"primarykey" json:"id"`
	FormID    int64 		`gorm:"form_id" json:"form_id"`
	CreatedAt time.Time		`gorm:"autoCreateTime" json:"-"`
}

