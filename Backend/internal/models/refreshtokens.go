package models

import "time"

type RefreshToken struct {
	ID        		int64     		`gorm:"primaryKey"`
	UserID    		int64     		`gorm:"not null;index"`
	TokenHash 		string    		`gorm:"unique;not null"`
	ExpiresAt 		time.Time 		`gorm:"not null"`
	RevokedAt 		*time.Time
	CreatedAt 		time.Time
}
