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

type submissionController struct {
	SubmissionService service.SubmissionService
	tokeMaker tokens.Maker
}


type SubmissionController interface{
	RegisterRoutes(g *gin.RouterGroup)
}

func NewSubmissionController(SubmissionService service.SubmissionService,tokenMaker tokens.Maker)SubmissionController{
	return &submissionController{
		SubmissionService:SubmissionService ,
		tokeMaker: tokenMaker,
	}
}

func(ctl *submissionController)RegisterRoutes(g *gin.RouterGroup){
	g.POST("/forms/:id/submissions",ctl.CreateSubmission)
	g.GET("/forms/:id/submissions",middleware.AuthMiddleware(ctl.tokeMaker),ctl.GetSubmissionsByFormID)
}


func(ctl *submissionController)CreateSubmission(g *gin.Context){
	formID,err:=strconv.ParseInt(g.Param("id"),10,64)
	if err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}

	var req presenters.CreateSubmissionReq

	if err:=g.ShouldBindJSON(&req);err!=nil{
		g.JSON(http.StatusBadRequest,gin.H{"error":err.Error(),
	})
	return
	}

	toAnswer:=req.ToAnswers()

	err=ctl.SubmissionService.CreateSubmission(formID,toAnswer)
	if err != nil {
    switch {
    case errors.Is(err, apperrors.ErrFormNotFound):
        g.JSON(http.StatusNotFound, gin.H{"error": apperrors.ErrFormNotFound.Error()})

    case errors.Is(err, apperrors.ErrFormNotPublic):
        g.JSON(http.StatusForbidden, gin.H{"error": err.Error()})

    case errors.Is(err, apperrors.ErrQuestionFormNotFound),
         errors.Is(err, apperrors.ErrDuplicateAnswer),
         errors.Is(err, apperrors.ErrRequiredQuestion),
         errors.Is(err, apperrors.ErrInvalidAnswer):
        g.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

    default:
        g.JSON(http.StatusInternalServerError, gin.H{
            "error": "Internal server error",
        })
    }
}

	g.JSON(http.StatusCreated,gin.H{
		"message":"Submission created successfully",
	})
}

func (ctl *submissionController) GetSubmissionsByFormID(g *gin.Context) {
	formID, err := strconv.ParseInt(g.Param("id"), 10, 64)
	if err != nil {
		g.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

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

	payload, ok := middleware.GetTokenPayload(g)
	if !ok {
		g.JSON(http.StatusUnauthorized, gin.H{
			"error": "unauthorized request",
		})
		return
	}

	userID:=payload.UserID

	submissions, err := ctl.SubmissionService.GetSubmissionsByFormID(formID,userID,page,limit)
	if err != nil {
		if errors.Is(err, apperrors.ErrFormNotFound) {
			g.JSON(http.StatusNotFound, gin.H{
				"error": apperrors.ErrFormNotFound.Error(),
			})
			return
		}

		g.JSON(http.StatusInternalServerError, gin.H{
			"error": "Internal server error",
		})
		return
	}

	g.JSON(http.StatusOK, gin.H{
		"submissions": submissions,
	})
}