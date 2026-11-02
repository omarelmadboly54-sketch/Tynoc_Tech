package models

import (
	"time"

	"gorm.io/datatypes"
)

type Question struct {
	ID           int64          `gorm:"primarykey" json:"id"`
	FormID       int64          `gorm:"not null" json:"form_id"`
	QuestionText string         `gorm:"not null" json:"question_text"`
	QuestionType string         `gorm:"not null" json:"question_type"`
	Options      datatypes.JSON `gorm:"type:jsonb" json:"options"`
	Position     int            `gorm:"not null" json:"position"`
	IsRequired	 bool			`gorm:"not null;default:false" json:"is_required"`
	CreatedAt	 time.Time		`gorm:"autoCreateTime" json:"-"`
	UpdatedAt	 time.Time		`gorm:"autoUpdateTime" json:"-"`
}