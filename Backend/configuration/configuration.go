package configuration

import (
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/utils"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitPostgres() (*gorm.DB,models.Configuration,error){
	config,err:=utils.LoadConfiguration(".")
	if err!=nil{
		return nil,models.Configuration{},err
	}
	db, err := gorm.Open(postgres.Open(config.DBSource), &gorm.Config{})
	if err!=nil{
		return nil,models.Configuration{},err
	}

	return db,models.Configuration{},nil
}

