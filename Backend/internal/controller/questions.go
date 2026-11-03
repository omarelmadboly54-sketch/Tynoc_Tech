package controller

import (
	"errors"
	"net/http"
	"strconv"
	"tynoc_tech/Backend/internal/apperrors"
	"tynoc_tech/Backend/internal/presenters"
	"tynoc_tech/Backend/internal/service"
	"tynoc_tech/Backend/middleware"
	"tynoc_tech/Backend/tokens"

	"github.com/gin-gonic/gin"
)

type questionController struct {
	QuestionService service.QuestionService
	tokenMaker      tokens.Maker
}


type QuestionController interface{
	RegisterRutes(g *gin.RouterGroup)
}

func NewQuestionController(QuestionService service.QuestionService,tokenMaker tokens.Maker)QuestionController{
	return &questionController{
		QuestionService: QuestionService,
		tokenMaker: tokenMaker,
	}
}

func(ctl *questionController)RegisterRutes(g *gin.RouterGroup){
	g.POST("/forms/:id/questions",middleware.AuthMiddleware(ctl.tokenMaker),ctl.CreateQuestion)
	g.GET("/forms/:id/questions",middleware.AuthMiddleware(ctl.tokenMaker),ctl.GetAll)
	g.DELETE("/forms/:id/questions/:question_id",middleware.AuthMiddleware(ctl.tokenMaker),ctl.DeleteQuestion)

}


func(ctl *questionController)CreateQuestion(g *gin.Context){
	var req presenters.CreateQuestionReq

	payload,ok:=middleware.GetTokenPayload(g)
	if !ok{
		g.JSON(http.StatusUnauthorized,gin.H{"error":"unauthorized request"})
		return
	}
	userID:=payload.UserID

	form_id,err:=strconv.ParseInt(g.Param("id"),10,64)
	if err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}

	if err:=g.ShouldBindJSON(&req);err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}
	
	toquestion:=req.ToQuestion()

	err=ctl.QuestionService.CreateQuestion(&toquestion,form_id,userID)
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
		"ok":"ok",
	})
}


func(ctl *questionController)GetAll(g *gin.Context){
	form_id,err:=strconv.ParseInt(g.Param("id"),10,64)
	if err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}

	payload,ok:=middleware.GetTokenPayload(g)
	if !ok{
		g.JSON(http.StatusUnauthorized,gin.H{"error":"unauthorized status"})
		return
	}

	userID:=payload.UserID

	quesiotns,err:=ctl.QuestionService.GetAll(form_id,userID)
	if err!=nil{
		if errors.Is(err,apperrors.ErrFormNotFound){
			g.JSON(http.StatusNotFound,gin.H{"error":err.Error(),
		})
		return
		}
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}

	g.JSON(http.StatusOK,gin.H{
		"questions":quesiotns,
	})
}


func(ctl *questionController)DeleteQuestion(g *gin.Context){
	questionIDStr:=g.Param("question_id")
	questionID,err:=strconv.ParseInt(questionIDStr,10,64)
	if err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}

	formIDStr:=g.Param("id")
	formID,err:=strconv.ParseInt(formIDStr,10,64)
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

	err=ctl.QuestionService.DeleteQuestion(questionID,formID,userID)
	if err!=nil{
		if errors.Is(err,apperrors.ErrFormNotFound){
			g.JSON(http.StatusNotFound,gin.H{"error":apperrors.ErrFormNotFound.Error(),
		})
		return
		}
		
		if errors.Is(err,apperrors.ErrQuestionNotFound){
			g.JSON(http.StatusNotFound,gin.H{"error":apperrors.ErrQuestionNotFound.Error(),
		})
		return
		}
		g.JSON(http.StatusInternalServerError,gin.H{"error":err.Error(),
	})
	return
	}

	g.JSON(http.StatusOK,gin.H{
		"message":"question deleted successfully",
	})
}

