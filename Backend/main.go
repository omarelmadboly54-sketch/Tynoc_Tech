package main

import (
	"log"
	"tynoc_tech/Backend/configuration"
	"tynoc_tech/Backend/internal/controller"
	"tynoc_tech/Backend/internal/providers/postgres"
	"tynoc_tech/Backend/internal/service"

	"github.com/gin-gonic/gin"
)

func main() {
	db, config, err := configuration.InitPostgres()
	if err!=nil{
		log.Fatal("DataBase Connection Failed")
	}
	log.Println("DataBase Connection Successfully")

	r:=gin.Default()		

	//users:

	userRepository:=postgres.NewUserRepository(db)
	userService:=service.NewUserService(userRepository)
	userController:=controller.NewUserController(userService)
	userController.RegisterRouter(r.Group("/api"))




	if err:=r.Run(config.ServerAddress);err!=nil{
		log.Fatalf("Failed To Load Server:%v",err)
	}


}