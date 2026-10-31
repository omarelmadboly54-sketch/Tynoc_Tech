package repository

import "tynoc_tech/Backend/internal/models"

type UserRepository interface {
	CreateUser(user *models.User)error
	GetUserByEmail(email string)(user *models.User,err error)
}
