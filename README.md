# Formio – Interactive Forms & Chatbot Platform

Formio is a web-based platform that allows users to create interactive forms, share them with their audiences, collect responses, and analyze submissions through a centralized dashboard.

The platform combines a form builder, an interactive chatbot experience, public form sharing, and analytics to make collecting and understanding information easier.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Project Objectives](#project-objectives)
- [Core Features](#core-features)
- [Functional Requirements](#functional-requirements)
- [User Workflow](#user-workflow)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Design](#database-design)
- [API Overview](#api-overview)
- [Authentication & Authorization](#authentication--authorization)
- [User Interface & Experience](#user-interface--experience)
- [Non-Functional Requirements](#non-functional-requirements)
- [Future Improvements](#future-improvements)
- [Getting Started](#getting-started)

---

## Project Overview

Formio provides a simple way for individuals and businesses to create forms without requiring technical knowledge.

Users can create forms, customize their questions, publish them, and share them through different communication channels.

Visitors can access publicly available forms and submit their responses. Form owners can then manage submissions and view analytics through their personal dashboard.

Formio also provides a chatbot-based experience that guides visitors through forms one question at a time.

## Project Objectives

The main objectives of Formio are:

- Simplify the process of creating and managing online forms.
- Provide an interactive form-filling experience through a chatbot.
- Allow users to share forms through unique public links.
- Collect and organize form submissions.
- Provide meaningful analytics and visual representations of collected responses.
- Offer a responsive and user-friendly interface.
- Provide a centralized dashboard for managing forms and their results.

---

## Core Features

### 1. User Authentication

Users can create accounts and securely access their personal dashboards.

Features include:

- User registration.
- User login.
- Password hashing and verification.
- JWT-based authentication.
- Protected API routes.
- Access token validation through authentication middleware.

### 2. Form Management

Users can create and manage their own forms.

Features include:

- Create new forms.
- View forms created by the authenticated user.
- Retrieve an individual form with its associated questions.
- Update existing forms.
- Publish and unpublish forms.
- Generate a unique public identifier for each form.
- Access publicly available forms without authentication.

### 3. Form Builder

The form builder allows users to create customized forms by adding different question types.

Supported question types:

| Question Type | Description |
|---|---|
| Text | Allows visitors to enter text. |
| Email | Collects email addresses. |
| Multiple Choice | Allows visitors to select from predefined options. |
| Yes/No | Allows visitors to choose between Yes and No. |

Additional capabilities:

- Add questions to a form.
- Specify question text.
- Configure question options where applicable.
- Mark questions as required or optional.
- Assign question positions.
- Delete questions.
- Preview forms before sharing.

### 4. Public Forms

Each form has a unique public identifier that allows visitors to access it through a public URL.

Features include:

- Public form access.
- Displaying form information and questions.
- Submitting responses without requiring an account.
- Restricting public access to forms that are published.

### 5. Interactive Chatbot

Formio provides a chatbot interface that guides visitors through the form-filling process.

The chatbot experience includes:

- Displaying a welcome message.
- Presenting one question at a time.
- Accepting text input and predefined button selections.
- Supporting basic input validation.
- Moving visitors through the questions.
- Displaying a completion message after submission.
- Providing a friendly animated chatbot character.

The chatbot is designed to make completing forms more interactive and straightforward.

### 6. Form Submissions

The platform collects and stores visitors' responses.

Features include:

- Submit completed forms.
- Store submission information.
- Associate submissions with their corresponding forms.
- Store answers associated with each submission.
- Retrieve submissions belonging to a specific form.
- View collected responses through the dashboard.

### 7. Analytics & Reporting

Formio provides analytics to help form owners understand their collected responses.

Features include:

- View total submissions.
- Analyze answers for individual questions.
- Display Yes/No response distributions.
- Analyze multiple-choice answers.
- Present analytics through visual charts and graphs.
- Switch between suitable visualization types, such as bar charts and pie charts.

Analytics must be based on actual submission data.

### 8. Form Sharing

Users can share published forms through their public links.

Supported sharing methods in the interface include:

- WhatsApp.
- SMS.
- Email.
- Facebook.

The sharing experience should allow users to conveniently distribute their forms to their audiences.

---

## Functional Requirements

### Authentication Requirements

1. A visitor must be able to create an account.
2. A registered user must be able to log in.
3. Passwords must be securely hashed before storage.
4. The system must authenticate protected requests using JWT access tokens.
5. Unauthenticated users must not access protected dashboard functionality.

### Form Requirements

1. Authenticated users must be able to create forms.
2. Users must be able to retrieve their own forms.
3. Users must be able to retrieve an individual form with its questions.
4. Users must be able to update their forms.
5. Users must be able to publish or unpublish their forms.
6. Each form must have a unique public identifier.
7. Public visitors must be able to access published forms.
8. Private forms must not be accessible through public form links.

### Question Requirements

1. A form must support multiple questions.
2. Each question must belong to a specific form.
3. Questions must support the defined question types.
4. Multiple-choice questions must support configurable options.
5. Questions must support required and optional settings.
6. Questions must maintain their assigned positions.
7. Form owners must be able to delete questions.

### Submission Requirements

1. Visitors must be able to submit responses to published forms.
2. Each submission must be associated with its form.
3. Answers must be associated with their corresponding submission and question.
4. Form owners must be able to retrieve submissions for their forms.

### Analytics Requirements

1. The system must provide analytics based on actual submissions.
2. Results must be grouped and presented according to question type.
3. Yes/No responses must be distinguishable.
4. Multiple-choice results must show the distribution of selected options.
5. Analytics must be accessible to the form owner.

### Frontend Requirements

1. The frontend must communicate with the backend through its existing API.
2. Dashboard data must reflect the actual backend responses.
3. Users must receive appropriate feedback after successful operations.
4. Forms, questions, submissions, and analytics must be displayed correctly.
5. The interface must support desktop, tablet, and mobile screens.

---

## User Workflow

The typical Formio workflow is:

1. A user visits the Formio landing page.
2. The user creates an account or logs in.
3. The user enters the dashboard.
4. The user creates a new form.
5. The user adds questions and configures them.
6. The user previews the form.
7. The user publishes the form.
8. The system provides a public link.
9. The user shares the link with their audience.
10. Visitors access the form and submit their responses.
11. The form owner views submissions and analytics through the dashboard.

---

## System Architecture

Formio follows a layered backend architecture that separates HTTP handling, business logic, data access, and database models.

### Backend Architecture

The backend is organized into the following layers:

| Layer | Responsibility |
|---|---|
| Controller | Handles HTTP requests and responses. |
| Service | Implements application business logic. |
| Repository | Defines data-access operations. |
| Provider | Implements repository operations using PostgreSQL. |
| Models | Defines database entities and application data structures. |
| Presenters | Formats data for API responses. |
| Middleware | Handles authentication and request protection. |
| Tokens | Handles JWT token creation and validation. |
| Configuration | Loads application configuration. |
| Utils | Contains reusable helper functions. |

### Frontend Architecture

The frontend uses the Next.js App Router and separates pages, reusable components, application contexts, API services, and TypeScript types.

Main responsibilities:

- App Router: Page routing and layouts.
- Components: Reusable UI elements.
- Contexts: Shared application state, including authentication.
- Services: Communication with backend APIs.
- Types: TypeScript definitions for application data.
- Lib: Shared constants and utility functions.

---

## Technology Stack

### Backend

- **Go:** Main backend programming language.
- **Gin:** HTTP web framework.
- **PostgreSQL:** Relational database.
- **GORM:** Database ORM.
- **JWT:** Token-based authentication.
- **Viper:** Application configuration management.

### Frontend

- **Next.js:** React-based web framework.
- **React:** User interface development.
- **TypeScript:** Static typing.
- **Tailwind CSS:** Styling and responsive design.

### Development Tools

- Git and GitHub for version control.
- Postman for API testing.
- PostgreSQL for database management.

---

## Project Structure

```text
omarelmadboly54-sketch-tynoc_tech/
│
├── go.mod
├── go.sum
│
├── Backend/
│   ├── main.go
│   │
│   ├── configuration/
│   │   └── configuration.go
│   │
│   ├── internal/
│   │   ├── apperrors/
│   │   ├── controller/
│   │   ├── models/
│   │   ├── presenters/
│   │   ├── providers/
│   │   │   └── postgres/
│   │   ├── repository/
│   │   ├── service/
│   │   └── utils/
│   │
│   ├── middleware/
│   │   └── middleware.go
│   │
│   ├── migrations/
│   │
│   └── tokens/
│
└── Frontend/
    ├── package.json
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── .env.example
    │
    └── src/
        ├── app/
        │   ├── (auth)/
        │   │   ├── login/
        │   │   └── register/
        │   │
        │   ├── (dashboard)/
        │   │   └── dashboard/
        │   │       └── forms/
        │   │
        │   ├── f/
        │   │   └── [publicId]/
        │   │
        │   └── forms/
        │
        ├── components/
        │   ├── chatbot/
        │   ├── dashboard/
        │   ├── layout/
        │   └── ui/
        │
        ├── contexts/
        ├── lib/
        ├── services/
        └── types/
```

---

## Database Design

The database uses PostgreSQL and contains the following main entities:

| Entity | Description |
|---|---|
| Users | Stores registered user information. |
| Forms | Stores forms created by users, including their publication information and public identifiers. |
| Questions | Stores questions associated with individual forms. |
| Submissions | Stores responses submitted by visitors to forms. |
| Answers | Stores individual answers associated with submissions and questions. |

### Entity Relationships

- One user can create multiple forms.
- One form can contain multiple questions.
- One form can receive multiple submissions.
- One submission can contain multiple answers.
- Each answer belongs to a submission and a question.

### Database Migrations

Database schema changes are managed through SQL migration files.

The current migration history includes:

1. Users table.
2. Forms table.
3. Questions table.
4. Submissions table.
5. Answers table.
6. Public ID column for forms.

---

## API Overview

The backend exposes API functionality through controllers and services.

The main API domains are:

| Domain | Responsibilities |
|---|---|
| Users | Registration and login. |
| Forms | Form creation, retrieval, updating, and publication management. |
| Questions | Adding, retrieving, and managing form questions. |
| Submissions | Collecting and retrieving form responses. |
| Analytics | Providing statistics and response analysis. |

The frontend communicates with these APIs through dedicated service modules:

- `users.service.ts`
- `forms.service.ts`
- `questions.service.ts`
- `submissions.service.ts`
- `analytics.service.ts`

Exact endpoint paths, request payloads, and response schemas are defined by the backend implementation.

---

## Authentication & Authorization

Formio uses JWT-based authentication.

The authentication workflow:

1. A user submits login credentials.
2. The backend verifies the credentials.
3. The backend generates an access token.
4. The frontend uses the access token when accessing protected API routes.
5. Authentication middleware validates incoming protected requests.

Public form access and authenticated dashboard operations are handled separately.

---

## User Interface & Experience

The frontend is designed to provide a modern SaaS experience.

### Branding

- Website name: Formio.
- Consistent branding across all pages.
- Dedicated Formio logo throughout the application.

### Landing Page

The landing page introduces the platform and explains its capabilities.

It includes:

- Hero section and calls to action.
- Platform features.
- How It Works section.
- Animated demonstration of the form creation and sharing workflow.
- Chatbot demonstration.
- Public form exploration.
- Footer and navigation.

### Authentication Pages

The Login and Sign Up pages provide a professional introduction to Formio.

Additional interface requirements:

- Password strength indicator.
- Password improvement suggestions.
- Google, Facebook, and X login buttons.
- Social login buttons display a Coming Soon message until backend integration is available.

### Dashboard

The dashboard provides a centralized workspace for users.

It includes:

- Forms overview.
- Form creation and management.
- Form publication controls.
- Individual form details.
- Questions.
- Submissions.
- Analytics.
- Form sharing.

The sidebar should be compact, organized, and responsive.

### Analytics Visualization

Users should be able to switch between suitable chart representations, including bar charts and pie charts.

Charts should:
- Display real analytics data.
- Use distinguishable colors for different answers.
- Display clear labels and values.
- Adapt to different screen sizes.
- Support both light and dark themes.

### Dark and Light Themes

The application supports two visual themes:

- Light mode.
- Dark mode.

Both themes must maintain readable text, sufficient contrast, and consistent styling across the entire interface.

### Chatbot Appearance

The chatbot should use a friendly animated character as its visual identity instead of relying only on the website logo.

---

## Non-Functional Requirements

### Security

- Passwords must be hashed before being stored.
- Protected API routes must require valid authentication.
- Users must only manage forms they are authorized to access.
- Public access must be limited to published forms.

### Performance

- API requests should be handled efficiently.
- Dashboard data should be loaded appropriately.
- The frontend should avoid unnecessary re-rendering and redundant API calls.

### Usability

- The interface should be intuitive and easy to navigate.
- Forms should be easy to create and complete.
- Important actions should provide clear feedback.
- Errors should be communicated in understandable messages.

### Responsiveness

The application should work correctly on:

- Desktop computers.
- Tablets.
- Mobile devices.

### Maintainability

- Backend responsibilities should remain separated into appropriate layers.
- Frontend components should be reusable.
- API communication should remain organized in service modules.
- TypeScript types should represent application data consistently.

---

## Future Improvements

The following enhancements are planned or subject to future development:

- Google authentication.
- Facebook authentication.
- X authentication.
- More advanced analytics and reporting.
- Additional form question types.
- Further chatbot customization and enhancements.

Social authentication is not currently supported by the backend. Its frontend buttons should therefore be presented as Coming Soon rather than functional authentication options.

---

## Getting Started

### Prerequisites

Make sure the following tools are installed:

- Go.
- PostgreSQL.
- Node.js and npm.
- Git.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd omarelmadboly54-sketch-tynoc_tech
```

### 2. Backend Setup

Configure the PostgreSQL database and provide the backend configuration values required by the application.

Run the database migrations using your configured migration tool.

Then start the backend:

```bash
go run ./Backend/main.go
```

The backend server address and database configuration should follow the project's configuration files.

### 3. Frontend Setup

Navigate to the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Configure the frontend environment variables using `.env.example`.

Start the development server:

```bash
npm run dev
```

The Next.js development server will display its local URL in the terminal.

---

## Project Status

Formio is under active development.

The backend includes the core architecture and functionality for authentication, forms, questions, submissions, and analytics.

The frontend is being improved to provide a more polished user experience, stronger dashboard functionality, better analytics visualization, and a consistent visual identity.

---



**Formio – Create. Share. Collect. Understand.**
