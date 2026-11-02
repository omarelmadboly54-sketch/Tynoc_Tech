package main

import (
	"log"
	"time"
	"tynoc_tech/Backend/configuration"
	"tynoc_tech/Backend/internal/controller"
	"tynoc_tech/Backend/internal/providers/postgres"
	"tynoc_tech/Backend/internal/service"
	"tynoc_tech/Backend/tokens"

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

	//users:
	tokenDuration:=time.Duration(config.Access_Token_Minutes)*time.Minute
	userRepository:=postgres.NewUserRepository(db)
	userService:=service.NewUserService(userRepository,tokenMaker,tokenDuration)
	userController:=controller.NewUserController(userService)
	userController.RegisterRouter(r.Group("/api"))

	//forms:
	formRepository:=postgres.NewFormRepository(db)
	formService:=service.NewFormService(formRepository)
	formController:=controller.NewFormController(formService,tokenMaker)
	formController.RegisterRoutes(r.Group("/api"))

	//questions:
	questionRepository:=postgres.NewQuestionRepository(db)
	questionService:=service.NewQuestionService(questionRepository,formRepository)
	questionController:=controller.NewQuestionController(questionService,tokenMaker)
	questionController.RegisterRutes(r.Group("/api"))

	if err:=r.Run(config.ServerAddress);err!=nil{
		log.Fatalf("Failed To Load Server:%v",err)
	}


}