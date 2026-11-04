package controller

import (
	"errors"
	"net/http"
	"strconv"
	"tynoc_tech/Backend/internal/apperrors"
	"tynoc_tech/Backend/internal/presenters"
	"tynoc_tech/Backend/internal/service"
	"tynoc_tech/Backend/internal/utils"
	"tynoc_tech/Backend/middleware"
	"tynoc_tech/Backend/tokens"

	"github.com/gin-gonic/gin"
)

type formController struct {
	FormService service.FormService
	QuestionService service.QuestionService
	tokenMaker  tokens.Maker
}

type FormController interface{
	RegisterRoutes(g *gin.RouterGroup)
}

func NewFormController(FormService service.FormService,QuestionService service.QuestionService,tokenMaker tokens.Maker)FormController{
	return &formController{
		FormService: FormService,
		QuestionService: QuestionService,
		tokenMaker: tokenMaker,
	}
}


func(ctl *formController)RegisterRoutes(g *gin.RouterGroup){
	g.POST("/forms",middleware.AuthMiddleware(ctl.tokenMaker),ctl.CreateForm)
	g.GET("/forms/me",middleware.AuthMiddleware(ctl.tokenMaker),ctl.GetFormsByUserID)
	g.GET("/forms/me/:id",middleware.AuthMiddleware(ctl.tokenMaker),ctl.GetFormByUserID)
	g.DELETE("/forms/:id",middleware.AuthMiddleware(ctl.tokenMaker),ctl.DeleteFormByID)
	g.PATCH("/forms/:id",middleware.AuthMiddleware(ctl.tokenMaker),ctl.UpdateFormStatus)
	g.GET("/forms/:id",ctl.GetFormByID)
	g.GET("/forms",ctl.GetAll)
	g.GET("/forms/public/:public_id",ctl.GetFormByPublicID)
	g.POST("/forms/:id/public-link",middleware.AuthMiddleware(ctl.tokenMaker),ctl.SetPublicID)

}


func(ctl *formController)CreateForm(g *gin.Context){
	req:=presenters.CreateFormReq{}

	if err:=g.ShouldBindJSON(&req);err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}
	payload,ok:=middleware.GetTokenPayload(g)
	if !ok{
		g.JSON(http.StatusUnauthorized,gin.H{"error":"unauthorized request"})
		return
	}
	userID:=payload.UserID

	toForm:=req.ToForm()

	err:=ctl.FormService.CreateForm(&toForm,userID)
	if err!=nil{
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}
	g.JSON(http.StatusCreated,gin.H{
		"ok":"ok",
		"data":gin.H{
			"id":toForm.ID,
		},
	})
}

func(ctl *formController)GetFormByID(g *gin.Context){
	id,err:=strconv.ParseInt(g.Param("id"),10,64)
	if err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}
	form,err:=ctl.FormService.GetFormByID(id)
	if err!=nil{
		if errors.Is(err,apperrors.ErrFormNotFound){
			g.JSON(http.StatusNotFound,gin.H{"error":apperrors.ErrFormNotFound.Error(),
		})
		return
		}
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}


	questions,err:=ctl.QuestionService.GetQuestionsByFormID(form.ID)
	if err!=nil{
		if errors.Is(err,apperrors.ErrFormNotFound){
			g.JSON(http.StatusNotFound,gin.H{"error":apperrors.ErrFormNotFound.Error(),
		})
		return
		}
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}

	response:=utils.NewFormResponse(form,questions)

	g.JSON(http.StatusOK,gin.H{
		"form":response,
	})
}

func(ctl *formController)GetAll(g *gin.Context){

	page, err := strconv.Atoi(g.DefaultQuery("page", "1"))
	if err != nil || page < 1 {
		g.JSON(http.StatusBadRequest, gin.H{"error": "invalid page"})
		return
	}

	limit, err := strconv.Atoi(g.DefaultQuery("limit", "10"))
	if err != nil || limit < 1 {
		g.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit"})
		return
	}
	
	forms,err:=ctl.FormService.GetAll(page,limit)
	if err!=nil{
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}

	g.JSON(http.StatusOK,gin.H{
		"forms":forms,
	})
}


func(ctl *formController)GetFormByUserID(g*gin.Context){
	id,err:=strconv.ParseInt(g.Param("id"),10,64)
	if err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}
	payload,ok:=middleware.GetTokenPayload(g)
	if !ok{
		g.JSON(http.StatusUnauthorized,gin.H{"error":"unauthorized request"})
		return
	}

	userID:=payload.UserID
	
	form,err:=ctl.FormService.GetFormByUserID(id,userID)
	if err!=nil{
		if errors.Is(err,apperrors.ErrFormNotFound){
			g.JSON(http.StatusNotFound,gin.H{"error":apperrors.ErrFormNotFound.Error(),
		})
		return
		}
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}

	questions,err:=ctl.QuestionService.GetQuestionsByFormID(form.ID)
	response:=utils.NewOwnerFormResponse(form,questions)

	g.JSON(http.StatusOK,gin.H{
		"form":response,
	})

}

