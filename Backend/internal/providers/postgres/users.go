package postgres

import (
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/repository"

	"gorm.io/gorm"
)

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB)repository.UserRepository{
	return &userRepository{
		db: db,
	}
}

func(r *userRepository)CreateUser(*models.User)error{
	var user models.User	
	return r.db.Create(&user).Error
}

func(r *userRepository)GetUserByEmail(email string)(user *models.User,err error){
	result:=r.db.Where("email=?",email).First(&user)
	if result.Error!=nil{
		return nil,err
	}
	return user,nil
}
