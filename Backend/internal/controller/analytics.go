package controller

import (
	"errors"
	"net/http"
	"strconv"
	"tynoc_tech/Backend/internal/apperrors"
	"tynoc_tech/Backend/internal/service"
	"tynoc_tech/Backend/middleware"
	"tynoc_tech/Backend/tokens"

	"github.com/gin-gonic/gin"
)

type analyticsController struct {
	AnalyticsService service.AnalyticsService
	tokenMaker       tokens.Maker
}

type AnalyticsController interface{
	RegisterRoutes(g *gin.RouterGroup)
}

func NewAnalyticsController(analyticsService service.AnalyticsService,tokenMaker tokens.Maker)AnalyticsController  {
	return &analyticsController{
		AnalyticsService: analyticsService,
		tokenMaker:       tokenMaker,
	}
}

func (ctl *analyticsController) RegisterRoutes(g *gin.RouterGroup) {
    g.GET("/forms/:id/analytics", middleware.AuthMiddleware(ctl.tokenMaker),ctl.GetFormAnalytics)
}


func (ctl *analyticsController) GetFormAnalytics(g *gin.Context) {
    formID, err := strconv.ParseInt(g.Param("id"), 10, 64)
    if err != nil || formID <= 0 {
        g.JSON(http.StatusBadRequest, gin.H{
            "error": "Invalid form ID",
        })
        return
    }

	payload,ok:=middleware.GetTokenPayload(g)
	if !ok{
		g.JSON(http.StatusUnauthorized,gin.H{"error":"unauthorized request"})
		return
	}

	userID:=payload.UserID

    analytics, err := ctl.AnalyticsService.GetFormAnalytics(formID, userID)
    if err != nil {
		if errors.Is(err,apperrors.ErrFormNotFound){
			g.JSON(http.StatusNotFound,gin.H{"error":apperrors.ErrFormNotFound.Error(),
		})
		return
		}
        g.JSON(http.StatusInternalServerError, gin.H{
            "error": err.Error(),
        })
        return
    }

    g.JSON(http.StatusOK, gin.H{
        "analytics": analytics,
    })
}