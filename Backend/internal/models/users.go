package models

import "time"

type User struct {
	ID        int64  		`gorm:"primarykey" json:"id"`
	FirstName string 		`gorm:"not null" json:"first_name"`
	LastName  string 		`gorm:"not null" json:"last_name"`
	Email     string 		`gorm:"unique;not null" json:"email"`
	Password  string 		`gorm:"not null" json:"password"`
	CreatedAt time.Time		`gorm:"autoCreateTime" json:"-"`
	UpdatedAt time.Time		`gorm:"autoUpdateTime" json:"-"`
}