func(ctl *formController)GetFormsByUserID(g *gin.Context){

	page, err := strconv.Atoi(g.DefaultQuery("page", "1"))
	if err != nil || page < 1 {
		g.JSON(http.StatusBadRequest, gin.H{"error": "invalid page"})
		return
	}

	limit, err := strconv.Atoi(g.DefaultQuery("limit", "10"))
	if err != nil || limit < 1 {
		g.JSON(http.StatusBadRequest, gin.H{"error": "invalid limit"})
		return
	}

	payload,ok:=middleware.GetTokenPayload(g)
	if !ok{
		g.JSON(http.StatusUnauthorized,gin.H{"error":"unauthorized request"})
		return
	}
	userID:=payload.UserID
	
	forms,err:=ctl.FormService.GetFormsByUserID(userID,page,limit)
	if err!=nil{
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}

	g.JSON(http.StatusOK,gin.H{
		"forms":forms,
	})
}

func(ctl *formController)DeleteFormByID(g *gin.Context){
	id,err:=strconv.ParseInt(g.Param("id"),10,64)
	if err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}
	payload,ok:=middleware.GetTokenPayload(g)
	if !ok{
		g.JSON(http.StatusUnauthorized,gin.H{"error":"unauthorized request"})
		return
	}
	userID:=payload.UserID

	err=ctl.FormService.DeleteFormByID(id,userID)
	if err!=nil{
		if errors.Is(err,apperrors.ErrFormNotFound){
			g.JSON(http.StatusNotFound,gin.H{"error":apperrors.ErrFormNotFound.Error(),
		})
		return
		}
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}

	g.JSON(http.StatusOK,gin.H{
		"message":"form deleted successfully",
	})
}


func(ctl *formController)UpdateFormStatus(g *gin.Context){
	form_id,err:=strconv.ParseInt(g.Param("id"),10,64)
	if err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}
	payload,ok:=middleware.GetTokenPayload(g)
	if !ok{
		g.JSON(http.StatusUnauthorized,gin.H{"error":"unauthorized request"})
		return
	}
	userID:=payload.UserID
	
	var req presenters.UpdateFormStatus

	if err:=g.ShouldBindJSON(&req);err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}
	
	err=ctl.FormService.UpdateFormStatus(form_id,userID,*req.IsPublic)
	if err!=nil{
		if errors.Is(err,apperrors.ErrFormNotFound){
			g.JSON(http.StatusNotFound,gin.H{"error":apperrors.ErrFormNotFound.Error(),
		})
		return
		}
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}

	g.JSON(http.StatusOK,gin.H{
		"Message":"Status Updated Successfully",
	})
}

func(ctl *formController)GetFormByPublicID(g *gin.Context){
	publicID:=g.Param("public_id")
	
	if publicID==""{
		g.JSON(http.StatusBadRequest,gin.H{"error":"Public ID is Required"})
		return
	}

	form,err:=ctl.FormService.GetFormByPublicID(publicID)
	if err!=nil{
		if errors.Is(err,apperrors.ErrFormNotFound){
			g.JSON(http.StatusNotFound,gin.H{"error":apperrors.ErrFormNotFound.Error(),
		})
		return
		}
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}

	questions,err:=ctl.QuestionService.GetQuestionsByFormID(form.ID)
	if err!=nil{
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}

	response:=utils.NewFormResponse(form,questions)

	g.JSON(http.StatusOK,gin.H{
		"form":response,
	})
	
}

func(ctl *formController)SetPublicID(g *gin.Context){

	form_id,err:=strconv.ParseInt(g.Param("id"),10,64)
	if err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}

	payload,ok:=middleware.GetTokenPayload(g)
	if ! ok{
		g.JSON(http.StatusUnauthorized,gin.H{"error":"unauthorized request"})
		return
	}
	userID:=payload.UserID

	publicID,err:=ctl.FormService.SetPublicID(form_id,userID)
	if err!=nil{
		if errors.Is(err,apperrors.ErrFormNotFound){
			g.JSON(http.StatusNotFound,gin.H{"error":apperrors.ErrFormNotFound.Error(),
		})
		return
		}
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}

	g.JSON(http.StatusCreated,gin.H{
		"public_id":publicID,
	})
}
