package models



type Answer struct{
	ID					int64		`gorm:"primarykey" json:"id"`
	SubmissionID		int64		`gorm:"not null" json:"submission_id"`
	QuestionID			int64		`gorm:"not null" json:"question_id"`
	Answer				string		`gorm:"not null" json:"answer"`	
}

