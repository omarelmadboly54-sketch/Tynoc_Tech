package postgres

import (
	"time"
	"tynoc_tech/Backend/internal/models"
	"tynoc_tech/Backend/internal/repository"

	"gorm.io/gorm"
)

type refreshTokenRepository struct {
	db *gorm.DB
}

func NewRefreshTokenRepository(db *gorm.DB) repository.RefreshTokenRepository {
	return &refreshTokenRepository{
		db: db,
	}
}


func (r *refreshTokenRepository) Create(refreshToken *models.RefreshToken) error {
    return r.db.Create(refreshToken).Error
}


func (r *refreshTokenRepository) GetByTokenHash(tokenHash string) (*models.RefreshToken, error) {

    var refreshToken models.RefreshToken

    err := r.db.Where("token_hash = ?", tokenHash).First(&refreshToken).Error

    if err != nil {
        return nil, err
    }

    return &refreshToken, nil
}


func (r *refreshTokenRepository) Revoke(id int64) error {
    now := time.Now()

    return r.db.Model(&models.RefreshToken{}).
        Where("id = ? AND revoked_at IS NULL", id).
        Update("revoked_at", now).Error
}

