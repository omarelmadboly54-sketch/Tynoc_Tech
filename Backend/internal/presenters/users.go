package presenters

import "tynoc_tech/Backend/internal/models"

type CreateUserReq struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
}

func(c *CreateUserReq) ToUser() models.User{
	return models.User{
		FirstName: c.FirstName,
		LastName: c.LastName,
		Email: c.Email,
		Password: c.Password,
	}
}
