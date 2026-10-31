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
	g.POST("/login",ctl.Login)
}

func(ctl *userController)CreateUser(g *gin.Context){
	 req:=presenters.CreateUserReq{}

	if err:=g.ShouldBindJSON(&req);err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}
	
	toUser:=req.ToUser()
	
	err:=ctl.UserService.CreateUser(&toUser)
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

func(ctl *userController)Login(g *gin.Context){
	var req presenters.LoginReq
	
	if err:=g.ShouldBindJSON(&req);err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}
	accessToken,err:=ctl.UserService.Login(req.Email,req.Password)
	if err!=nil{
		if errors.Is(err,apperrors.ErrInvalidCredentials){
			g.JSON(http.StatusUnauthorized,gin.H{"error":apperrors.ErrInvalidCredentials.Error(),
		})
		return
		}
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}
	g.JSON(http.StatusOK,gin.H{
		"access_token":accessToken,
	})
}
