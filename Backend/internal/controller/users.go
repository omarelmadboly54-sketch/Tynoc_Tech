package controller

import (
	"errors"
	"net/http"
	"tynoc_tech/Backend/internal/apperrors"
	"tynoc_tech/Backend/internal/presenters"
	"tynoc_tech/Backend/internal/service"

	"github.com/gin-gonic/gin"
)

type userController struct {
	UserService service.UserService
}

type UserController interface{
	RegisterRouter(g *gin.RouterGroup)
}


func NewUserController(UserService service.UserService)UserController{
	return &userController{
		UserService: UserService,
	}
}

func(ctl *userController)RegisterRouter(g *gin.RouterGroup){
	g.POST("/users",ctl.CreateUser)
}

func(ctl *userController)CreateUser(g *gin.Context){
	var req presenters.CreateUserReq

	if err:=g.ShouldBindJSON(&req);err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}
	
	err:=ctl.UserService.CreateUser(&req)
	if err!=nil{
		if errors.Is(err,apperrors.ErrUserAlreadyExists){
			g.JSON(http.StatusBadRequest,gin.H{"error":apperrors.ErrUserAlreadyExists.Error(),
		})
		return
		}
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}

	g.JSON(http.StatusCreated,gin.H{
		"ok":"ok",
	})

}