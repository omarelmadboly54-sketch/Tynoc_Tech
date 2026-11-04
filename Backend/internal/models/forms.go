package models

import "time"

type Form struct {
	ID          int64  		`gorm:"primarykey" json:"id"`
	Title       string 		`gorm:"not null" json:"title"`
	Description string 		`gorm:"not null" json:"description"`
	IsPublic    bool   		`gorm:"not null;default:false" json:"is_public"`
	CreatedBy   int64  		`gorm:"not null" json:"created_by"`
	CreatedAt   time.Time	`gorm:"autoCreateTime" json:"-"`
	UpdatedAt	time.Time	`gorm:"autoUpdateTime" json:"-"`
	PublicID	*string		`gorm:"unique" json:"public_id"`
}



