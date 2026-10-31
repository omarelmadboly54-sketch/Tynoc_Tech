package service

import (
	"tynoc_tech/Backend/internal/apperrors"
	"tynoc_tech/Backend/internal/presenters"
	"tynoc_tech/Backend/internal/repository"
	"tynoc_tech/Backend/internal/utils"
)

type userService struct {
	UserRepository repository.UserRepository

}

type UserService interface{
	CreateUser(req *presenters.CreateUserReq)error
}

func NewUserService(userRepository repository.UserRepository)UserService{
	return &userService{
		UserRepository:userRepository ,
	}
}

func(s *userService)CreateUser(req *presenters.CreateUserReq)error{
	existinguser,err:=s.UserRepository.GetUserByEmail(req.Email)
	if err!=nil{
		return err
	}
	if existinguser !=nil{
		return apperrors.ErrUserAlreadyExists
	}
	
	hashedpassword,err:=utils.HashPassword(req.Password)
	if err!=nil{
		return err
	}

	toUser:=req.ToUser()
	toUser.Password=hashedpassword

	return s.UserRepository.CreateUser(&toUser)
}
