package main

import (
	"log"
	"time"
	"tynoc_tech/Backend/configuration"
	"tynoc_tech/Backend/internal/controller"
	"tynoc_tech/Backend/internal/providers/postgres"
	"tynoc_tech/Backend/internal/service"
	"tynoc_tech/Backend/tokens"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db, config, err := configuration.InitPostgres()
	if err!=nil{
		log.Fatal("DataBase Connection Failed")
	}
	log.Println("DataBase Connection Successfully")

	tokenMaker,err:=tokens.NewJwtMaker(config.SecretKey)
	if err!=nil{
		log.Fatalf("Failed to generate token maker:%v",err)
	}


	r:=gin.Default()
	
	r.Use(cors.New(cors.Config{
    AllowOrigins: []string{config.FrontendURL},
    AllowMethods: []string{
        "GET", "POST", "PUT", "DELETE", "OPTIONS",
    },
    AllowHeaders: []string{
        "Origin", "Content-Type", "Authorization",
    },
}))

	// Users
	tokenDuration := time.Duration(config.Access_Token_Minutes) * time.Minute

	userRepository := postgres.NewUserRepository(db)
	userService := service.NewUserService(userRepository, tokenMaker, tokenDuration)
	userController := controller.NewUserController(userService)
	userController.RegisterRouter(r.Group("/api"))

	// Forms
	formRepository := postgres.NewFormRepository(db)
	formService := service.NewFormService(formRepository)

	// Questions
	questionRepository := postgres.NewQuestionRepository(db)
	questionService := service.NewQuestionService(questionRepository, formService)
	questionController := controller.NewQuestionController(questionService, tokenMaker)
	questionController.RegisterRutes(r.Group("/api"))

	// Forms Controller
	formController := controller.NewFormController(formService, questionService, tokenMaker)
	formController.RegisterRoutes(r.Group("/api"))

	// Submissions
	submissionRepository := postgres.NewSubmissionRepository(db)
	submissionService := service.NewSubmissionService(submissionRepository,formService,questionService)
	submissionController := controller.NewSubmissionController(submissionService,tokenMaker)
	submissionController.RegisterRoutes(r.Group("/api"))

	//Analytics
	analyticsRepository:=postgres.NewAnalyticsRepository(db)
	analyticsService:=service.NewAnalyticsService(analyticsRepository,formService,questionService)
	analyticsController:=controller.NewAnalyticsController(analyticsService,tokenMaker)
	analyticsController.RegisterRoutes(r.Group("/api"))



	if err:=r.Run(config.ServerAddress);err!=nil{
		log.Fatalf("Failed To Load Server:%v",err)
	}


}