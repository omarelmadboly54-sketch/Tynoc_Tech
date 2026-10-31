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

func(r *userRepository)CreateUser(user *models.User)error{	
	return r.db.Create(user).Error
}

func(r *userRepository)GetUserByEmail(email string)(user *models.User,err error){
	result:=r.db.Where("email=?",email).First(&user)
	if result.Error!=nil{
		return nil,result.Error
	}
	return user,nil
}
