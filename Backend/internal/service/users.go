package service

import (
	"errors"
	"fmt"
	"time"
	"tynoc_tech/Backend/internal/apperrors"
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/repository"
	"tynoc_tech/Backend/internal/utils"
	"tynoc_tech/Backend/tokens"

	"gorm.io/gorm"
)

type userService struct {
	UserRepository repository.UserRepository
	tokenMaker     tokens.Maker
	tokenDuration  time.Duration

}

type UserService interface{
	CreateUser(user *models.User)error
	Login(email,password string)(string,error)
}

func NewUserService(userRepository repository.UserRepository,tokenMaker tokens.Maker,tokenDuration time.Duration)UserService{
	return &userService{
		UserRepository:userRepository ,
		tokenMaker: tokenMaker,
		tokenDuration: tokenDuration,
	}
}

func(s *userService)CreateUser(user *models.User)error{
	existinguser,err:=s.UserRepository.GetUserByEmail(user.Email)
	if err!=nil{
		if !errors.Is(err,gorm.ErrRecordNotFound){
			return err 
		}
	}
	if existinguser !=nil{
		return apperrors.ErrUserAlreadyExists
	}
	
	hashedpassword,err:=utils.HashPassword(user.Password)
	if err!=nil{
		return err
	}
	user.Password=hashedpassword
	
	return s.UserRepository.CreateUser(user)

}

func(s *userService)Login(email,password string)(string,error){
	user,err:=s.UserRepository.GetUserByEmail(email)
	if err!=nil{
		if errors.Is(err,gorm.ErrRecordNotFound){
			return "",apperrors.ErrInvalidCredentials
		}
		return "",err
	}

	err=utils.VerifyPassword(user.Password,password)
	if err!=nil{
		return "",apperrors.ErrInvalidCredentials
	}
	accessToken,err:=s.tokenMaker.CreateToken(user.Email,user.ID,s.tokenDuration)
	if err!=nil{
		return "",fmt.Errorf("failed to generate tokens:%v",err)
	}
	return accessToken,nil
}
