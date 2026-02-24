# Product Design Specification

Ethiopian Navigator MVP - Product Design & Customization Specification
1. Architecture Overview
The Ethiopian Navigator MVP is built on a microservices architecture leveraging Azure cloud services. The core components include a React frontend, Node.js backend, PostgreSQL and Cosmos DB databases, Azure AI Search, Azure OpenAI for chatbot functionality, and Blob Storage for document uploads. The system supports multilingual interactions (Amharic, Oromo, English) and role-based access for Citizens, Government Employees, Partners, and Admins.
2. Base Template Selection
The project will customize the Azure OpenAI template 'azure-search-openai-demo' which provides a Retrieval-Augmented Generation (RAG) framework combining Azure AI Search and OpenAI GPT models. This template includes a Python backend, React frontend, and integration with Azure services.
3. Customization Plan
The following customizations will be applied to the base template:
- Replace sample data with Ethiopian government service metadata and FAQs.
- Extend chatbot to support Amharic and Oromo using Amharic-BERT and GPT-4.
- Integrate PostgreSQL and Cosmos DB for structured and unstructured data.
- Modify UI to support role-based portals for Citizens, Admins, Government Employees, and Partners.
- Add document upload functionality using Azure Blob Storage.
- Implement feedback loop and service request tracking.
4. Integration Points
- Azure PostgreSQL: Service requests, user accounts, feedback.
- Azure Cosmos DB: Chatbot logs and training data.
- Azure Blob Storage: Document uploads.
- Azure AI Search: Service catalog indexing.
- Azure Key Vault: Secrets and credentials management.
- Azure Application Insights: Monitoring and telemetry.
5. Development Tasks
Frontend:
- Customize React components for each user role.
- Integrate chatbot widget with multilingual support.
- Implement dashboards and service application forms.
Backend:
- Set up PostgreSQL schema and APIs for service catalog, feedback, and requests.
- Integrate Cosmos DB for chatbot logging.
- Configure Azure AI Search indexing and retrieval.
- Implement authentication and RBAC.
6. Tracking Progress
- Use GitHub Projects or Azure Boards for task tracking.
- Maintain a changelog for each module.
- Document completed tasks and pending items in a shared dashboard.
7. Onboarding Guidance
- Provide access to GitHub repo and Azure portal.
- Share infrastructure provisioning scripts and environment variables.
- Maintain README files for each module with setup instructions.
- Create onboarding checklist for new developers.
8. Change Management
- All changes must be documented in the changelog.
- Use pull requests and code reviews for all updates.
- Maintain version control and tag releases.
- Update onboarding and documentation with each major change.

---

# Project Proposal

Ethiopian Navigator MVP - Project Proposal
1. Executive Summary
The Ethiopian Navigator MVP is a multilingual, citizen-centric digital platform designed to streamline access to government services. Leveraging Azure OpenAI and cloud-native architecture, the solution aims to improve transparency, efficiency, and user experience for citizens, government employees, and partners. This proposal outlines the technical and operational roadmap for customizing, developing, deploying, and maintaining the MVP.
2. Problem Statement
Citizens face challenges in discovering and accessing government services due to fragmented systems, language barriers, and lack of centralized information. Government agencies struggle with service delivery, feedback management, and performance tracking. There is a need for a unified, intelligent platform that simplifies service navigation and enhances engagement across stakeholders.
3. Proposed Solution
Customize the Azure OpenAI template (azure-search-openai-demo) to build the Ethiopian Navigator MVP. The platform will feature multilingual support, AI-powered search and chatbot, service catalog APIs, feedback mechanisms, and role-based portals for citizens, government employees, partners, and administrators. It will be deployed on Azure using scalable and secure cloud resources.
4. Objectives and Scope
Objectives:
- Deliver a functional MVP with core features for service discovery, application, tracking, and feedback.
- Enable multilingual interaction (Amharic, Oromo, English).
- Integrate AI chatbot and search capabilities.
- Provide role-based access and dashboards.

Scope:
- Backend and frontend development
- Azure resource provisioning
- AI chatbot integration
- Testing, deployment, and documentation
5. Technical Approach and Architecture
The solution will be based on a microservices architecture using Node.js for backend APIs, React.js for frontend UI, and Python for AI chatbot services. Azure resources include PostgreSQL Flexible Server, Cosmos DB, Blob Storage, Azure AI Search, Azure OpenAI, Key Vault, and App Service. The architecture supports modular development, scalability, and secure data handling.
6. Implementation Plan and Timeline
Phase 1: Project Setup and Planning (Week 1)
Phase 2: Backend and Database Development (Weeks 2-3)
Phase 3: Frontend Development and UI Customization (Weeks 4-5)
Phase 4: AI Chatbot Integration and Search Indexing (Weeks 6-7)
Phase 5: Testing and QA (Week 8)
Phase 6: Deployment and Go-Live (Week 9)
Phase 7: Documentation and Handover (Week 10)
7. Resource Requirements
Human Resources:
- Full-stack developer
- AI/NLP engineer
- UI/UX designer
- QA tester
- DevOps engineer

Technical Resources:
- Azure subscription with required services
- GitHub repository
- Visual Studio Code
- Postman or REST Client
- DBeaver or pgAdmin for database management
8. Expected Outcomes and Impact
The Ethiopian Navigator MVP will provide a centralized, intelligent platform for accessing government services. It will improve citizen satisfaction, reduce service delivery time, and enhance transparency. Government agencies will benefit from streamlined workflows, feedback analytics, and performance tracking.
9. Risk Management and Mitigation
Risks:
- Delays in Azure resource provisioning
- Integration challenges with multilingual NLP
- Data security and privacy concerns

Mitigation:
- Use pre-approved Azure templates and automation scripts
- Leverage existing NLP models and test early
- Implement RBAC, encryption, and secure storage practices

---

# Project Proposal Updated

Ethiopian Navigator MVP - Project Proposal
1. Executive Summary
The Ethiopian Navigator MVP is a multilingual, citizen-centric digital platform designed to streamline access to government services. Leveraging Azure OpenAI and cloud-native architecture, the solution aims to improve transparency, efficiency, and user experience for citizens, government employees, and partners. This proposal outlines the technical and operational roadmap for customizing, developing, deploying, and maintaining the MVP.
2. Problem Statement
Citizens face challenges in discovering and accessing government services due to fragmented systems, language barriers, and lack of centralized information. Government agencies struggle with service delivery, feedback management, and performance tracking. There is a need for a unified, intelligent platform that simplifies service navigation and enhances engagement across stakeholders.
3. Proposed Solution
Customize the Azure OpenAI template (azure-search-openai-demo) to build the Ethiopian Navigator MVP. The platform will feature multilingual support, AI-powered search and chatbot, service catalog APIs, feedback mechanisms, and role-based portals for citizens, government employees, partners, and administrators. It will be deployed on Azure using scalable and secure cloud resources.
4. Objectives and Scope
Objectives:
- Deliver a functional MVP with core features for service discovery, application, tracking, and feedback.
- Enable multilingual interaction (Amharic, Oromo, English).
- Integrate AI chatbot and search capabilities.
- Provide role-based access and dashboards.

Scope:
- Backend and frontend development
- Azure resource provisioning
- AI chatbot integration
- Testing, deployment, and documentation
5. Technical Approach and Architecture
The solution will be based on a microservices architecture using Node.js for backend APIs, React.js for frontend UI, and Python for AI chatbot services. Azure resources include PostgreSQL Flexible Server, Cosmos DB, Blob Storage, Azure AI Search, Azure OpenAI, Key Vault, and App Service. The architecture supports modular development, scalability, and secure data handling.
6. Implementation Plan and Timeline
Phase 1: Project Setup and Planning (Week 1)
Phase 2: Backend and Database Development (Weeks 2-3)
Phase 3: Frontend Development and UI Customization (Weeks 4-5)
Phase 4: AI Chatbot Integration and Search Indexing (Weeks 6-7)
Phase 5: Testing and QA (Week 8)
Phase 6: Deployment and Go-Live (Week 9)
Phase 7: Documentation and Handover (Week 10)
7. Resource Requirements
Human Resources:
- Full-stack developer
- AI/NLP engineer
- UI/UX designer
- QA tester
- DevOps engineer

Technical Resources:
- Azure subscription with required services
- GitHub repository
- Visual Studio Code
- Postman or REST Client
- DBeaver or pgAdmin for database management
8. Expected Outcomes and Impact
The Ethiopian Navigator MVP will provide a centralized, intelligent platform for accessing government services. It will improve citizen satisfaction, reduce service delivery time, and enhance transparency. Government agencies will benefit from streamlined workflows, feedback analytics, and performance tracking.
9. Risk Management and Mitigation
Risks:
- Delays in Azure resource provisioning
- Integration challenges with multilingual NLP
- Data security and privacy concerns

Mitigation:
- Use pre-approved Azure templates and automation scripts
- Leverage existing NLP models and test early
- Implement RBAC, encryption, and secure storage practices
10. Budget Breakdown and Cost Estimate

The estimated budget for the Ethiopian Navigator MVP is based on Azure resource usage, development effort, and operational costs.

### Azure Resource Estimate (Monthly)
- Azure App Service (Web App): $30
- Azure PostgreSQL Flexible Server: $60
- Azure Cosmos DB (MongoDB API): $40
- Azure Blob Storage: $10
- Azure OpenAI Service: $100
- Azure AI Search: $30
- Azure Key Vault, Application Insights, Log Analytics: $30
- Total Estimated Monthly Cost: **$300**

### Development Effort Estimate
- Full-stack Developer (1): $4,000/month × 3 months = $12,000
- AI/NLP Specialist (1): $4,500/month × 2 months = $9,000
- UI/UX Designer (1): $3,000/month × 2 months = $6,000
- Project Manager (1): $3,500/month × 3 months = $10,500
- Total Development Cost: **$37,500**

### Other Costs
- Tools & Licenses: $500
- Contingency (10%): $3,800
- Total Estimated Project Cost: **$42,100**

11. Work Breakdown Structure (WBS)

The WBS outlines the major components and tasks for the Ethiopian Navigator MVP:

1. Planning & Requirements
   - Define objectives
   - Finalize documentation
   - Stakeholder alignment

2. Azure Infrastructure Setup
   - Provision resource group
   - Deploy PostgreSQL, Cosmos DB, Blob Storage
   - Configure Key Vault, AI Search, App Insights

3. Backend Development
   - Set up Express.js server
   - Implement authentication & RBAC
   - Build service catalog, feedback, chatbot APIs

4. Frontend Development
   - Build citizen portal (React)
   - Build admin and government portals
   - Integrate multilingual support

5. AI Chatbot Integration
   - Customize Azure OpenAI template
   - Integrate GPT-4 and Amharic-BERT
   - Connect to service metadata and feedback

6. Testing & QA
   - Unit and integration testing
   - UAT and performance testing
   - Bug fixing and validation

7. Deployment & Monitoring
   - Configure CI/CD pipelines
   - Set up monitoring and alerts
   - Prepare go-live checklist

8. Documentation & Onboarding
   - Developer onboarding guide
   - API documentation
   - User manuals

12. Project Timeline

The Ethiopian Navigator MVP is planned over a 12-week period:

- Week 1–2: Planning, documentation finalization, Azure setup
- Week 3–5: Backend and database development
- Week 6–8: Frontend development and UI integration
- Week 9–10: AI chatbot customization and integration
- Week 11: Testing, bug fixing, and performance validation
- Week 12: Final deployment, monitoring setup, and go-live

Total Duration: **12 Weeks**


---

# Terms of Reference

Terms of Reference (ToR): Ethiopian Navigator MVP Project
1. Project Background and Objectives
The Ethiopian Navigator MVP is a multilingual, citizen-centric government service portal designed to streamline public service delivery. It leverages Azure OpenAI, Azure AI Search, and a microservices architecture to provide transparent, efficient, and accessible services to citizens, government employees, partners, and administrators. The objective is to build a scalable MVP that integrates AI-driven service discovery, feedback mechanisms, and multilingual support for Amharic, Oromo, and English.
2. Scope of Work
The scope includes customizing an Azure OpenAI template, developing backend and frontend modules, integrating an AI chatbot, provisioning Azure resources, setting up CI/CD pipelines, conducting testing and QA, and deploying the MVP to production. The system will support multiple user roles and provide service catalog, application tracking, feedback submission, and analytics.
3. Customization of Azure OpenAI Template
The project will customize the 'azure-search-openai-demo' template to serve as the foundation for the Ethiopian Navigator. This includes replacing sample data with government service metadata, extending the chatbot to support local languages, integrating with PostgreSQL and Cosmos DB, and modifying the UI to reflect Ethiopian branding.
4. Development Phases
4.1 Backend Development
Develop RESTful APIs for authentication, service catalog, service requests, feedback, and chatbot integration. Integrate PostgreSQL for structured data, Cosmos DB for chat logs, Blob Storage for document uploads, and Azure AI Search for service discovery.
4.2 Frontend Development
Build React.js components for citizen, admin, government employee, and partner portals. Implement multilingual support, accessibility features, and responsive design.
4.3 AI Chatbot Integration
Extend GPT-4 with Amharic-BERT for local language understanding. Integrate service metadata and FAQs into the chatbot knowledge base. Enable personalized checklists and feedback loop.
5. Testing and Quality Assurance
Conduct unit, integration, and performance testing. Validate chatbot accuracy and multilingual support. Perform user acceptance testing (UAT) and resolve reported issues.
6. Deployment and Go-Live Strategy
Set up CI/CD pipelines using GitHub Actions. Deploy to Azure App Services with monitoring via Application Insights and Log Analytics. Configure Traffic Manager and cost alerts. Prepare user manuals and onboarding materials. Execute go-live checklist and monitor system health post-launch.
7. Roles and Responsibilities
Product Owner: Define vision, approve designs, provide content, coordinate stakeholders.
Full-Stack Developer: Customize template, develop backend and frontend, integrate AI chatbot, set up CI/CD, maintain documentation.
QA Engineer: Conduct testing, report bugs, validate fixes.
DevOps Engineer: Manage deployment, monitor infrastructure, configure alerts.
Content Team: Prepare service metadata, FAQs, and chatbot training data.
8. Tools and Technologies
Azure OpenAI, Azure AI Search, Azure App Services, Azure PostgreSQL, Azure Cosmos DB, Azure Blob Storage, Azure Key Vault, GitHub, GitHub Actions, Visual Studio Code, Node.js, Express.js, React.js, Python, Amharic-BERT, GPT-4, Swagger, Postman, DBeaver.
9. Deliverables and Timeline
Deliverables:
- Customized Azure OpenAI template
- Backend and frontend modules
- AI chatbot integration
- Azure infrastructure setup
- CI/CD pipelines
- Testing reports
- Deployment scripts
- Documentation and onboarding guides

Timeline:
Week 1-2: Setup and customization
Week 3-4: Backend and frontend development
Week 5: AI chatbot integration
Week 6: Testing and QA
Week 7: Deployment and go-live
Week 8: Post-launch monitoring and support

---

# Project Summary

Ethiopian Navigator MVP - Project Summary
1. Project Overview
The Ethiopian Navigator MVP is a multilingual, citizen-centric government service portal built on Azure. It leverages Azure OpenAI, AI Search, and a microservices architecture to deliver transparent and efficient G2C services. The project is based on the Azure OpenAI RAG template (azure-search-openai-demo) and is being customized to meet the needs of Ethiopian citizens, government employees, partners, and administrators.
2. Objectives
- Customize the Azure OpenAI demo template to build the Ethiopian Navigator MVP.
- Implement multilingual support (Amharic, Oromo, English).
- Develop backend APIs for authentication, service catalog, feedback, and chatbot.
- Build React frontend for citizen, admin, government, and partner portals.
- Integrate PostgreSQL, Cosmos DB, Blob Storage, and Azure AI Search.
- Set up CI/CD pipelines, monitoring, and developer onboarding documentation.
3. Completed Work
- Forked the Azure OpenAI demo template into GitHub.
- Cloned the repository locally using VS Code terminal.
- Created project folder structure: frontend, backend, ai-chatbot, infrastructure, docs, onboarding.
- Added initial README.md with project overview and setup instructions.
- Initialized backend project with npm and installed core dependencies.
- Created and tested Express server (server.js).
- Created .env, db.js, and auth.js files for PostgreSQL and authentication.
- Created routes folder and integrated auth routes into server.js.
- Connected to Azure PostgreSQL using VS Code.
- Created users table in PostgreSQL.
4. Remaining Tasks
- Test authentication endpoints using REST Client.
- Build service catalog APIs.
- Develop React frontend components.
- Integrate AI chatbot with GPT-4 and Amharic-BERT.
- Set up Azure AI Search indexing.
- Implement feedback and notification modules.
- Configure CI/CD pipelines and monitoring tools.
- Finalize onboarding documentation and changelogs.
5. Task Checklist
☑ Fork Azure OpenAI demo template
☑ Clone repo locally using VS Code
☑ Create project folder structure
☑ Add initial README.md
☑ Initialize backend with npm
☑ Install backend dependencies
☑ Create and test Express server
☑ Create .env, db.js, auth.js
☑ Create routes folder and integrate auth
☑ Connect to Azure PostgreSQL
☑ Create users table
☐ Test authentication endpoints
☐ Build service catalog APIs
☐ Develop React frontend components
☐ Integrate AI chatbot
☐ Set up Azure AI Search indexing
☐ Implement feedback and notification modules
☐ Configure CI/CD pipelines
☐ Finalize onboarding documentation
6. Next Steps
- Test the authentication endpoints using REST Client.
- Begin development of service catalog APIs.
- Start building frontend components for citizen portal.
- Prepare chatbot training data and integrate GPT-4 and Amharic-BERT.
- Set up Azure AI Search indexing for service metadata.
- Continue documenting progress and onboarding materials.

---

# Development Summary

Ethiopian Navigator MVP – Development Summary
1. Project Overview
The Ethiopian Navigator MVP is a multilingual, citizen-centric government service portal built on Azure. It leverages Azure OpenAI, AI Search, PostgreSQL, Cosmos DB, and a microservices architecture to deliver transparent, efficient, and accessible G2C services. The project is based on the customization of the 'azure-search-openai-demo' template and aims to provide a scalable platform for service discovery, application tracking, feedback, and chatbot assistance.
2. Objectives
- Customize the Azure OpenAI demo template to fit Ethiopian Navigator requirements.
- Build backend APIs for authentication, service catalog, feedback, and chatbot.
- Develop a multilingual React frontend for citizens, admins, government employees, and partners.
- Integrate GPT-4 and Amharic-BERT for AI chatbot functionality.
- Set up CI/CD pipelines, monitoring, and onboarding documentation.
3. Completed Work
- Forked and cloned the azure-search-openai-demo repository.
- Set up GitHub repository structure with folders for frontend, backend, ai-chatbot, infrastructure, docs, and onboarding.
- Created and committed README.md with project overview and setup instructions.
- Initialized backend with Express.js and installed core dependencies.
- Created and tested basic Express server.
- Created .env, db.js, and auth.js files for PostgreSQL integration and authentication routes.
- Created routes folder and integrated auth routes into server.js.
- Connected to Azure PostgreSQL Flexible Server using VS Code.
- Created users table in PostgreSQL.
- Tested API endpoints using REST Client in VS Code.
4. Remaining Tasks
- Finalize and test authentication endpoints with PostgreSQL.
- Build service catalog APIs and database schema.
- Develop React frontend components for all user roles.
- Integrate AI chatbot with GPT-4 and Amharic-BERT.
- Set up Azure AI Search indexing and RAG pipeline.
- Implement feedback and notification modules.
- Configure CI/CD pipelines and monitoring tools.
- Prepare onboarding checklist and changelog documentation.
5. Task Checklist
☑ Fork and clone base template
☑ Set up GitHub repo structure
☑ Create README.md
☑ Initialize backend and install dependencies
☑ Create and run Express server
☑ Create .env, db.js, auth.js
☑ Create routes folder and integrate auth routes
☑ Connect to Azure PostgreSQL
☑ Create users table
☑ Test API endpoints
☐ Build service catalog APIs
☐ Develop React frontend
☐ Integrate AI chatbot
☐ Set up Azure AI Search
☐ Implement feedback module
☐ Configure CI/CD pipelines
☐ Prepare onboarding documentation
6. Next Steps
- Proceed with building service catalog APIs and database schema.
- Begin frontend development for citizen and admin portals.
- Integrate AI chatbot and test multilingual support.
- Set up Azure AI Search and RAG pipeline.
- Configure CI/CD workflows and monitoring tools.
- Finalize onboarding documentation and changelog.

---

# Work Plan

Ethiopian Navigator MVP - Full Development & Deployment Work Plan
This document outlines the comprehensive work plan for developing and deploying the Ethiopian Navigator MVP. It includes step-by-step procedures, tools, and guidance across all phases of the project lifecycle.
1. Planning & Requirements
• Review product design and specification documents.
• Define user personas, workflows, and service catalog.
• Select base template: azure-search-openai-demo.
• Establish GitHub repository and branching strategy.
2. Development Environment Setup
• Install Visual Studio Code and required extensions (REST Client, ESLint, Prettier).
• Install Node.js, Python 3, and PostgreSQL client tools.
• Fork and clone the azure-search-openai-demo repository.
• Create project structure: frontend/, backend/, ai-chatbot/, infrastructure/, docs/, onboarding/.
3. Azure Resource Provisioning
• Create resource group: ethiopian-navigator-rg.
• Provision PostgreSQL Flexible Server, Cosmos DB, Blob Storage, Azure AI Search, Key Vault, App Service.
• Configure firewall rules and SSL settings for database access.
• Store secrets in Azure Key Vault and link to backend.
4. Backend Development
• Initialize Node.js project in backend/ and install dependencies.
• Create Express server and configure environment variables.
• Implement authentication (JWT, bcrypt) and RBAC.
• Build APIs for service catalog, feedback, chatbot, and document uploads.
• Connect to PostgreSQL and Cosmos DB.
5. Frontend Development
• Initialize React project in frontend/.
• Build citizen portal: homepage, service catalog, application form, dashboard.
• Build admin portal: service management, analytics, feedback routing.
• Build government and partner portals.
• Integrate multilingual support (Amharic, Oromo, English).
6. AI Chatbot Integration
• Set up Python environment in ai-chatbot/.
• Integrate GPT-4 and Amharic-BERT for multilingual NLP.
• Implement RAG using Azure AI Search and service metadata.
• Enable personalized checklists and feedback loop.
• Log interactions in Cosmos DB.
7. Testing & QA
• Write unit and integration tests for backend and frontend.
• Test API endpoints using REST Client or Postman.
• Conduct user acceptance testing (UAT).
• Validate chatbot accuracy and multilingual responses.
8. Deployment & Monitoring
• Configure GitHub Actions for CI/CD pipelines.
• Deploy backend and frontend to Azure App Service.
• Set up Application Insights and Log Analytics.
• Enable cost alerts and auto-scaling policies.
9. Documentation & Onboarding
• Maintain README.md with setup and contribution guidelines.
• Create developer onboarding guide and checklist.
• Document API endpoints using Swagger.
• Track progress using GitHub project board and changelog.

---

# Technical Blueprint

Ethiopian Navigator MVP - Technical Blueprint
1. Azure OpenAI Template Selection and Customization Strategy
The Ethiopian Navigator MVP is built upon the 'azure-search-openai-demo' template, which provides a Retrieval-Augmented Generation (RAG) architecture using Azure OpenAI and Azure AI Search. This template was selected for its modular design, support for multilingual chat, and integration with Azure services. Customization includes replacing sample data with Ethiopian government service metadata, extending the chatbot to support Amharic and Oromo using Amharic-BERT, and modifying the UI for citizen, admin, and government employee roles.
2. Azure Resource Provisioning and Configuration
Azure resources provisioned include:
- Resource Group: ethiopian-navigator-rg
- PostgreSQL Flexible Server: ethionav-postgres-server
- Cosmos DB (MongoDB API): ethionav-cosmosdb
- App Service Plan and Web App: ethionav-backend
- Storage Account for document uploads
- Azure AI Search for service catalog indexing
- Azure Key Vault for secrets management
- Application Insights and Log Analytics for monitoring
Firewall rules and SSL configurations were applied to enable secure access from local development environments.
3. GitHub Repository Setup and Structure
The GitHub repository is forked from the Azure template and renamed to 'ethiopian-navigator-mvpv1'. The structure includes:
- frontend/: React.js UI components
- backend/: Node.js Express APIs
- ai-chatbot/: Python GPT-4 and Amharic-BERT integration
- infrastructure/: Azure provisioning scripts
- docs/: Product design and architecture documentation
- onboarding/: Developer onboarding guides
README.md and .env files are configured for environment setup and contribution guidelines.
4. Visual Studio Code Environment Setup
VS Code is used for development with the following setup:
- Git integration for version control
- REST Client extension for API testing
- Node.js and Python environments configured
- Terminal access for running backend server and managing dependencies
- Folder structure aligned with GitHub repository
5. Backend and Frontend Development Plan
Backend:
- Initialize Express server with authentication and service catalog APIs
- Connect to PostgreSQL using pg module
- Implement JWT-based authentication and role-based access control
- Create REST endpoints for citizen requests, feedback, and chatbot queries

Frontend:
- Build React components for citizen, admin, government, and partner portals
- Integrate multilingual support and Ethiopian branding
- Connect frontend to backend APIs using Axios
- Implement dashboard, service catalog, and application forms
6. AI Chatbot Integration
The AI chatbot is built using GPT-4 and Amharic-BERT for multilingual support. Integration includes:
- RAG pipeline using Azure AI Search
- Chatbot endpoints in Python with Flask or FastAPI
- Logging and training data stored in Cosmos DB
- Personalized checklists and escalation to human support
- Embedding chatbot widget in frontend UI
7. CI/CD and Monitoring Setup
CI/CD is configured using GitHub Actions:
- Automated build and deployment to Azure Web App
- Secrets managed via Azure Key Vault
- Application Insights for performance monitoring
- Log Analytics for error tracking
- Cost alerts and auto-scaling policies applied
8. Developer Onboarding and Documentation Practices
Developer onboarding includes:
- Onboarding checklist in onboarding/ folder
- README.md with setup instructions and contribution guidelines
- API documentation using Swagger
- Changelog and versioning maintained
- Architecture diagrams and workflow maps in docs/

---

# Low Level Design

Ethiopian Navigator MVP - Low-Level Design (LLD)
1. Module Breakdown
The Ethiopian Navigator MVP consists of the following modules:
- Frontend (React.js): Citizen Portal, Admin Portal, Government Employee Portal, Partner Portal.
- Backend (Node.js/Express): REST APIs for authentication, service catalog, feedback, chatbot, and file uploads.
- AI Chatbot (Python): GPT-4 and Amharic-BERT integration with RAG using Azure AI Search.
- Database: PostgreSQL for structured data, Cosmos DB for chat logs and feedback.
- Search: Azure AI Search for indexing service metadata and documents.
2. API Specifications
Key API endpoints:
- POST /api/auth/register: Register a new user.
- POST /api/auth/login: Authenticate user and return JWT.
- GET /api/services: Retrieve list of services.
- POST /api/requests: Submit a service request.
- POST /api/feedback: Submit feedback.
- POST /api/chatbot/query: Query the AI chatbot.
- POST /api/upload: Upload documents to Azure Blob Storage.
3. Data Models and Entity Relationships
Primary entities:
- User: id, email, password, role
- Service: id, title, description, category, metadata
- Request: id, user_id, service_id, status, submitted_at
- Feedback: id, user_id, message, rating, submitted_at
- ChatLog: id, user_id, query, response, timestamp

Relationships:
- One User can submit many Requests and Feedback entries.
- Each Request is linked to one Service.
- ChatLogs are linked to Users for personalization and training.
4. Component Interactions
- Frontend communicates with Backend via REST APIs.
- Backend interacts with PostgreSQL and Cosmos DB for data persistence.
- Backend invokes Python-based AI Chatbot for query responses.
- AI Chatbot uses Azure AI Search to retrieve relevant documents.
- Blob Storage handles document uploads and retrievals.
5. Sequence Diagrams
Example: Service Request Submission
1. User submits request via frontend.
2. Frontend sends POST /api/requests to backend.
3. Backend validates JWT and request data.
4. Backend stores request in PostgreSQL.
5. Backend returns confirmation to frontend.
6. Error Handling Strategy
- Use try-catch blocks in backend and chatbot modules.
- Return standardized error responses with HTTP status codes.
- Log errors using Application Insights.
- Display user-friendly error messages in frontend.
- Validate inputs at both frontend and backend.
7. Security and Access Control
- Use JWT for authentication and role-based access control.
- Store secrets in Azure Key Vault.
- Use HTTPS for all communications.
- Validate and sanitize all inputs.
- Implement CORS policies and rate limiting.
8. Deployment Architecture
- Azure App Service hosts frontend and backend.
- PostgreSQL Flexible Server for structured data.
- Cosmos DB for unstructured data.
- Azure Blob Storage for file uploads.
- Azure AI Search for document indexing.
- Azure OpenAI for chatbot responses.
- CI/CD via GitHub Actions and Azure DevOps.
9. Monitoring and Logging
- Use Azure Application Insights for performance and error tracking.
- Enable logging in backend and chatbot modules.
- Monitor database performance and query execution.
- Set up alerts for resource usage and failures.
- Use Azure Log Analytics for centralized log management.

---

# Azure Resource Blueprint

Azure Resource Setup Blueprint for Ethiopian Navigator MVP
This blueprint provides a step-by-step guide for provisioning and configuring Azure resources required for the Ethiopian Navigator MVP. It includes PowerShell scripts, configuration instructions, and best practices for deploying core services such as PostgreSQL, Cosmos DB, Blob Storage, Azure AI Search, Key Vault, App Service, and Application Insights.
1. Prerequisites
- Azure subscription with sufficient quota
- Azure PowerShell module installed
- Admin access to create and manage resources
- Visual Studio Code with Azure extensions (optional)
2. Provision Resource Group
Use the following PowerShell script to create a resource group:
$location = 'Central US'
$resourceGroupName = 'ethiopian-navigator-rg'
New-AzResourceGroup -Name $resourceGroupName -Location $location
3. Provision PostgreSQL Flexible Server
PowerShell script to create a PostgreSQL server:
$serverName = 'ethionav-postgres-server'
$adminUser = 'Enavadmin'
$adminPassword = 'YourSecurePassword123!'
New-AzPostgreSqlFlexibleServer -ResourceGroupName $resourceGroupName -Name $serverName -Location $location -AdministratorLogin $adminUser -AdministratorLoginPassword (ConvertTo-SecureString $adminPassword -AsPlainText -Force) -SkuName 'Standard_B1ms' -StorageSizeInGB 32 -Version '13'
4. Provision Cosmos DB (MongoDB API)
PowerShell script to create a Cosmos DB account:
$cosmosName = 'ethionav-cosmosdb'
New-AzCosmosDBAccount -ResourceGroupName $resourceGroupName -Name $cosmosName -Location $location -Kind MongoDB -DefaultConsistencyLevel 'Session' -EnableAutomaticFailover $true
5. Provision Azure Blob Storage
PowerShell script to create a storage account:
$storageName = 'ethionavstorage'
New-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageName -Location $location -SkuName 'Standard_LRS' -Kind 'StorageV2'
6. Provision Azure AI Search
PowerShell script to create a search service:
$searchName = 'ethionav-search'
New-AzSearchService -ResourceGroupName $resourceGroupName -Name $searchName -Location $location -Sku 'Basic'
7. Provision Azure Key Vault
PowerShell script to create a Key Vault:
$keyVaultName = 'ethionav-keyvault'
New-AzKeyVault -Name $keyVaultName -ResourceGroupName $resourceGroupName -Location $location
8. Provision App Service and App Plan
PowerShell script to create an App Service Plan and Web App:
$appPlanName = 'ethionav-appplan'
$webAppName = 'ethionav-backend'
New-AzAppServicePlan -Name $appPlanName -Location $location -ResourceGroupName $resourceGroupName -Tier 'Basic' -NumberofWorkers 1
New-AzWebApp -Name $webAppName -Location $location -AppServicePlan $appPlanName -ResourceGroupName $resourceGroupName
9. Provision Application Insights
PowerShell script to create Application Insights:
$appInsightsName = 'ethionav-insights'
New-AzApplicationInsights -ResourceGroupName $resourceGroupName -Name $appInsightsName -Location $location -Kind 'web'
10. Best Practices
- Use secure passwords and store them in Azure Key Vault
- Enable diagnostic logging for all services
- Use tags for resource management and cost tracking
- Set up role-based access control (RBAC)
- Monitor usage and set up alerts for cost and performance

---

# Azure Resource Blueprint Updated

Azure Resource Setup Blueprint for Ethiopian Navigator MVP
This blueprint provides a step-by-step guide for provisioning and configuring Azure resources required for the Ethiopian Navigator MVP. It includes PowerShell scripts, configuration instructions, and best practices for deploying core services such as PostgreSQL, Cosmos DB, Blob Storage, Azure AI Search, Key Vault, App Service, and Application Insights.
1. Prerequisites
- Azure subscription with sufficient quota
- Azure PowerShell module installed
- Admin access to create and manage resources
- Visual Studio Code with Azure extensions (optional)
2. Provision Resource Group
Use the following PowerShell script to create a resource group:
$location = 'Central US'
$resourceGroupName = 'ethiopian-navigator-rg'
New-AzResourceGroup -Name $resourceGroupName -Location $location
3. Provision PostgreSQL Flexible Server
PowerShell script to create a PostgreSQL server:
$serverName = 'ethionav-postgres-server'
$adminUser = 'Enavadmin'
$adminPassword = 'YourSecurePassword123!'
New-AzPostgreSqlFlexibleServer -ResourceGroupName $resourceGroupName -Name $serverName -Location $location -AdministratorLogin $adminUser -AdministratorLoginPassword (ConvertTo-SecureString $adminPassword -AsPlainText -Force) -SkuName 'Standard_B1ms' -StorageSizeInGB 32 -Version '13'
4. Provision Cosmos DB (MongoDB API)
PowerShell script to create a Cosmos DB account:
$cosmosName = 'ethionav-cosmosdb'
New-AzCosmosDBAccount -ResourceGroupName $resourceGroupName -Name $cosmosName -Location $location -Kind MongoDB -DefaultConsistencyLevel 'Session' -EnableAutomaticFailover $true
5. Provision Azure Blob Storage
PowerShell script to create a storage account:
$storageName = 'ethionavstorage'
New-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageName -Location $location -SkuName 'Standard_LRS' -Kind 'StorageV2'
6. Provision Azure AI Search
PowerShell script to create a search service:
$searchName = 'ethionav-search'
New-AzSearchService -ResourceGroupName $resourceGroupName -Name $searchName -Location $location -Sku 'Basic'
7. Provision Azure Key Vault
PowerShell script to create a Key Vault:
$keyVaultName = 'ethionav-keyvault'
New-AzKeyVault -Name $keyVaultName -ResourceGroupName $resourceGroupName -Location $location
8. Provision App Service and App Plan
PowerShell script to create an App Service Plan and Web App:
$appPlanName = 'ethionav-appplan'
$webAppName = 'ethionav-backend'
New-AzAppServicePlan -Name $appPlanName -Location $location -ResourceGroupName $resourceGroupName -Tier 'Basic' -NumberofWorkers 1
New-AzWebApp -Name $webAppName -Location $location -AppServicePlan $appPlanName -ResourceGroupName $resourceGroupName
9. Provision Application Insights
PowerShell script to create Application Insights:
$appInsightsName = 'ethionav-insights'
New-AzApplicationInsights -ResourceGroupName $resourceGroupName -Name $appInsightsName -Location $location -Kind 'web'
10. Best Practices
- Use secure passwords and store them in Azure Key Vault
- Enable diagnostic logging for all services
- Use tags for resource management and cost tracking
- Set up role-based access control (RBAC)
- Monitor usage and set up alerts for cost and performance
Sample PowerShell Scripts for Azure Resource Provisioning

# Create Resource Group
New-AzResourceGroup -Name "ethiopian-navigator-rg" -Location "Central US"

# Create PostgreSQL Flexible Server
New-AzPostgreSqlFlexibleServer -ResourceGroupName "ethiopian-navigator-rg" `
  -Name "ethionav-postgres-server" `
  -Location "Central US" `
  -SkuName "Standard_B1ms" `
  -StorageSizeInGB 32 `
  -AdministratorLogin "Enavadmin" `
  -AdministratorLoginPassword (ConvertTo-SecureString "YourSecurePassword123!" -AsPlainText -Force)

# Create Cosmos DB Account
New-AzCosmosDBAccount -ResourceGroupName "ethiopian-navigator-rg" `
  -Name "ethionav-cosmosdb" `
  -Location "Central US" `
  -Kind MongoDB `
  -DefaultConsistencyLevel "Session"

# Create Storage Account
New-AzStorageAccount -ResourceGroupName "ethiopian-navigator-rg" `
  -Name "ethionavstorage" `
  -Location "Central US" `
  -SkuName "Standard_LRS" `
  -Kind "StorageV2"

# Create Azure AI Search
New-AzSearchService -ResourceGroupName "ethiopian-navigator-rg" `
  -Name "ethionav-search" `
  -Location "Central US" `
  -Sku "standard"

# Create Key Vault
New-AzKeyVault -ResourceGroupName "ethiopian-navigator-rg" `
  -VaultName "ethionav-keyvault" `
  -Location "Central US"

# Create App Service Plan and Web App
New-AzAppServicePlan -Name "ethionav-plan" -Location "Central US" `
  -ResourceGroupName "ethiopian-navigator-rg" -Tier "Basic" -NumberofWorkers 1

New-AzWebApp -Name "ethionav-backend" -Location "Central US" `
  -AppServicePlan "ethionav-plan" -ResourceGroupName "ethiopian-navigator-rg"

Troubleshooting Guide for Azure Resource Setup
Permission Errors
Ensure you are logged in with an account that has Contributor or Owner role on the subscription. Use `Connect-AzAccount` to authenticate.
Resource Quota Limits
Check your subscription limits for resources like cores, storage, and IP addresses. Use `Get-AzSubscription` and `Get-AzVMUsage` to inspect quotas.
Connectivity Problems
Verify your local IP is added to the firewall rules for services like PostgreSQL and Cosmos DB. Use `New-AzPostgreSqlFlexibleServerFirewallRule` to add access.
SSL Connection Issues
Ensure SSL is enabled when connecting to Azure PostgreSQL. Use `sslmode=require` in connection strings.
Name Conflicts
Resource names must be globally unique. Append a random suffix or use a naming convention to avoid conflicts.
Region Availability
Ensure the selected region supports the desired resource type. Use `Get-AzLocation` to list available regions and services.

---

# Secrets Management Guide

Secure Secrets Management Guide for Ethiopian Navigator MVP
1. Overview of Secrets and Sensitive Data
Secrets and sensitive data include API keys, database credentials, encryption keys, access tokens, and configuration values. Proper management of these secrets is critical to ensure the security and integrity of the Ethiopian Navigator MVP system.
2. Azure Key Vault Setup and Usage
Azure Key Vault is used to securely store and manage secrets, keys, and certificates. To set up Azure Key Vault:
1. Create a Key Vault resource in the Azure portal.
2. Assign access policies to allow applications and users to retrieve secrets.
3. Use the Azure CLI or portal to add secrets (e.g., database connection strings, API keys).
4. Integrate Key Vault with your applications using SDKs or environment variables.
3. Best Practices for Storing and Accessing Secrets
• Never hard-code secrets in source code.
• Use environment variables or secure configuration files.
• Limit access to secrets using RBAC and access policies.
• Use managed identities to access Key Vault from Azure services.
• Encrypt secrets at rest and in transit.
4. Integration with Backend and CI/CD Pipelines
• Use Azure Managed Identity to allow backend services to access Key Vault without storing credentials.
• In CI/CD pipelines (e.g., GitHub Actions), use secure secrets storage and inject secrets at runtime.
• Avoid logging secrets in build or deployment logs.
• Use Key Vault references in App Service configuration settings.
5. Rotation and Auditing Strategies
• Rotate secrets periodically to reduce risk.
• Use automation scripts to rotate secrets and update dependent services.
• Enable Key Vault logging and diagnostics to monitor access and changes.
• Review access policies regularly and remove unused secrets.
6. Common Mistakes to Avoid
• Storing secrets in source code or public repositories.
• Using weak or default credentials.
• Granting excessive permissions to applications or users.
• Failing to rotate secrets or monitor access.
• Ignoring audit logs and alerts.

---

# Secrets Management Guide Updated

Secure Secrets Management Guide for Ethiopian Navigator MVP
1. Overview of Secrets and Sensitive Data
Secrets and sensitive data include API keys, database credentials, encryption keys, access tokens, and configuration values. Proper management of these secrets is critical to ensure the security and integrity of the Ethiopian Navigator MVP system.
2. Azure Key Vault Setup and Usage
Azure Key Vault is used to securely store and manage secrets, keys, and certificates. To set up Azure Key Vault:
1. Create a Key Vault resource in the Azure portal.
2. Assign access policies to allow applications and users to retrieve secrets.
3. Use the Azure CLI or portal to add secrets (e.g., database connection strings, API keys).
4. Integrate Key Vault with your applications using SDKs or environment variables.
3. Best Practices for Storing and Accessing Secrets
• Never hard-code secrets in source code.
• Use environment variables or secure configuration files.
• Limit access to secrets using RBAC and access policies.
• Use managed identities to access Key Vault from Azure services.
• Encrypt secrets at rest and in transit.
4. Integration with Backend and CI/CD Pipelines
• Use Azure Managed Identity to allow backend services to access Key Vault without storing credentials.
• In CI/CD pipelines (e.g., GitHub Actions), use secure secrets storage and inject secrets at runtime.
• Avoid logging secrets in build or deployment logs.
• Use Key Vault references in App Service configuration settings.
5. Rotation and Auditing Strategies
• Rotate secrets periodically to reduce risk.
• Use automation scripts to rotate secrets and update dependent services.
• Enable Key Vault logging and diagnostics to monitor access and changes.
• Review access policies regularly and remove unused secrets.
6. Common Mistakes to Avoid
• Storing secrets in source code or public repositories.
• Using weak or default credentials.
• Granting excessive permissions to applications or users.
• Failing to rotate secrets or monitor access.
• Ignoring audit logs and alerts.
Step-by-Step Azure Key Vault Setup
This section provides detailed instructions for setting up Azure Key Vault using both Azure CLI and PowerShell.
1. Create a Resource Group (if not already created):
   - Azure CLI:
     az group create --name ethiopian-navigator-rg --location "Central US"
   - PowerShell:
     New-AzResourceGroup -Name "ethiopian-navigator-rg" -Location "Central US"
2. Create a Key Vault:
   - Azure CLI:
     az keyvault create --name "ethionav-keyvault" --resource-group "ethiopian-navigator-rg" --location "Central US"
   - PowerShell:
     New-AzKeyVault -Name "ethionav-keyvault" -ResourceGroupName "ethiopian-navigator-rg" -Location "Central US"
3. Add a secret to the Key Vault:
   - Azure CLI:
     az keyvault secret set --vault-name "ethionav-keyvault" --name "DbPassword" --value "YourSecurePassword123!"
   - PowerShell:
     Set-AzKeyVaultSecret -VaultName "ethionav-keyvault" -Name "DbPassword" -SecretValue (ConvertTo-SecureString "YourSecurePassword123!" -AsPlainText -Force)
4. Retrieve a secret from the Key Vault:
   - Azure CLI:
     az keyvault secret show --vault-name "ethionav-keyvault" --name "DbPassword"
   - PowerShell:
     Get-AzKeyVaultSecret -VaultName "ethionav-keyvault" -Name "DbPassword"
5. Integrate Key Vault with your application using environment variables or SDKs to securely access secrets during runtime.
Ensure that your application has appropriate access policies configured in Azure Key Vault to retrieve secrets securely.

---

# Technical Log Documentation

Ethiopian Navigator MVP - Technical Log Documentation
1. Completed Work Logs
2024-04-25: Forked azure-search-openai-demo into GitHub repository.
2024-04-25: Created initial project folder structure in VS Code.
2024-04-25: Initialized backend with Express and installed dependencies.
2024-04-25: Created server.js and verified API endpoint locally.
2024-04-25: Created .env, db.js, and auth.js files for backend.
2024-04-25: Connected to Azure PostgreSQL Flexible Server via VS Code.
2024-04-25: Created users table and tested registration/login endpoints.
2. Code Snippets Used
server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Ethiopian Navigator API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

db.js

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;

auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
      [email, hashedPassword, role]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

3. Configuration Details

.env file:
PORT=5000
DATABASE_URL=postgresql://Enavadmin@ethionav-postgres-server.postgres.database.azure.com/postgres?sslmode=require
JWT_SECRET=your_jwt_secret_key

Azure Resources:
- Resource Group: ethiopian-navigator-rg
- PostgreSQL Server: ethionav-postgres-server
- Database: postgres
- Web App: ethionav-backend
- Storage Account, Key Vault, Application Insights: provisioned

4. Passwords and Secrets
Passwords and secrets are stored securely in Azure Key Vault and are not exposed in this document.
5. Remaining Work Items
☐ Build service catalog APIs and connect to PostgreSQL
☐ Develop React frontend for citizen and admin portals
☐ Integrate AI chatbot with GPT-4 and Amharic-BERT
☐ Configure CI/CD pipelines using GitHub Actions
☐ Set up Application Insights and Log Analytics
☐ Conduct testing and QA
☐ Prepare deployment scripts and go-live checklist

---

# CI CD Guide

Ethiopian Navigator MVP - CI/CD Pipeline Configuration Guide
This guide outlines the CI/CD pipeline configuration for the Ethiopian Navigator MVP project. It includes setup instructions for GitHub Actions, environment variable management, deployment to Azure App Service, integration with Azure Key Vault, and best practices for secure and automated deployment.
1. Prerequisites
- GitHub repository for the project
- Azure App Service and Resource Group provisioned
- Azure Key Vault with secrets configured
- Azure credentials stored securely (Service Principal or OIDC)
- Node.js and Python environments configured for backend and chatbot
2. GitHub Actions Setup
Create a `.github/workflows/deploy.yml` file in your repository with the following content:
name: Deploy to Azure

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'

    - name: Install backend dependencies
      run: |
        cd backend
        npm install

    - name: Install chatbot dependencies
      run: |
        cd ai-chatbot
        pip install -r requirements.txt

    - name: Azure Login
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}

    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'ethionav-backend'
        slot-name: 'production'
        package: backend/

3. Environment Variable Management
Use Azure Key Vault to store sensitive environment variables such as database connection strings, API keys, and JWT secrets. Access these secrets in your application using Azure SDKs or environment injection during deployment.
4. Azure Key Vault Integration
Ensure your App Service has access to Key Vault by assigning a managed identity. Use the following Python snippet to retrieve secrets:
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

key_vault_url = "https://<your-keyvault-name>.vault.azure.net/"
credential = DefaultAzureCredential()
client = SecretClient(vault_url=key_vault_url, credential=credential)

secret = client.get_secret("DATABASE_URL")
print(secret.value)

5. Best Practices
- Use separate environments for development, staging, and production
- Rotate secrets regularly and audit access logs
- Use GitHub environments and secrets for secure configuration
- Monitor deployments using Azure Application Insights
- Automate rollback on failure using deployment slots

---

# Development Deployment Plan

Ethiopian Navigator MVP – Full Development & Deployment Plan
Phase 1: Planning & Setup
Define product scope, user roles, workflows, and success metrics. Select the base template (azure-search-openai-demo) and set up GitHub repository and VS Code development environment.
Phase 2: Azure Infrastructure Provisioning
Provision required Azure services using PowerShell or Azure CLI scripts:
- Resource Group: ethiopian-navigator-rg
- PostgreSQL Flexible Server
- Cosmos DB (MongoDB API)
- Blob Storage
- Azure AI Search
- Azure OpenAI
- Azure Key Vault
- App Service & Application Insights
Configure firewall rules, SSL, and store secrets securely in Key Vault.
Phase 3: Backend Development
Build REST APIs using Node.js and Express.js:
- Authentication & RBAC
- Service catalog
- Service requests
- Feedback
- Chatbot queries
Integrate PostgreSQL and Cosmos DB. Secure APIs using JWT and Key Vault.
Phase 4: Frontend Development
Develop React.js frontend for:
- Citizens
- Admins
- Government Employees
- Partners
Implement multilingual support (Amharic, Oromo, English), accessibility (WCAG 2.1 AA), and Ethiopian branding.
Phase 5: AI Chatbot Integration
Customize chatbot using GPT-4 and Amharic-BERT. Enable Retrieval-Augmented Generation (RAG) with Azure AI Search. Store logs and training data in Cosmos DB. Provide personalized checklists and escalation to human support.
Phase 6: Testing & QA
Validate functionality, performance, and security using:
- Unit and integration tests
- User Acceptance Testing (UAT)
- Performance testing
- Chatbot accuracy validation
Tools: Jest, Mocha, Chai, Postman, REST Client, Azure Load Testing.
Phase 7: CI/CD & Deployment
Automate build, test, and deployment using GitHub Actions. Configure workflows to deploy to Azure App Service. Integrate Key Vault for secrets management. Include rollback strategy and multi-environment support.
Phase 8: Monitoring & Go-Live
Monitor system health and usage using Azure Application Insights, Log Analytics, and Traffic Manager. Execute go-live checklist and ensure stakeholder communication and support readiness.
Phase 9: Documentation & Handover
Prepare and maintain:
- README.md
- Developer onboarding guide
- Technical blueprint
- Low-Level Design (LLD)
- Secure secrets guide
- CI/CD guide
- Deployment checklist
- Project proposal and Terms of Reference (ToR)

---

# Deployment Checklist

Ethiopian Navigator MVP - Development & Deployment Checklist
1. Planning & Requirements
☑ Define product vision and success metrics
☑ Finalize user personas and workflows
☑ Select Azure OpenAI template for customization
☑ Prepare product design specification document
2. Environment Setup
☑ Set up GitHub repository and folder structure
☑ Configure Visual Studio Code with required extensions
☑ Install Node.js, Python, PostgreSQL client
☑ Configure .env files and secrets
3. Azure Resource Provisioning
☑ Create Azure Resource Group
☑ Provision PostgreSQL Flexible Server
☑ Set up Cosmos DB, Blob Storage, Key Vault
☑ Configure Azure AI Search and OpenAI resources
4. Backend Development
☑ Initialize Express.js server
☑ Implement authentication and RBAC
☐ Build service catalog APIs
☐ Integrate PostgreSQL and Cosmos DB
☐ Set up feedback and chatbot endpoints
5. Frontend Development
☐ Build React components for citizen portal
☐ Build admin and government portals
☐ Integrate multilingual support
☐ Apply Ethiopian branding and accessibility features
6. AI Chatbot Integration
☐ Extend GPT-4 with Amharic-BERT
☐ Configure RAG with Azure AI Search
☐ Train chatbot with service metadata and FAQs
☐ Implement feedback loop and escalation
7. Testing & QA
☐ Write unit and integration tests
☐ Conduct UAT and performance testing
☐ Validate chatbot accuracy and service flow
8. Deployment & Monitoring
☐ Set up CI/CD with GitHub Actions
☐ Configure Application Insights and Log Analytics
☐ Enable cost alerts and auto-scaling policies
9. Documentation & Onboarding
☑ Prepare README and onboarding guide
☑ Create technical blueprint and LLD document
☐ Maintain changelog and versioning
☐ Document API endpoints with Swagger

---

# Deployment Checklist Enhanced

Ethiopian Navigator MVP - Development & Deployment Checklist
1. Planning & Requirements
☑ Define product vision and success metrics
☑ Finalize user personas and workflows
☑ Select Azure OpenAI template for customization
☑ Prepare product design specification document
2. Environment Setup
☑ Set up GitHub repository and folder structure
☑ Configure Visual Studio Code with required extensions
☑ Install Node.js, Python, PostgreSQL client
☑ Configure .env files and secrets
3. Azure Resource Provisioning
☑ Create Azure Resource Group
☑ Provision PostgreSQL Flexible Server
☑ Set up Cosmos DB, Blob Storage, Key Vault
☑ Configure Azure AI Search and OpenAI resources
4. Backend Development
☑ Initialize Express.js server
☑ Implement authentication and RBAC
☐ Build service catalog APIs
☐ Integrate PostgreSQL and Cosmos DB
☐ Set up feedback and chatbot endpoints
5. Frontend Development
☐ Build React components for citizen portal
☐ Build admin and government portals
☐ Integrate multilingual support
☐ Apply Ethiopian branding and accessibility features
6. AI Chatbot Integration
☐ Extend GPT-4 with Amharic-BERT
☐ Configure RAG with Azure AI Search
☐ Train chatbot with service metadata and FAQs
☐ Implement feedback loop and escalation
7. Testing & QA
☐ Write unit and integration tests
☐ Conduct UAT and performance testing
☐ Validate chatbot accuracy and service flow
8. Deployment & Monitoring
☐ Set up CI/CD with GitHub Actions
☐ Configure Application Insights and Log Analytics
☐ Enable cost alerts and auto-scaling policies
9. Documentation & Onboarding
☑ Prepare README and onboarding guide
☑ Create technical blueprint and LLD document
☐ Maintain changelog and versioning
☐ Document API endpoints with Swagger

---

# Developer Onboarding Guide

Ethiopian Navigator MVP - Developer Onboarding Guide
1. Project Introduction
The Ethiopian Navigator MVP is a multilingual, citizen-centric government service portal built on Azure. It leverages Azure OpenAI, AI Search, and a microservices architecture to deliver transparent and efficient G2C services. This guide helps new developers onboard quickly and contribute effectively to the project.
2. Prerequisites and Tools
- Git and GitHub account
- Visual Studio Code (VS Code)
- Node.js and npm
- Python 3.10+
- PostgreSQL client (e.g., DBeaver)
- Azure CLI
- REST Client extension for VS Code (optional)
3. Repository Structure
The repository is organized as follows:
- frontend/: React.js frontend for citizen, admin, and government portals
- backend/: Node.js backend APIs for authentication, service catalog, feedback, and chatbot
- ai-chatbot/: Python-based AI chatbot using GPT-4 and Amharic-BERT
- infrastructure/: Azure provisioning scripts and IaC templates
- docs/: Product design, workflows, and architecture documentation
- onboarding/: Developer onboarding guides and checklists
4. Environment Setup Instructions
1. Clone the repository:
   git clone https://github.com/Amireducation/ethiopian-navigator-mvpv1.git
2. Navigate to the backend folder and initialize:
   cd backend
   npm install
3. Create a .env file with required environment variables:
   PORT=5000
   DATABASE_URL=<your_postgres_connection_string>
   JWT_SECRET=<your_jwt_secret>
4. Repeat similar setup for frontend and ai-chatbot folders.
5. Running the Backend and Frontend
To run the backend:
   cd backend
   node server.js

To run the frontend:
   cd frontend
   npm install
   npm start
6. API Testing
Use Postman or the REST Client extension in VS Code to test API endpoints.
Example endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/services
7. Azure Integration Overview
The project uses the following Azure resources:
- Azure PostgreSQL Flexible Server
- Azure Cosmos DB (MongoDB API)
- Azure App Service
- Azure Blob Storage
- Azure OpenAI and AI Search
- Azure Key Vault
- Azure Application Insights
Ensure your IP is whitelisted in the PostgreSQL firewall settings and secrets are stored securely in Key Vault.
8. Contribution Guidelines
- Use feature branches for new work
- Submit pull requests with clear descriptions
- Follow coding standards and naming conventions
- Document changes in the changelog
- Update README and onboarding guides as needed
9. Support and Contacts
For technical support, contact the lead developer or project owner.
Use GitHub Issues to report bugs or request features.
Refer to the docs/ folder for architecture diagrams and product specifications.

---

# Developer Onboarding Guide Updated

Ethiopian Navigator MVP - Developer Onboarding Guide
1. Project Introduction
The Ethiopian Navigator MVP is a multilingual, citizen-centric government service portal built on Azure. It leverages Azure OpenAI, AI Search, and a microservices architecture to deliver transparent and efficient G2C services. This guide helps new developers onboard quickly and contribute effectively to the project.
2. Prerequisites and Tools
- Git and GitHub account
- Visual Studio Code (VS Code)
- Node.js and npm
- Python 3.10+
- PostgreSQL client (e.g., DBeaver)
- Azure CLI
- REST Client extension for VS Code (optional)
3. Repository Structure
The repository is organized as follows:
- frontend/: React.js frontend for citizen, admin, and government portals
- backend/: Node.js backend APIs for authentication, service catalog, feedback, and chatbot
- ai-chatbot/: Python-based AI chatbot using GPT-4 and Amharic-BERT
- infrastructure/: Azure provisioning scripts and IaC templates
- docs/: Product design, workflows, and architecture documentation
- onboarding/: Developer onboarding guides and checklists
4. Environment Setup Instructions
1. Clone the repository:
   git clone https://github.com/Amireducation/ethiopian-navigator-mvpv1.git
2. Navigate to the backend folder and initialize:
   cd backend
   npm install
3. Create a .env file with required environment variables:
   PORT=5000
   DATABASE_URL=<your_postgres_connection_string>
   JWT_SECRET=<your_jwt_secret>
4. Repeat similar setup for frontend and ai-chatbot folders.
5. Running the Backend and Frontend
To run the backend:
   cd backend
   node server.js

To run the frontend:
   cd frontend
   npm install
   npm start
6. API Testing
Use Postman or the REST Client extension in VS Code to test API endpoints.
Example endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/services
7. Azure Integration Overview
The project uses the following Azure resources:
- Azure PostgreSQL Flexible Server
- Azure Cosmos DB (MongoDB API)
- Azure App Service
- Azure Blob Storage
- Azure OpenAI and AI Search
- Azure Key Vault
- Azure Application Insights
Ensure your IP is whitelisted in the PostgreSQL firewall settings and secrets are stored securely in Key Vault.
8. Contribution Guidelines
- Use feature branches for new work
- Submit pull requests with clear descriptions
- Follow coding standards and naming conventions
- Document changes in the changelog
- Update README and onboarding guides as needed
9. Support and Contacts
For technical support, contact the lead developer or project owner.
Use GitHub Issues to report bugs or request features.
Refer to the docs/ folder for architecture diagrams and product specifications.
Step-by-Step Setup Instructions
1. Clone the GitHub repository:
   git clone https://github.com/Amireducation/ethiopian-navigator-mvpv1.git
2. Open the project in Visual Studio Code.
3. Create the project folder structure:
   mkdir frontend backend ai-chatbot infrastructure docs onboarding
4. Navigate to the backend folder:
   cd backend
5. Initialize the Node.js project:
   npm init -y
6. Install backend dependencies:
   npm install express cors dotenv jsonwebtoken bcryptjs pg
7. Create a .env file in the backend folder with the following content:
   PORT=5000
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_jwt_secret_key
8. Create server.js and define the Express server.
9. Create db.js to connect to PostgreSQL.
10. Create routes/auth.js for authentication endpoints.
11. Create the users table in PostgreSQL:
   CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password TEXT NOT NULL, role VARCHAR(50) NOT NULL);
12. Run the server:
   node server.js
13. Test the API endpoints using REST Client or Postman.
Troubleshooting Tips
❌ Error: 'npm.ps1 cannot be loaded because running scripts is disabled on this system'
✅ Fix: Open PowerShell as Administrator and run:
   Set-ExecutionPolicy RemoteSigned
❌ Error: 'connect ETIMEDOUT <IP>:5432'
✅ Fix: Ensure your Azure PostgreSQL server firewall allows your local IP address.
❌ Error: 'FATAL: no pg_hba.conf entry for host ... no encryption'
✅ Fix: Enable SSL in your database client (e.g., DBeaver) and set sslmode=require.
❌ Error: 'FATAL: password authentication failed for user'
✅ Fix: Double-check your username format and password. Use the format: username@server-name.
❌ Error: 'Cannot find module ./routes/auth'
✅ Fix: Ensure the auth.js file is inside a folder named 'routes' and the path is correct in server.js.
❌ API not responding
✅ Fix: Ensure the server is running on the correct port and that the endpoint URL is correct.

---

# Ethiopian Navigator PDS Technical Design



# Source: Ethiopian_Navigator_Product_Design_Specification.docx

Ethiopian Navigator MVP - Product Design & Customization Specification
1. Architecture Overview
The Ethiopian Navigator MVP is built on a microservices architecture leveraging Azure cloud services. The core components include a React frontend, Node.js backend, PostgreSQL and Cosmos DB databases, Azure AI Search, Azure OpenAI for chatbot functionality, and Blob Storage for document uploads. The system supports multilingual interactions (Amharic, Oromo, English) and role-based access for Citizens, Government Employees, Partners, and Admins.
2. Base Template Selection
The project will customize the Azure OpenAI template 'azure-search-openai-demo' which provides a Retrieval-Augmented Generation (RAG) framework combining Azure AI Search and OpenAI GPT models. This template includes a Python backend, React frontend, and integration with Azure services.
3. Customization Plan
The following customizations will be applied to the base template:
- Replace sample data with Ethiopian government service metadata and FAQs.
- Extend chatbot to support Amharic and Oromo using Amharic-BERT and GPT-4.
- Integrate PostgreSQL and Cosmos DB for structured and unstructured data.
- Modify UI to support role-based portals for Citizens, Admins, Government Employees, and Partners.
- Add document upload functionality using Azure Blob Storage.
- Implement feedback loop and service request tracking.
4. Integration Points
- Azure PostgreSQL: Service requests, user accounts, feedback.
- Azure Cosmos DB: Chatbot logs and training data.
- Azure Blob Storage: Document uploads.
- Azure AI Search: Service catalog indexing.
- Azure Key Vault: Secrets and credentials management.
- Azure Application Insights: Monitoring and telemetry.
5. Development Tasks
Frontend:
- Customize React components for each user role.
- Integrate chatbot widget with multilingual support.
- Implement dashboards and service application forms.
Backend:
- Set up PostgreSQL schema and APIs for service catalog, feedback, and requests.
- Integrate Cosmos DB for chatbot logging.
- Configure Azure AI Search indexing and retrieval.
- Implement authentication and RBAC.
6. Tracking Progress
- Use GitHub Projects or Azure Boards for task tracking.
- Maintain a changelog for each module.
- Document completed tasks and pending items in a shared dashboard.
7. Onboarding Guidance
- Provide access to GitHub repo and Azure portal.
- Share infrastructure provisioning scripts and environment variables.
- Maintain README files for each module with setup instructions.
- Create onboarding checklist for new developers.
8. Change Management
- All changes must be documented in the changelog.
- Use pull requests and code reviews for all updates.
- Maintain version control and tag releases.
- Update onboarding and documentation with each major change.

# Source: Ethiopian_Navigator_Technical_Blueprint.docx

Ethiopian Navigator MVP - Technical Blueprint
1. Azure OpenAI Template Selection and Customization Strategy
The Ethiopian Navigator MVP is built upon the 'azure-search-openai-demo' template, which provides a Retrieval-Augmented Generation (RAG) architecture using Azure OpenAI and Azure AI Search. This template was selected for its modular design, support for multilingual chat, and integration with Azure services. Customization includes replacing sample data with Ethiopian government service metadata, extending the chatbot to support Amharic and Oromo using Amharic-BERT, and modifying the UI for citizen, admin, and government employee roles.
2. Azure Resource Provisioning and Configuration
Azure resources provisioned include:
- Resource Group: ethiopian-navigator-rg
- PostgreSQL Flexible Server: ethionav-postgres-server
- Cosmos DB (MongoDB API): ethionav-cosmosdb
- App Service Plan and Web App: ethionav-backend
- Storage Account for document uploads
- Azure AI Search for service catalog indexing
- Azure Key Vault for secrets management
- Application Insights and Log Analytics for monitoring
Firewall rules and SSL configurations were applied to enable secure access from local development environments.
3. GitHub Repository Setup and Structure
The GitHub repository is forked from the Azure template and renamed to 'ethiopian-navigator-mvpv1'. The structure includes:
- frontend/: React.js UI components
- backend/: Node.js Express APIs
- ai-chatbot/: Python GPT-4 and Amharic-BERT integration
- infrastructure/: Azure provisioning scripts
- docs/: Product design and architecture documentation
- onboarding/: Developer onboarding guides
README.md and .env files are configured for environment setup and contribution guidelines.
4. Visual Studio Code Environment Setup
VS Code is used for development with the following setup:
- Git integration for version control
- REST Client extension for API testing
- Node.js and Python environments configured
- Terminal access for running backend server and managing dependencies
- Folder structure aligned with GitHub repository
5. Backend and Frontend Development Plan
Backend:
- Initialize Express server with authentication and service catalog APIs
- Connect to PostgreSQL using pg module
- Implement JWT-based authentication and role-based access control
- Create REST endpoints for citizen requests, feedback, and chatbot queries

Frontend:
- Build React components for citizen, admin, government, and partner portals
- Integrate multilingual support and Ethiopian branding
- Connect frontend to backend APIs using Axios
- Implement dashboard, service catalog, and application forms
6. AI Chatbot Integration
The AI chatbot is built using GPT-4 and Amharic-BERT for multilingual support. Integration includes:
- RAG pipeline using Azure AI Search
- Chatbot endpoints in Python with Flask or FastAPI
- Logging and training data stored in Cosmos DB
- Personalized checklists and escalation to human support
- Embedding chatbot widget in frontend UI
7. CI/CD and Monitoring Setup
CI/CD is configured using GitHub Actions:
- Automated build and deployment to Azure Web App
- Secrets managed via Azure Key Vault
- Application Insights for performance monitoring
- Log Analytics for error tracking
- Cost alerts and auto-scaling policies applied
8. Developer Onboarding and Documentation Practices
Developer onboarding includes:
- Onboarding checklist in onboarding/ folder
- README.md with setup instructions and contribution guidelines
- API documentation using Swagger
- Changelog and versioning maintained
- Architecture diagrams and workflow maps in docs/

# Source: Ethiopian_Navigator_LLD.docx

Ethiopian Navigator MVP - Low-Level Design (LLD)
1. Module Breakdown
The Ethiopian Navigator MVP consists of the following modules:
- Frontend (React.js): Citizen Portal, Admin Portal, Government Employee Portal, Partner Portal.
- Backend (Node.js/Express): REST APIs for authentication, service catalog, feedback, chatbot, and file uploads.
- AI Chatbot (Python): GPT-4 and Amharic-BERT integration with RAG using Azure AI Search.
- Database: PostgreSQL for structured data, Cosmos DB for chat logs and feedback.
- Search: Azure AI Search for indexing service metadata and documents.
2. API Specifications
Key API endpoints:
- POST /api/auth/register: Register a new user.
- POST /api/auth/login: Authenticate user and return JWT.
- GET /api/services: Retrieve list of services.
- POST /api/requests: Submit a service request.
- POST /api/feedback: Submit feedback.
- POST /api/chatbot/query: Query the AI chatbot.
- POST /api/upload: Upload documents to Azure Blob Storage.
3. Data Models and Entity Relationships
Primary entities:
- User: id, email, password, role
- Service: id, title, description, category, metadata
- Request: id, user_id, service_id, status, submitted_at
- Feedback: id, user_id, message, rating, submitted_at
- ChatLog: id, user_id, query, response, timestamp

Relationships:
- One User can submit many Requests and Feedback entries.
- Each Request is linked to one Service.
- ChatLogs are linked to Users for personalization and training.
4. Component Interactions
- Frontend communicates with Backend via REST APIs.
- Backend interacts with PostgreSQL and Cosmos DB for data persistence.
- Backend invokes Python-based AI Chatbot for query responses.
- AI Chatbot uses Azure AI Search to retrieve relevant documents.
- Blob Storage handles document uploads and retrievals.
5. Sequence Diagrams
Example: Service Request Submission
1. User submits request via frontend.
2. Frontend sends POST /api/requests to backend.
3. Backend validates JWT and request data.
4. Backend stores request in PostgreSQL.
5. Backend returns confirmation to frontend.
6. Error Handling Strategy
- Use try-catch blocks in backend and chatbot modules.
- Return standardized error responses with HTTP status codes.
- Log errors using Application Insights.
- Display user-friendly error messages in frontend.
- Validate inputs at both frontend and backend.
7. Security and Access Control
- Use JWT for authentication and role-based access control.
- Store secrets in Azure Key Vault.
- Use HTTPS for all communications.
- Validate and sanitize all inputs.
- Implement CORS policies and rate limiting.
8. Deployment Architecture
- Azure App Service hosts frontend and backend.
- PostgreSQL Flexible Server for structured data.
- Cosmos DB for unstructured data.
- Azure Blob Storage for file uploads.
- Azure AI Search for document indexing.
- Azure OpenAI for chatbot responses.
- CI/CD via GitHub Actions and Azure DevOps.
9. Monitoring and Logging
- Use Azure Application Insights for performance and error tracking.
- Enable logging in backend and chatbot modules.
- Monitor database performance and query execution.
- Set up alerts for resource usage and failures.
- Use Azure Log Analytics for centralized log management.

# Source: Ethiopian_Navigator_Work_Plan.docx

Ethiopian Navigator MVP - Full Development & Deployment Work Plan
This document outlines the comprehensive work plan for developing and deploying the Ethiopian Navigator MVP. It includes step-by-step procedures, tools, and guidance across all phases of the project lifecycle.
1. Planning & Requirements
• Review product design and specification documents.
• Define user personas, workflows, and service catalog.
• Select base template: azure-search-openai-demo.
• Establish GitHub repository and branching strategy.
2. Development Environment Setup
• Install Visual Studio Code and required extensions (REST Client, ESLint, Prettier).
• Install Node.js, Python 3, and PostgreSQL client tools.
• Fork and clone the azure-search-openai-demo repository.
• Create project structure: frontend/, backend/, ai-chatbot/, infrastructure/, docs/, onboarding/.
3. Azure Resource Provisioning
• Create resource group: ethiopian-navigator-rg.
• Provision PostgreSQL Flexible Server, Cosmos DB, Blob Storage, Azure AI Search, Key Vault, App Service.
• Configure firewall rules and SSL settings for database access.
• Store secrets in Azure Key Vault and link to backend.
4. Backend Development
• Initialize Node.js project in backend/ and install dependencies.
• Create Express server and configure environment variables.
• Implement authentication (JWT, bcrypt) and RBAC.
• Build APIs for service catalog, feedback, chatbot, and document uploads.
• Connect to PostgreSQL and Cosmos DB.
5. Frontend Development
• Initialize React project in frontend/.
• Build citizen portal: homepage, service catalog, application form, dashboard.
• Build admin portal: service management, analytics, feedback routing.
• Build government and partner portals.
• Integrate multilingual support (Amharic, Oromo, English).
6. AI Chatbot Integration
• Set up Python environment in ai-chatbot/.
• Integrate GPT-4 and Amharic-BERT for multilingual NLP.
• Implement RAG using Azure AI Search and service metadata.
• Enable personalized checklists and feedback loop.
• Log interactions in Cosmos DB.
7. Testing & QA
• Write unit and integration tests for backend and frontend.
• Test API endpoints using REST Client or Postman.
• Conduct user acceptance testing (UAT).
• Validate chatbot accuracy and multilingual responses.
8. Deployment & Monitoring
• Configure GitHub Actions for CI/CD pipelines.
• Deploy backend and frontend to Azure App Service.
• Set up Application Insights and Log Analytics.
• Enable cost alerts and auto-scaling policies.
9. Documentation & Onboarding
• Maintain README.md with setup and contribution guidelines.
• Create developer onboarding guide and checklist.
• Document API endpoints using Swagger.
• Track progress using GitHub project board and changelog.

# Source: Ethiopian_Navigator_Development_Deployment_Plan.docx

Ethiopian Navigator MVP – Full Development & Deployment Plan
Phase 1: Planning & Setup
Define product scope, user roles, workflows, and success metrics. Select the base template (azure-search-openai-demo) and set up GitHub repository and VS Code development environment.
Phase 2: Azure Infrastructure Provisioning
Provision required Azure services using PowerShell or Azure CLI scripts:
- Resource Group: ethiopian-navigator-rg
- PostgreSQL Flexible Server
- Cosmos DB (MongoDB API)
- Blob Storage
- Azure AI Search
- Azure OpenAI
- Azure Key Vault
- App Service & Application Insights
Configure firewall rules, SSL, and store secrets securely in Key Vault.
Phase 3: Backend Development
Build REST APIs using Node.js and Express.js:
- Authentication & RBAC
- Service catalog
- Service requests
- Feedback
- Chatbot queries
Integrate PostgreSQL and Cosmos DB. Secure APIs using JWT and Key Vault.
Phase 4: Frontend Development
Develop React.js frontend for:
- Citizens
- Admins
- Government Employees
- Partners
Implement multilingual support (Amharic, Oromo, English), accessibility (WCAG 2.1 AA), and Ethiopian branding.
Phase 5: AI Chatbot Integration
Customize chatbot using GPT-4 and Amharic-BERT. Enable Retrieval-Augmented Generation (RAG) with Azure AI Search. Store logs and training data in Cosmos DB. Provide personalized checklists and escalation to human support.
Phase 6: Testing & QA
Validate functionality, performance, and security using:
- Unit and integration tests
- User Acceptance Testing (UAT)
- Performance testing
- Chatbot accuracy validation
Tools: Jest, Mocha, Chai, Postman, REST Client, Azure Load Testing.
Phase 7: CI/CD & Deployment
Automate build, test, and deployment using GitHub Actions. Configure workflows to deploy to Azure App Service. Integrate Key Vault for secrets management. Include rollback strategy and multi-environment support.
Phase 8: Monitoring & Go-Live
Monitor system health and usage using Azure Application Insights, Log Analytics, and Traffic Manager. Execute go-live checklist and ensure stakeholder communication and support readiness.
Phase 9: Documentation & Handover
Prepare and maintain:
- README.md
- Developer onboarding guide
- Technical blueprint
- Low-Level Design (LLD)
- Secure secrets guide
- CI/CD guide
- Deployment checklist
- Project proposal and Terms of Reference (ToR)

# Source: Ethiopian_Navigator_CI_CD_Guide.docx

Ethiopian Navigator MVP - CI/CD Pipeline Configuration Guide
This guide outlines the CI/CD pipeline configuration for the Ethiopian Navigator MVP project. It includes setup instructions for GitHub Actions, environment variable management, deployment to Azure App Service, integration with Azure Key Vault, and best practices for secure and automated deployment.
1. Prerequisites
- GitHub repository for the project
- Azure App Service and Resource Group provisioned
- Azure Key Vault with secrets configured
- Azure credentials stored securely (Service Principal or OIDC)
- Node.js and Python environments configured for backend and chatbot
2. GitHub Actions Setup
Create a `.github/workflows/deploy.yml` file in your repository with the following content:
name: Deploy to Azure

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'

    - name: Install backend dependencies
      run: |
        cd backend
        npm install

    - name: Install chatbot dependencies
      run: |
        cd ai-chatbot
        pip install -r requirements.txt

    - name: Azure Login
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}

    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'ethionav-backend'
        slot-name: 'production'
        package: backend/

3. Environment Variable Management
Use Azure Key Vault to store sensitive environment variables such as database connection strings, API keys, and JWT secrets. Access these secrets in your application using Azure SDKs or environment injection during deployment.
4. Azure Key Vault Integration
Ensure your App Service has access to Key Vault by assigning a managed identity. Use the following Python snippet to retrieve secrets:
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

key_vault_url = "https://<your-keyvault-name>.vault.azure.net/"
credential = DefaultAzureCredential()
client = SecretClient(vault_url=key_vault_url, credential=credential)

secret = client.get_secret("DATABASE_URL")
print(secret.value)

5. Best Practices
- Use separate environments for development, staging, and production
- Rotate secrets regularly and audit access logs
- Use GitHub environments and secrets for secure configuration
- Monitor deployments using Azure Application Insights
- Automate rollback on failure using deployment slots

# Source: Ethiopian_Navigator_Azure_Resource_Blueprint_Updated.docx

Azure Resource Setup Blueprint for Ethiopian Navigator MVP
This blueprint provides a step-by-step guide for provisioning and configuring Azure resources required for the Ethiopian Navigator MVP. It includes PowerShell scripts, configuration instructions, and best practices for deploying core services such as PostgreSQL, Cosmos DB, Blob Storage, Azure AI Search, Key Vault, App Service, and Application Insights.
1. Prerequisites
- Azure subscription with sufficient quota
- Azure PowerShell module installed
- Admin access to create and manage resources
- Visual Studio Code with Azure extensions (optional)
2. Provision Resource Group
Use the following PowerShell script to create a resource group:
$location = 'Central US'
$resourceGroupName = 'ethiopian-navigator-rg'
New-AzResourceGroup -Name $resourceGroupName -Location $location
3. Provision PostgreSQL Flexible Server
PowerShell script to create a PostgreSQL server:
$serverName = 'ethionav-postgres-server'
$adminUser = 'Enavadmin'
$adminPassword = 'YourSecurePassword123!'
New-AzPostgreSqlFlexibleServer -ResourceGroupName $resourceGroupName -Name $serverName -Location $location -AdministratorLogin $adminUser -AdministratorLoginPassword (ConvertTo-SecureString $adminPassword -AsPlainText -Force) -SkuName 'Standard_B1ms' -StorageSizeInGB 32 -Version '13'
4. Provision Cosmos DB (MongoDB API)
PowerShell script to create a Cosmos DB account:
$cosmosName = 'ethionav-cosmosdb'
New-AzCosmosDBAccount -ResourceGroupName $resourceGroupName -Name $cosmosName -Location $location -Kind MongoDB -DefaultConsistencyLevel 'Session' -EnableAutomaticFailover $true
5. Provision Azure Blob Storage
PowerShell script to create a storage account:
$storageName = 'ethionavstorage'
New-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageName -Location $location -SkuName 'Standard_LRS' -Kind 'StorageV2'
6. Provision Azure AI Search
PowerShell script to create a search service:
$searchName = 'ethionav-search'
New-AzSearchService -ResourceGroupName $resourceGroupName -Name $searchName -Location $location -Sku 'Basic'
7. Provision Azure Key Vault
PowerShell script to create a Key Vault:
$keyVaultName = 'ethionav-keyvault'
New-AzKeyVault -Name $keyVaultName -ResourceGroupName $resourceGroupName -Location $location
8. Provision App Service and App Plan
PowerShell script to create an App Service Plan and Web App:
$appPlanName = 'ethionav-appplan'
$webAppName = 'ethionav-backend'
New-AzAppServicePlan -Name $appPlanName -Location $location -ResourceGroupName $resourceGroupName -Tier 'Basic' -NumberofWorkers 1
New-AzWebApp -Name $webAppName -Location $location -AppServicePlan $appPlanName -ResourceGroupName $resourceGroupName
9. Provision Application Insights
PowerShell script to create Application Insights:
$appInsightsName = 'ethionav-insights'
New-AzApplicationInsights -ResourceGroupName $resourceGroupName -Name $appInsightsName -Location $location -Kind 'web'
10. Best Practices
- Use secure passwords and store them in Azure Key Vault
- Enable diagnostic logging for all services
- Use tags for resource management and cost tracking
- Set up role-based access control (RBAC)
- Monitor usage and set up alerts for cost and performance
Sample PowerShell Scripts for Azure Resource Provisioning

# Create Resource Group
New-AzResourceGroup -Name "ethiopian-navigator-rg" -Location "Central US"

# Create PostgreSQL Flexible Server
New-AzPostgreSqlFlexibleServer -ResourceGroupName "ethiopian-navigator-rg" `
  -Name "ethionav-postgres-server" `
  -Location "Central US" `
  -SkuName "Standard_B1ms" `
  -StorageSizeInGB 32 `
  -AdministratorLogin "Enavadmin" `
  -AdministratorLoginPassword (ConvertTo-SecureString "YourSecurePassword123!" -AsPlainText -Force)

# Create Cosmos DB Account
New-AzCosmosDBAccount -ResourceGroupName "ethiopian-navigator-rg" `
  -Name "ethionav-cosmosdb" `
  -Location "Central US" `
  -Kind MongoDB `
  -DefaultConsistencyLevel "Session"

# Create Storage Account
New-AzStorageAccount -ResourceGroupName "ethiopian-navigator-rg" `
  -Name "ethionavstorage" `
  -Location "Central US" `
  -SkuName "Standard_LRS" `
  -Kind "StorageV2"

# Create Azure AI Search
New-AzSearchService -ResourceGroupName "ethiopian-navigator-rg" `
  -Name "ethionav-search" `
  -Location "Central US" `
  -Sku "standard"

# Create Key Vault
New-AzKeyVault -ResourceGroupName "ethiopian-navigator-rg" `
  -VaultName "ethionav-keyvault" `
  -Location "Central US"

# Create App Service Plan and Web App
New-AzAppServicePlan -Name "ethionav-plan" -Location "Central US" `
  -ResourceGroupName "ethiopian-navigator-rg" -Tier "Basic" -NumberofWorkers 1

New-AzWebApp -Name "ethionav-backend" -Location "Central US" `
  -AppServicePlan "ethionav-plan" -ResourceGroupName "ethiopian-navigator-rg"

Troubleshooting Guide for Azure Resource Setup
Permission Errors
Ensure you are logged in with an account that has Contributor or Owner role on the subscription. Use `Connect-AzAccount` to authenticate.
Resource Quota Limits
Check your subscription limits for resources like cores, storage, and IP addresses. Use `Get-AzSubscription` and `Get-AzVMUsage` to inspect quotas.
Connectivity Problems
Verify your local IP is added to the firewall rules for services like PostgreSQL and Cosmos DB. Use `New-AzPostgreSqlFlexibleServerFirewallRule` to add access.
SSL Connection Issues
Ensure SSL is enabled when connecting to Azure PostgreSQL. Use `sslmode=require` in connection strings.
Name Conflicts
Resource names must be globally unique. Append a random suffix or use a naming convention to avoid conflicts.
Region Availability
Ensure the selected region supports the desired resource type. Use `Get-AzLocation` to list available regions and services.

# Source: Ethiopian_Navigator_Secure_Secrets_Management_Guide_Updated.docx

Secure Secrets Management Guide for Ethiopian Navigator MVP
1. Overview of Secrets and Sensitive Data
Secrets and sensitive data include API keys, database credentials, encryption keys, access tokens, and configuration values. Proper management of these secrets is critical to ensure the security and integrity of the Ethiopian Navigator MVP system.
2. Azure Key Vault Setup and Usage
Azure Key Vault is used to securely store and manage secrets, keys, and certificates. To set up Azure Key Vault:
1. Create a Key Vault resource in the Azure portal.
2. Assign access policies to allow applications and users to retrieve secrets.
3. Use the Azure CLI or portal to add secrets (e.g., database connection strings, API keys).
4. Integrate Key Vault with your applications using SDKs or environment variables.
3. Best Practices for Storing and Accessing Secrets
• Never hard-code secrets in source code.
• Use environment variables or secure configuration files.
• Limit access to secrets using RBAC and access policies.
• Use managed identities to access Key Vault from Azure services.
• Encrypt secrets at rest and in transit.
4. Integration with Backend and CI/CD Pipelines
• Use Azure Managed Identity to allow backend services to access Key Vault without storing credentials.
• In CI/CD pipelines (e.g., GitHub Actions), use secure secrets storage and inject secrets at runtime.
• Avoid logging secrets in build or deployment logs.
• Use Key Vault references in App Service configuration settings.
5. Rotation and Auditing Strategies
• Rotate secrets periodically to reduce risk.
• Use automation scripts to rotate secrets and update dependent services.
• Enable Key Vault logging and diagnostics to monitor access and changes.
• Review access policies regularly and remove unused secrets.
6. Common Mistakes to Avoid
• Storing secrets in source code or public repositories.
• Using weak or default credentials.
• Granting excessive permissions to applications or users.
• Failing to rotate secrets or monitor access.
• Ignoring audit logs and alerts.
Step-by-Step Azure Key Vault Setup
This section provides detailed instructions for setting up Azure Key Vault using both Azure CLI and PowerShell.
1. Create a Resource Group (if not already created):
   - Azure CLI:
     az group create --name ethiopian-navigator-rg --location "Central US"
   - PowerShell:
     New-AzResourceGroup -Name "ethiopian-navigator-rg" -Location "Central US"
2. Create a Key Vault:
   - Azure CLI:
     az keyvault create --name "ethionav-keyvault" --resource-group "ethiopian-navigator-rg" --location "Central US"
   - PowerShell:
     New-AzKeyVault -Name "ethionav-keyvault" -ResourceGroupName "ethiopian-navigator-rg" -Location "Central US"
3. Add a secret to the Key Vault:
   - Azure CLI:
     az keyvault secret set --vault-name "ethionav-keyvault" --name "DbPassword" --value "YourSecurePassword123!"
   - PowerShell:
     Set-AzKeyVaultSecret -VaultName "ethionav-keyvault" -Name "DbPassword" -SecretValue (ConvertTo-SecureString "YourSecurePassword123!" -AsPlainText -Force)
4. Retrieve a secret from the Key Vault:
   - Azure CLI:
     az keyvault secret show --vault-name "ethionav-keyvault" --name "DbPassword"
   - PowerShell:
     Get-AzKeyVaultSecret -VaultName "ethionav-keyvault" -Name "DbPassword"
5. Integrate Key Vault with your application using environment variables or SDKs to securely access secrets during runtime.
Ensure that your application has appropriate access policies configured in Azure Key Vault to retrieve secrets securely.

---

# Ethiopian Navigator Copilot Workflow

# Ethiopian Navigator MVP – Copilot-Driven Development Workflow

This document outlines a step-by-step development workflow for the Ethiopian Navigator MVP using GitHub Copilot, Azure Copilot, and Microsoft 365 Copilot.

---

## 🧭 Overview

| Phase | Description | Copilot Role |
|-------|-------------|--------------|
| Planning | Define scope, architecture, and user journeys | Microsoft 365 Copilot |
| Infrastructure | Provision Azure resources | Azure Copilot |
| Backend | Build APIs and database integration | GitHub Copilot |
| Frontend | Develop React UI components | GitHub Copilot |
| AI Chatbot | Integrate GPT-4 and Amharic-BERT | GitHub + Azure Copilot |
| CI/CD | Automate deployment pipelines | GitHub Copilot |
| Monitoring | Configure logging and alerts | Azure Copilot |
| Documentation | Maintain guides and specs | Microsoft 365 + GitHub Copilot |

---

## 🧱 1. Infrastructure Setup (Azure Copilot)

### Tasks:
- Provision Resource Group
- Create PostgreSQL Flexible Server
- Create Cosmos DB (MongoDB API)
- Create Blob Storage
- Create Azure AI Search
- Create Azure OpenAI resource
- Create Azure Key Vault
- Create App Service Plan and Web App
- Enable Application Insights

### Copilot Assistance:
- Azure Copilot generates Bicep/ARM templates
- Troubleshoots provisioning errors
- Suggests naming conventions and cost estimates

---

## 🔧 2. Backend Development (GitHub Copilot)

### Tasks:
- Initialize Node.js project
- Create `server.js` with Express setup
- Configure `.env` and connect to PostgreSQL
- Build authentication routes (`/api/auth`)
- Build service catalog routes (`/api/services`)
- Build feedback and request routes
- Integrate Cosmos DB for chatbot logs

### Copilot Assistance:
- Autocompletes route handlers and middleware
- Suggests secure JWT-based auth
- Generates SQL queries and error handling logic

---

## 🌐 3. Frontend Development (GitHub Copilot)

### Tasks:
- Initialize React project
- Create layout and routing structure
- Build Citizen Portal: homepage, service catalog, dashboard
- Build Admin Portal: service management, analytics
- Build Government & Partner Portals
- Add multilingual support (Amharic, Oromo, English)
- Integrate chatbot widget

### Copilot Assistance:
- Generates React components and hooks
- Suggests i18n setup and accessibility improvements
- Autocompletes form validation and API integration

---

## 🤖 4. AI Chatbot Integration (GitHub + Azure Copilot)

### Tasks:
- Set up Python chatbot service
- Integrate GPT-4 via Azure OpenAI
- Add Amharic-BERT for local language support
- Implement RAG using Azure AI Search
- Store logs in Cosmos DB
- Enable feedback loop for training

### Copilot Assistance:
- Generates Python scripts for NLP pipeline
- Suggests prompt engineering strategies
- Helps configure AI Search indexing

---

## 🚀 5. CI/CD Pipeline (GitHub Copilot)

### Tasks:
- Create GitHub Actions workflow (`deploy.yml`)
- Automate build, test, and deploy
- Integrate Azure Key Vault for secrets
- Set up staging and production environments

### Copilot Assistance:
- Generates CI/CD scripts
- Suggests environment variable management
- Troubleshoots deployment errors

---

## 📊 6. Monitoring & Logging (Azure Copilot)

### Tasks:
- Enable Application Insights
- Configure Log Analytics
- Set up alerts and dashboards

### Copilot Assistance:
- Suggests metrics to monitor
- Helps configure alerts and retention policies

---

## 📚 7. Documentation & Onboarding (Microsoft 365 + GitHub Copilot)

### Tasks:
- Create README.md and onboarding guide
- Maintain API documentation (Swagger)
- Track changes in changelog
- Prepare user manuals and training materials

### Copilot Assistance:
- Drafts documentation templates
- Summarizes code changes
- Generates onboarding checklists

---

## ✅ Final Notes

This workflow ensures rapid, secure, and scalable development of the Ethiopian Navigator MVP using Copilot tools across GitHub, Azure, and Microsoft 365.



---

# Ethiopian Navigator Copilot Integration Plan

# Ethiopian Navigator MVP – Microsoft Copilot Integration Plan

This document outlines a comprehensive plan to integrate Microsoft Copilot into the development, documentation, automation, deployment, and monitoring of the Ethiopian Navigator MVP.

---

## 🧠 Overview

Microsoft Copilot (GitHub Copilot, Azure Copilot, and Microsoft 365 Copilot) will assist in:

- Code generation and refactoring
- Infrastructure provisioning
- CI/CD pipeline automation
- Documentation and onboarding
- Monitoring and troubleshooting

---

## 🧱 1. Infrastructure Automation with Azure Copilot

### 🔹 Tasks:
- Provision Azure resources via Azure CLI or Bicep templates
- Configure networking, firewall rules, and SSL
- Store secrets in Azure Key Vault

### 🛠️ Copilot Usage:
- Ask Azure Copilot to generate Bicep templates for:
  - Resource Group
  - PostgreSQL Flexible Server
  - Cosmos DB
  - Blob Storage
  - Azure AI Search
  - Azure OpenAI
  - App Service Plan & Web App
  - Application Insights

### ✅ Example Prompt:
> "Generate a Bicep template to deploy a PostgreSQL Flexible Server with SSL enabled in Central US."

---

## 🧑‍💻 2. Backend Development with GitHub Copilot

### 🔹 Tasks:
- Build REST APIs for auth, service catalog, feedback, chatbot
- Connect to PostgreSQL and Cosmos DB
- Implement JWT-based authentication and RBAC

### 🛠️ Copilot Usage:
- Auto-generate Express.js routes and middleware
- Suggest SQL queries and schema definitions
- Refactor and optimize API logic

### ✅ Example Prompt:
> "Create an Express.js route for user registration with password hashing and PostgreSQL insert."

---

## 🌐 3. Frontend Development with GitHub Copilot

### 🔹 Tasks:
- Build React components for citizen, admin, government, and partner portals
- Integrate APIs and multilingual support
- Apply Ethiopian branding and accessibility standards

### 🛠️ Copilot Usage:
- Generate React components and hooks
- Suggest i18n integration and responsive layouts
- Refactor JSX and CSS for performance

### ✅ Example Prompt:
> "Create a React component for a multilingual service catalog with search and filter options."

---

## 🤖 4. AI Chatbot Development with GitHub Copilot

### 🔹 Tasks:
- Build Python-based chatbot using GPT-4 and Amharic-BERT
- Integrate Azure AI Search for RAG
- Log queries and feedback in Cosmos DB

### 🛠️ Copilot Usage:
- Generate Python scripts for NLP pipelines
- Suggest prompt engineering strategies
- Refactor chatbot logic and error handling

### ✅ Example Prompt:
> "Create a Python function that uses Azure OpenAI to answer questions based on indexed documents."

---

## 📄 5. Documentation with Microsoft 365 Copilot

### 🔹 Tasks:
- Draft README files, onboarding guides, API docs
- Maintain changelogs and versioning
- Generate proposals, ToRs, and reports

### 🛠️ Copilot Usage:
- Use Word Copilot to summarize meetings and generate specs
- Use Excel Copilot to track progress and budgets
- Use Teams Copilot to manage tasks and updates

### ✅ Example Prompt:
> "Summarize the development progress and generate a changelog for the last sprint."

---

## 🚀 6. CI/CD Pipeline Setup with GitHub Copilot

### 🔹 Tasks:
- Configure GitHub Actions workflows
- Automate build, test, and deployment
- Integrate secrets from Azure Key Vault

### 🛠️ Copilot Usage:
- Generate `deploy.yml` files
- Suggest environment variable management
- Refactor pipeline steps for efficiency

### ✅ Example Prompt:
> "Create a GitHub Actions workflow to deploy a Node.js app to Azure App Service using secrets from Key Vault."

---

## 📊 7. Monitoring & Logging with Azure Copilot

### 🔹 Tasks:
- Set up Application Insights and Log Analytics
- Configure alerts and dashboards
- Monitor performance and errors

### 🛠️ Copilot Usage:
- Generate KQL queries for log analysis
- Suggest alert rules and metrics
- Automate dashboard creation

### ✅ Example Prompt:
> "Create a KQL query to monitor failed login attempts in the Ethiopian Navigator backend."

---

## 📚 8. Developer Onboarding & Handover

### 🔹 Tasks:
- Create onboarding guides and checklists
- Document architecture and workflows
- Maintain technical logs and secrets management

### 🛠️ Copilot Usage:
- Auto-generate Markdown files for onboarding
- Suggest folder structures and naming conventions
- Draft secure secrets management guides

---

## ✅ Summary

| Phase | Copilot Role |
|-------|--------------|
| Infrastructure | Azure Copilot for provisioning and security |
| Backend | GitHub Copilot for API generation and DB integration |
| Frontend | GitHub Copilot for React components and UI logic |
| AI Chatbot | GitHub Copilot for NLP and RAG integration |
| CI/CD | GitHub Copilot for workflow automation |
| Monitoring | Azure Copilot for insights and alerts |
| Documentation | Microsoft 365 Copilot for specs and reports |

---

## 📌 Next Steps

- Enable GitHub Copilot in VS Code
- Use Azure Copilot in Azure Portal
- Use Microsoft 365 Copilot in Word, Excel, and Teams
- Follow this workflow for consistent development and deployment



---

# Ethiopian Navigator Copilot Development Guide

# Ethiopian Navigator MVP – Microsoft Copilot Development Guide

## 📘 Overview

This guide provides a step-by-step walkthrough for using **Microsoft Copilot tools** to develop, deploy, and maintain the Ethiopian Navigator MVP. It covers GitHub Copilot, Azure Copilot, and Microsoft 365 Copilot across all phases of the project.

---

## 🧠 Copilot Tools Overview

| Tool | Purpose |
|------|--------|
| **GitHub Copilot** | Code generation, refactoring, documentation |
| **Azure Copilot** | Infrastructure provisioning, deployment, monitoring |
| **Microsoft 365 Copilot** | Planning, documentation, reporting, collaboration |

---

## 🧭 Step-by-Step Development Workflow

### 1. 📋 Planning & Documentation (Microsoft 365 Copilot)

- **Use Word Copilot** to draft:
  - Product Requirements Document (PRD)
  - Terms of Reference (ToR)
  - Product Design Specification (PDS)
- **Use Excel Copilot** to estimate:
  - Budget breakdown
  - Timeline and WBS
- **Use Teams Copilot** to:
  - Summarize meetings
  - Track decisions and action items

**Example Prompt**:
> “Draft a PRD for a multilingual government service portal with citizen, admin, and partner roles.”

---

### 2. 🏗️ Infrastructure Setup (Azure Copilot)

- Provision resources:
  - Resource Group
  - PostgreSQL Flexible Server
  - Cosmos DB (MongoDB API)
  - Blob Storage
  - Azure AI Search
  - Azure OpenAI
  - Azure Key Vault
  - App Service & Application Insights

**Use Azure Copilot to**:
- Generate Bicep or PowerShell scripts
- Configure firewall rules and SSL
- Set up monitoring and alerts

**Example Prompt**:
> “Create a Bicep template for a PostgreSQL Flexible Server with SSL enabled and firewall rules.”

---

### 3. 🔧 Backend Development (GitHub Copilot)

- Scaffold Express.js server
- Create REST APIs:
  - `/api/auth` – JWT-based authentication
  - `/api/services` – Service catalog
  - `/api/requests` – Application tracking
  - `/api/feedback` – Citizen feedback
  - `/api/chatbot` – AI chatbot queries

**Use GitHub Copilot to**:
- Generate routes and controllers
- Suggest SQL queries and error handling
- Integrate PostgreSQL and Cosmos DB

**Example Prompt**:
> “Create an Express route for user registration with password hashing and JWT token generation.”

---

### 4. 🌐 Frontend Development (GitHub Copilot)

- Build React.js portals for:
  - Citizens
  - Admins
  - Government Employees
  - Partners

**Use GitHub Copilot to**:
- Generate React components
- Add multilingual support (Amharic, Oromo, English)
- Connect frontend to backend APIs

**Example Prompt**:
> “Create a React component for a multilingual service catalog with search and filter options.”

---

### 5. 🤖 AI Chatbot Integration (GitHub + Azure Copilot)

- Build Python chatbot using:
  - GPT-4 (Azure OpenAI)
  - Amharic-BERT (Hugging Face)
- Enable RAG with Azure AI Search
- Store logs in Cosmos DB

**Use GitHub Copilot to**:
- Generate Python functions for NLP
- Integrate chatbot with backend

**Use Azure Copilot to**:
- Configure OpenAI and AI Search resources

**Example Prompt**:
> “Create a Python function that uses Azure OpenAI to answer questions from indexed documents.”

---

### 6. 🚀 CI/CD Automation (GitHub Copilot)

- Configure GitHub Actions workflows:
  - Build and test backend
  - Deploy to Azure App Service
  - Integrate secrets from Azure Key Vault

**Use GitHub Copilot to**:
- Generate `.github/workflows/deploy.yml`
- Automate deployment and rollback

**Example Prompt**:
> “Create a GitHub Actions workflow to deploy a Node.js app to Azure App Service with Key Vault secrets.”

---

### 7. 📊 Monitoring & Logging (Azure Copilot)

- Set up:
  - Application Insights
  - Log Analytics
  - Traffic Manager

**Use Azure Copilot to**:
- Create dashboards
- Configure alerts and KQL queries

**Example Prompt**:
> “Create a KQL query to monitor failed login attempts and alert if threshold exceeds.”

---

### 8. 📚 Documentation & Onboarding (GitHub + Microsoft 365 Copilot)

- Maintain:
  - README.md
  - Developer onboarding guide
  - API documentation (Swagger)
  - Changelog and versioning

**Use GitHub Copilot to**:
- Auto-generate documentation from code

**Use Word Copilot to**:
- Draft onboarding guides and manuals

**Example Prompt**:
> “Generate a README file for a Node.js backend with PostgreSQL and JWT authentication.”

---

## ✅ Best Practices

- Use descriptive prompts for Copilot
- Review and refactor generated code
- Store secrets securely in Azure Key Vault
- Maintain documentation in Markdown and Word
- Use version control and CI/CD for all environments

---

## 📌 Summary

Microsoft Copilot tools can accelerate every phase of Ethiopian Navigator development. By combining GitHub, Azure, and Microsoft 365 Copilot, you can streamline planning, coding, automation, and deployment with AI-powered assistance.



---

# Ethiopian Navigator Copilot Playbook

# Ethiopian Navigator MVP – Microsoft Copilot Playbook & Prompt Library

This playbook provides a comprehensive guide for using Microsoft Copilot tools to develop, deploy, and maintain the Ethiopian Navigator MVP. It includes categorized prompt examples, best practices, and workflow guidance for GitHub Copilot, Azure Copilot, and Microsoft 365 Copilot.

---

## 🧠 Overview of Copilot Tools

| Tool | Purpose |
|------|---------|
| **GitHub Copilot** | Code generation, refactoring, documentation |
| **Azure Copilot** | Infrastructure provisioning, deployment, monitoring |
| **Microsoft 365 Copilot** | Planning, documentation, reporting, collaboration |

---

## 🧪 GitHub Copilot

### ✅ Use Cases
- Backend API scaffolding (Node.js/Express)
- Frontend component generation (React.js)
- AI chatbot integration (Python)
- Writing tests and documentation

### 💬 Prompt Examples
- "Create an Express route for user registration with password hashing"
- "Generate a React component for multilingual service catalog"
- "Write a Python function to query Azure OpenAI with RAG"
- "Create unit tests for the login API using Jest"

### 🛠️ Best Practices
- Use descriptive comments to guide Copilot
- Break tasks into small functions
- Review and refactor Copilot suggestions
- Use Copilot Labs for code explanation and translation

---

## ☁️ Azure Copilot

### ✅ Use Cases
- Provision Azure resources (PostgreSQL, Cosmos DB, Blob Storage)
- Generate Bicep or ARM templates
- Configure monitoring and alerts
- Troubleshoot deployment issues

### 💬 Prompt Examples
- "Create a Bicep template for PostgreSQL Flexible Server with SSL"
- "Provision Azure AI Search and connect it to Blob Storage"
- "List all resources in resource group 'ethiopian-navigator-rg'"
- "Generate a cleanup script for unused resources"

### 🛠️ Best Practices
- Use consistent naming conventions
- Store secrets in Azure Key Vault
- Enable diagnostic settings and alerts
- Use deployment scripts for reproducibility

---

## 📄 Microsoft 365 Copilot

### ✅ Use Cases
- Draft PRD, ToR, PDS documents
- Summarize meetings and decisions
- Generate budget estimates and timelines
- Create onboarding and training materials

### 💬 Prompt Examples
- "Draft a Terms of Reference for Ethiopian Navigator MVP"
- "Summarize this Teams meeting and extract action items"
- "Create a Gantt chart for a 12-week development plan"
- "Generate a user manual for the citizen portal"

### 🛠️ Best Practices
- Use structured templates for consistency
- Collaborate via OneDrive and Teams
- Link documents to GitHub Wiki
- Use version history for tracking changes

---

## 🧭 Copilot-Driven Development Workflow

1. **Planning** – Use 365 Copilot to draft specs and proposals
2. **Infrastructure** – Use Azure Copilot to provision resources
3. **Backend** – Use GitHub Copilot to scaffold APIs and DB models
4. **Frontend** – Use GitHub Copilot to build React components
5. **AI Chatbot** – Use GitHub Copilot to integrate GPT-4 and RAG
6. **CI/CD** – Use GitHub Copilot to configure workflows
7. **Monitoring** – Use Azure Copilot to set up Application Insights
8. **Documentation** – Use 365 Copilot to generate guides and manuals

---

## 📌 Summary

Microsoft Copilot tools empower rapid, secure, and collaborative development of the Ethiopian Navigator MVP. By leveraging GitHub, Azure, and 365 Copilot together, teams can streamline coding, infrastructure, documentation, and deployment.



---

# Ethiopian Navigator SSOT

# Ethiopian Navigator MVP – Single Source of Truth (SSOT)

This document consolidates all critical information, decisions, architecture, workflows, documentation references, naming conventions, and development standards into one authoritative reference for the Ethiopian Navigator MVP project team.


---

## Product Design Specification

Ethiopian Navigator MVP - Product Design & Customization Specification
1. Architecture Overview
The Ethiopian Navigator MVP is built on a microservices architecture leveraging Azure cloud services. The core components include a React frontend, Node.js backend, PostgreSQL and Cosmos DB databases, Azure AI Search, Azure OpenAI for chatbot functionality, and Blob Storage for document uploads. The system supports multilingual interactions (Amharic, Oromo, English) and role-based access for Citizens, Government Employees, Partners, and Admins.
2. Base Template Selection
The project will customize the Azure OpenAI template 'azure-search-openai-demo' which provides a Retrieval-Augmented Generation (RAG) framework combining Azure AI Search and OpenAI GPT models. This template includes a Python backend, React frontend, and integration with Azure services.
3. Customization Plan
The following customizations will be applied to the base template:
- Replace sample data with Ethiopian government service metadata and FAQs.
- Extend chatbot to support Amharic and Oromo using Amharic-BERT and GPT-4.
- Integrate PostgreSQL and Cosmos DB for structured and unstructured data.
- Modify UI to support role-based portals for Citizens, Admins, Government Employees, and Partners.
- Add document upload functionality using Azure Blob Storage.
- Implement feedback loop and service request tracking.
4. Integration Points
- Azure PostgreSQL: Service requests, user accounts, feedback.
- Azure Cosmos DB: Chatbot logs and training data.
- Azure Blob Storage: Document uploads.
- Azure AI Search: Service catalog indexing.
- Azure Key Vault: Secrets and credentials management.
- Azure Application Insights: Monitoring and telemetry.
5. Development Tasks
Frontend:
- Customize React components for each user role.
- Integrate chatbot widget with multilingual support.
- Implement dashboards and service application forms.
Backend:
- Set up PostgreSQL schema and APIs for service catalog, feedback, and requests.
- Integrate Cosmos DB for chatbot logging.
- Configure Azure AI Search indexing and retrieval.
- Implement authentication and RBAC.
6. Tracking Progress
- Use GitHub Projects or Azure Boards for task tracking.
- Maintain a changelog for each module.
- Document completed tasks and pending items in a shared dashboard.
7. Onboarding Guidance
- Provide access to GitHub repo and Azure portal.
- Share infrastructure provisioning scripts and environment variables.
- Maintain README files for each module with setup instructions.
- Create onboarding checklist for new developers.
8. Change Management
- All changes must be documented in the changelog.
- Use pull requests and code reviews for all updates.
- Maintain version control and tag releases.
- Update onboarding and documentation with each major change.
---

## Project Proposal

Ethiopian Navigator MVP - Project Proposal
1. Executive Summary
The Ethiopian Navigator MVP is a multilingual, citizen-centric digital platform designed to streamline access to government services. Leveraging Azure OpenAI and cloud-native architecture, the solution aims to improve transparency, efficiency, and user experience for citizens, government employees, and partners. This proposal outlines the technical and operational roadmap for customizing, developing, deploying, and maintaining the MVP.
2. Problem Statement
Citizens face challenges in discovering and accessing government services due to fragmented systems, language barriers, and lack of centralized information. Government agencies struggle with service delivery, feedback management, and performance tracking. There is a need for a unified, intelligent platform that simplifies service navigation and enhances engagement across stakeholders.
3. Proposed Solution
Customize the Azure OpenAI template (azure-search-openai-demo) to build the Ethiopian Navigator MVP. The platform will feature multilingual support, AI-powered search and chatbot, service catalog APIs, feedback mechanisms, and role-based portals for citizens, government employees, partners, and administrators. It will be deployed on Azure using scalable and secure cloud resources.
4. Objectives and Scope
Objectives:
- Deliver a functional MVP with core features for service discovery, application, tracking, and feedback.
- Enable multilingual interaction (Amharic, Oromo, English).
- Integrate AI chatbot and search capabilities.
- Provide role-based access and dashboards.

Scope:
- Backend and frontend development
- Azure resource provisioning
- AI chatbot integration
- Testing, deployment, and documentation
5. Technical Approach and Architecture
The solution will be based on a microservices architecture using Node.js for backend APIs, React.js for frontend UI, and Python for AI chatbot services. Azure resources include PostgreSQL Flexible Server, Cosmos DB, Blob Storage, Azure AI Search, Azure OpenAI, Key Vault, and App Service. The architecture supports modular development, scalability, and secure data handling.
6. Implementation Plan and Timeline
Phase 1: Project Setup and Planning (Week 1)
Phase 2: Backend and Database Development (Weeks 2-3)
Phase 3: Frontend Development and UI Customization (Weeks 4-5)
Phase 4: AI Chatbot Integration and Search Indexing (Weeks 6-7)
Phase 5: Testing and QA (Week 8)
Phase 6: Deployment and Go-Live (Week 9)
Phase 7: Documentation and Handover (Week 10)
7. Resource Requirements
Human Resources:
- Full-stack developer
- AI/NLP engineer
- UI/UX designer
- QA tester
- DevOps engineer

Technical Resources:
- Azure subscription with required services
- GitHub repository
- Visual Studio Code
- Postman or REST Client
- DBeaver or pgAdmin for database management
8. Expected Outcomes and Impact
The Ethiopian Navigator MVP will provide a centralized, intelligent platform for accessing government services. It will improve citizen satisfaction, reduce service delivery time, and enhance transparency. Government agencies will benefit from streamlined workflows, feedback analytics, and performance tracking.
9. Risk Management and Mitigation
Risks:
- Delays in Azure resource provisioning
- Integration challenges with multilingual NLP
- Data security and privacy concerns

Mitigation:
- Use pre-approved Azure templates and automation scripts
- Leverage existing NLP models and test early
- Implement RBAC, encryption, and secure storage practices
---

## Project Proposal Updated

Ethiopian Navigator MVP - Project Proposal
1. Executive Summary
The Ethiopian Navigator MVP is a multilingual, citizen-centric digital platform designed to streamline access to government services. Leveraging Azure OpenAI and cloud-native architecture, the solution aims to improve transparency, efficiency, and user experience for citizens, government employees, and partners. This proposal outlines the technical and operational roadmap for customizing, developing, deploying, and maintaining the MVP.
2. Problem Statement
Citizens face challenges in discovering and accessing government services due to fragmented systems, language barriers, and lack of centralized information. Government agencies struggle with service delivery, feedback management, and performance tracking. There is a need for a unified, intelligent platform that simplifies service navigation and enhances engagement across stakeholders.
3. Proposed Solution
Customize the Azure OpenAI template (azure-search-openai-demo) to build the Ethiopian Navigator MVP. The platform will feature multilingual support, AI-powered search and chatbot, service catalog APIs, feedback mechanisms, and role-based portals for citizens, government employees, partners, and administrators. It will be deployed on Azure using scalable and secure cloud resources.
4. Objectives and Scope
Objectives:
- Deliver a functional MVP with core features for service discovery, application, tracking, and feedback.
- Enable multilingual interaction (Amharic, Oromo, English).
- Integrate AI chatbot and search capabilities.
- Provide role-based access and dashboards.

Scope:
- Backend and frontend development
- Azure resource provisioning
- AI chatbot integration
- Testing, deployment, and documentation
5. Technical Approach and Architecture
The solution will be based on a microservices architecture using Node.js for backend APIs, React.js for frontend UI, and Python for AI chatbot services. Azure resources include PostgreSQL Flexible Server, Cosmos DB, Blob Storage, Azure AI Search, Azure OpenAI, Key Vault, and App Service. The architecture supports modular development, scalability, and secure data handling.
6. Implementation Plan and Timeline
Phase 1: Project Setup and Planning (Week 1)
Phase 2: Backend and Database Development (Weeks 2-3)
Phase 3: Frontend Development and UI Customization (Weeks 4-5)
Phase 4: AI Chatbot Integration and Search Indexing (Weeks 6-7)
Phase 5: Testing and QA (Week 8)
Phase 6: Deployment and Go-Live (Week 9)
Phase 7: Documentation and Handover (Week 10)
7. Resource Requirements
Human Resources:
- Full-stack developer
- AI/NLP engineer
- UI/UX designer
- QA tester
- DevOps engineer

Technical Resources:
- Azure subscription with required services
- GitHub repository
- Visual Studio Code
- Postman or REST Client
- DBeaver or pgAdmin for database management
8. Expected Outcomes and Impact
The Ethiopian Navigator MVP will provide a centralized, intelligent platform for accessing government services. It will improve citizen satisfaction, reduce service delivery time, and enhance transparency. Government agencies will benefit from streamlined workflows, feedback analytics, and performance tracking.
9. Risk Management and Mitigation
Risks:
- Delays in Azure resource provisioning
- Integration challenges with multilingual NLP
- Data security and privacy concerns

Mitigation:
- Use pre-approved Azure templates and automation scripts
- Leverage existing NLP models and test early
- Implement RBAC, encryption, and secure storage practices
10. Budget Breakdown and Cost Estimate

The estimated budget for the Ethiopian Navigator MVP is based on Azure resource usage, development effort, and operational costs.

### Azure Resource Estimate (Monthly)
- Azure App Service (Web App): $30
- Azure PostgreSQL Flexible Server: $60
- Azure Cosmos DB (MongoDB API): $40
- Azure Blob Storage: $10
- Azure OpenAI Service: $100
- Azure AI Search: $30
- Azure Key Vault, Application Insights, Log Analytics: $30
- Total Estimated Monthly Cost: **$300**

### Development Effort Estimate
- Full-stack Developer (1): $4,000/month × 3 months = $12,000
- AI/NLP Specialist (1): $4,500/month × 2 months = $9,000
- UI/UX Designer (1): $3,000/month × 2 months = $6,000
- Project Manager (1): $3,500/month × 3 months = $10,500
- Total Development Cost: **$37,500**

### Other Costs
- Tools & Licenses: $500
- Contingency (10%): $3,800
- Total Estimated Project Cost: **$42,100**

11. Work Breakdown Structure (WBS)

The WBS outlines the major components and tasks for the Ethiopian Navigator MVP:

1. Planning & Requirements
   - Define objectives
   - Finalize documentation
   - Stakeholder alignment

2. Azure Infrastructure Setup
   - Provision resource group
   - Deploy PostgreSQL, Cosmos DB, Blob Storage
   - Configure Key Vault, AI Search, App Insights

3. Backend Development
   - Set up Express.js server
   - Implement authentication & RBAC
   - Build service catalog, feedback, chatbot APIs

4. Frontend Development
   - Build citizen portal (React)
   - Build admin and government portals
   - Integrate multilingual support

5. AI Chatbot Integration
   - Customize Azure OpenAI template
   - Integrate GPT-4 and Amharic-BERT
   - Connect to service metadata and feedback

6. Testing & QA
   - Unit and integration testing
   - UAT and performance testing
   - Bug fixing and validation

7. Deployment & Monitoring
   - Configure CI/CD pipelines
   - Set up monitoring and alerts
   - Prepare go-live checklist

8. Documentation & Onboarding
   - Developer onboarding guide
   - API documentation
   - User manuals

12. Project Timeline

The Ethiopian Navigator MVP is planned over a 12-week period:

- Week 1–2: Planning, documentation finalization, Azure setup
- Week 3–5: Backend and database development
- Week 6–8: Frontend development and UI integration
- Week 9–10: AI chatbot customization and integration
- Week 11: Testing, bug fixing, and performance validation
- Week 12: Final deployment, monitoring setup, and go-live

Total Duration: **12 Weeks**

---

## Terms Of Reference

Terms of Reference (ToR): Ethiopian Navigator MVP Project
1. Project Background and Objectives
The Ethiopian Navigator MVP is a multilingual, citizen-centric government service portal designed to streamline public service delivery. It leverages Azure OpenAI, Azure AI Search, and a microservices architecture to provide transparent, efficient, and accessible services to citizens, government employees, partners, and administrators. The objective is to build a scalable MVP that integrates AI-driven service discovery, feedback mechanisms, and multilingual support for Amharic, Oromo, and English.
2. Scope of Work
The scope includes customizing an Azure OpenAI template, developing backend and frontend modules, integrating an AI chatbot, provisioning Azure resources, setting up CI/CD pipelines, conducting testing and QA, and deploying the MVP to production. The system will support multiple user roles and provide service catalog, application tracking, feedback submission, and analytics.
3. Customization of Azure OpenAI Template
The project will customize the 'azure-search-openai-demo' template to serve as the foundation for the Ethiopian Navigator. This includes replacing sample data with government service metadata, extending the chatbot to support local languages, integrating with PostgreSQL and Cosmos DB, and modifying the UI to reflect Ethiopian branding.
4. Development Phases
4.1 Backend Development
Develop RESTful APIs for authentication, service catalog, service requests, feedback, and chatbot integration. Integrate PostgreSQL for structured data, Cosmos DB for chat logs, Blob Storage for document uploads, and Azure AI Search for service discovery.
4.2 Frontend Development
Build React.js components for citizen, admin, government employee, and partner portals. Implement multilingual support, accessibility features, and responsive design.
4.3 AI Chatbot Integration
Extend GPT-4 with Amharic-BERT for local language understanding. Integrate service metadata and FAQs into the chatbot knowledge base. Enable personalized checklists and feedback loop.
5. Testing and Quality Assurance
Conduct unit, integration, and performance testing. Validate chatbot accuracy and multilingual support. Perform user acceptance testing (UAT) and resolve reported issues.
6. Deployment and Go-Live Strategy
Set up CI/CD pipelines using GitHub Actions. Deploy to Azure App Services with monitoring via Application Insights and Log Analytics. Configure Traffic Manager and cost alerts. Prepare user manuals and onboarding materials. Execute go-live checklist and monitor system health post-launch.
7. Roles and Responsibilities
Product Owner: Define vision, approve designs, provide content, coordinate stakeholders.
Full-Stack Developer: Customize template, develop backend and frontend, integrate AI chatbot, set up CI/CD, maintain documentation.
QA Engineer: Conduct testing, report bugs, validate fixes.
DevOps Engineer: Manage deployment, monitor infrastructure, configure alerts.
Content Team: Prepare service metadata, FAQs, and chatbot training data.
8. Tools and Technologies
Azure OpenAI, Azure AI Search, Azure App Services, Azure PostgreSQL, Azure Cosmos DB, Azure Blob Storage, Azure Key Vault, GitHub, GitHub Actions, Visual Studio Code, Node.js, Express.js, React.js, Python, Amharic-BERT, GPT-4, Swagger, Postman, DBeaver.
9. Deliverables and Timeline
Deliverables:
- Customized Azure OpenAI template
- Backend and frontend modules
- AI chatbot integration
- Azure infrastructure setup
- CI/CD pipelines
- Testing reports
- Deployment scripts
- Documentation and onboarding guides

Timeline:
Week 1-2: Setup and customization
Week 3-4: Backend and frontend development
Week 5: AI chatbot integration
Week 6: Testing and QA
Week 7: Deployment and go-live
Week 8: Post-launch monitoring and support
---

## Project Summary

Ethiopian Navigator MVP - Project Summary
1. Project Overview
The Ethiopian Navigator MVP is a multilingual, citizen-centric government service portal built on Azure. It leverages Azure OpenAI, AI Search, and a microservices architecture to deliver transparent and efficient G2C services. The project is based on the Azure OpenAI RAG template (azure-search-openai-demo) and is being customized to meet the needs of Ethiopian citizens, government employees, partners, and administrators.
2. Objectives
- Customize the Azure OpenAI demo template to build the Ethiopian Navigator MVP.
- Implement multilingual support (Amharic, Oromo, English).
- Develop backend APIs for authentication, service catalog, feedback, and chatbot.
- Build React frontend for citizen, admin, government, and partner portals.
- Integrate PostgreSQL, Cosmos DB, Blob Storage, and Azure AI Search.
- Set up CI/CD pipelines, monitoring, and developer onboarding documentation.
3. Completed Work
- Forked the Azure OpenAI demo template into GitHub.
- Cloned the repository locally using VS Code terminal.
- Created project folder structure: frontend, backend, ai-chatbot, infrastructure, docs, onboarding.
- Added initial README.md with project overview and setup instructions.
- Initialized backend project with npm and installed core dependencies.
- Created and tested Express server (server.js).
- Created .env, db.js, and auth.js files for PostgreSQL and authentication.
- Created routes folder and integrated auth routes into server.js.
- Connected to Azure PostgreSQL using VS Code.
- Created users table in PostgreSQL.
4. Remaining Tasks
- Test authentication endpoints using REST Client.
- Build service catalog APIs.
- Develop React frontend components.
- Integrate AI chatbot with GPT-4 and Amharic-BERT.
- Set up Azure AI Search indexing.
- Implement feedback and notification modules.
- Configure CI/CD pipelines and monitoring tools.
- Finalize onboarding documentation and changelogs.
5. Task Checklist
☑ Fork Azure OpenAI demo template
☑ Clone repo locally using VS Code
☑ Create project folder structure
☑ Add initial README.md
☑ Initialize backend with npm
☑ Install backend dependencies
☑ Create and test Express server
☑ Create .env, db.js, auth.js
☑ Create routes folder and integrate auth
☑ Connect to Azure PostgreSQL
☑ Create users table
☐ Test authentication endpoints
☐ Build service catalog APIs
☐ Develop React frontend components
☐ Integrate AI chatbot
☐ Set up Azure AI Search indexing
☐ Implement feedback and notification modules
☐ Configure CI/CD pipelines
☐ Finalize onboarding documentation
6. Next Steps
- Test the authentication endpoints using REST Client.
- Begin development of service catalog APIs.
- Start building frontend components for citizen portal.
- Prepare chatbot training data and integrate GPT-4 and Amharic-BERT.
- Set up Azure AI Search indexing for service metadata.
- Continue documenting progress and onboarding materials.
---

## Development Summary

Ethiopian Navigator MVP – Development Summary
1. Project Overview
The Ethiopian Navigator MVP is a multilingual, citizen-centric government service portal built on Azure. It leverages Azure OpenAI, AI Search, PostgreSQL, Cosmos DB, and a microservices architecture to deliver transparent, efficient, and accessible G2C services. The project is based on the customization of the 'azure-search-openai-demo' template and aims to provide a scalable platform for service discovery, application tracking, feedback, and chatbot assistance.
2. Objectives
- Customize the Azure OpenAI demo template to fit Ethiopian Navigator requirements.
- Build backend APIs for authentication, service catalog, feedback, and chatbot.
- Develop a multilingual React frontend for citizens, admins, government employees, and partners.
- Integrate GPT-4 and Amharic-BERT for AI chatbot functionality.
- Set up CI/CD pipelines, monitoring, and onboarding documentation.
3. Completed Work
- Forked and cloned the azure-search-openai-demo repository.
- Set up GitHub repository structure with folders for frontend, backend, ai-chatbot, infrastructure, docs, and onboarding.
- Created and committed README.md with project overview and setup instructions.
- Initialized backend with Express.js and installed core dependencies.
- Created and tested basic Express server.
- Created .env, db.js, and auth.js files for PostgreSQL integration and authentication routes.
- Created routes folder and integrated auth routes into server.js.
- Connected to Azure PostgreSQL Flexible Server using VS Code.
- Created users table in PostgreSQL.
- Tested API endpoints using REST Client in VS Code.
4. Remaining Tasks
- Finalize and test authentication endpoints with PostgreSQL.
- Build service catalog APIs and database schema.
- Develop React frontend components for all user roles.
- Integrate AI chatbot with GPT-4 and Amharic-BERT.
- Set up Azure AI Search indexing and RAG pipeline.
- Implement feedback and notification modules.
- Configure CI/CD pipelines and monitoring tools.
- Prepare onboarding checklist and changelog documentation.
5. Task Checklist
☑ Fork and clone base template
☑ Set up GitHub repo structure
☑ Create README.md
☑ Initialize backend and install dependencies
☑ Create and run Express server
☑ Create .env, db.js, auth.js
☑ Create routes folder and integrate auth routes
☑ Connect to Azure PostgreSQL
☑ Create users table
☑ Test API endpoints
☐ Build service catalog APIs
☐ Develop React frontend
☐ Integrate AI chatbot
☐ Set up Azure AI Search
☐ Implement feedback module
☐ Configure CI/CD pipelines
☐ Prepare onboarding documentation
6. Next Steps
- Proceed with building service catalog APIs and database schema.
- Begin frontend development for citizen and admin portals.
- Integrate AI chatbot and test multilingual support.
- Set up Azure AI Search and RAG pipeline.
- Configure CI/CD workflows and monitoring tools.
- Finalize onboarding documentation and changelog.
---

## Technical Blueprint

Ethiopian Navigator MVP - Technical Blueprint
1. Azure OpenAI Template Selection and Customization Strategy
The Ethiopian Navigator MVP is built upon the 'azure-search-openai-demo' template, which provides a Retrieval-Augmented Generation (RAG) architecture using Azure OpenAI and Azure AI Search. This template was selected for its modular design, support for multilingual chat, and integration with Azure services. Customization includes replacing sample data with Ethiopian government service metadata, extending the chatbot to support Amharic and Oromo using Amharic-BERT, and modifying the UI for citizen, admin, and government employee roles.
2. Azure Resource Provisioning and Configuration
Azure resources provisioned include:
- Resource Group: ethiopian-navigator-rg
- PostgreSQL Flexible Server: ethionav-postgres-server
- Cosmos DB (MongoDB API): ethionav-cosmosdb
- App Service Plan and Web App: ethionav-backend
- Storage Account for document uploads
- Azure AI Search for service catalog indexing
- Azure Key Vault for secrets management
- Application Insights and Log Analytics for monitoring
Firewall rules and SSL configurations were applied to enable secure access from local development environments.
3. GitHub Repository Setup and Structure
The GitHub repository is forked from the Azure template and renamed to 'ethiopian-navigator-mvpv1'. The structure includes:
- frontend/: React.js UI components
- backend/: Node.js Express APIs
- ai-chatbot/: Python GPT-4 and Amharic-BERT integration
- infrastructure/: Azure provisioning scripts
- docs/: Product design and architecture documentation
- onboarding/: Developer onboarding guides
README.md and .env files are configured for environment setup and contribution guidelines.
4. Visual Studio Code Environment Setup
VS Code is used for development with the following setup:
- Git integration for version control
- REST Client extension for API testing
- Node.js and Python environments configured
- Terminal access for running backend server and managing dependencies
- Folder structure aligned with GitHub repository
5. Backend and Frontend Development Plan
Backend:
- Initialize Express server with authentication and service catalog APIs
- Connect to PostgreSQL using pg module
- Implement JWT-based authentication and role-based access control
- Create REST endpoints for citizen requests, feedback, and chatbot queries

Frontend:
- Build React components for citizen, admin, government, and partner portals
- Integrate multilingual support and Ethiopian branding
- Connect frontend to backend APIs using Axios
- Implement dashboard, service catalog, and application forms
6. AI Chatbot Integration
The AI chatbot is built using GPT-4 and Amharic-BERT for multilingual support. Integration includes:
- RAG pipeline using Azure AI Search
- Chatbot endpoints in Python with Flask or FastAPI
- Logging and training data stored in Cosmos DB
- Personalized checklists and escalation to human support
- Embedding chatbot widget in frontend UI
7. CI/CD and Monitoring Setup
CI/CD is configured using GitHub Actions:
- Automated build and deployment to Azure Web App
- Secrets managed via Azure Key Vault
- Application Insights for performance monitoring
- Log Analytics for error tracking
- Cost alerts and auto-scaling policies applied
8. Developer Onboarding and Documentation Practices
Developer onboarding includes:
- Onboarding checklist in onboarding/ folder
- README.md with setup instructions and contribution guidelines
- API documentation using Swagger
- Changelog and versioning maintained
- Architecture diagrams and workflow maps in docs/
---

## Low Level Design

Ethiopian Navigator MVP - Low-Level Design (LLD)
1. Module Breakdown
The Ethiopian Navigator MVP consists of the following modules:
- Frontend (React.js): Citizen Portal, Admin Portal, Government Employee Portal, Partner Portal.
- Backend (Node.js/Express): REST APIs for authentication, service catalog, feedback, chatbot, and file uploads.
- AI Chatbot (Python): GPT-4 and Amharic-BERT integration with RAG using Azure AI Search.
- Database: PostgreSQL for structured data, Cosmos DB for chat logs and feedback.
- Search: Azure AI Search for indexing service metadata and documents.
2. API Specifications
Key API endpoints:
- POST /api/auth/register: Register a new user.
- POST /api/auth/login: Authenticate user and return JWT.
- GET /api/services: Retrieve list of services.
- POST /api/requests: Submit a service request.
- POST /api/feedback: Submit feedback.
- POST /api/chatbot/query: Query the AI chatbot.
- POST /api/upload: Upload documents to Azure Blob Storage.
3. Data Models and Entity Relationships
Primary entities:
- User: id, email, password, role
- Service: id, title, description, category, metadata
- Request: id, user_id, service_id, status, submitted_at
- Feedback: id, user_id, message, rating, submitted_at
- ChatLog: id, user_id, query, response, timestamp

Relationships:
- One User can submit many Requests and Feedback entries.
- Each Request is linked to one Service.
- ChatLogs are linked to Users for personalization and training.
4. Component Interactions
- Frontend communicates with Backend via REST APIs.
- Backend interacts with PostgreSQL and Cosmos DB for data persistence.
- Backend invokes Python-based AI Chatbot for query responses.
- AI Chatbot uses Azure AI Search to retrieve relevant documents.
- Blob Storage handles document uploads and retrievals.
5. Sequence Diagrams
Example: Service Request Submission
1. User submits request via frontend.
2. Frontend sends POST /api/requests to backend.
3. Backend validates JWT and request data.
4. Backend stores request in PostgreSQL.
5. Backend returns confirmation to frontend.
6. Error Handling Strategy
- Use try-catch blocks in backend and chatbot modules.
- Return standardized error responses with HTTP status codes.
- Log errors using Application Insights.
- Display user-friendly error messages in frontend.
- Validate inputs at both frontend and backend.
7. Security and Access Control
- Use JWT for authentication and role-based access control.
- Store secrets in Azure Key Vault.
- Use HTTPS for all communications.
- Validate and sanitize all inputs.
- Implement CORS policies and rate limiting.
8. Deployment Architecture
- Azure App Service hosts frontend and backend.
- PostgreSQL Flexible Server for structured data.
- Cosmos DB for unstructured data.
- Azure Blob Storage for file uploads.
- Azure AI Search for document indexing.
- Azure OpenAI for chatbot responses.
- CI/CD via GitHub Actions and Azure DevOps.
9. Monitoring and Logging
- Use Azure Application Insights for performance and error tracking.
- Enable logging in backend and chatbot modules.
- Monitor database performance and query execution.
- Set up alerts for resource usage and failures.
- Use Azure Log Analytics for centralized log management.
---

## Work Plan

Ethiopian Navigator MVP - Full Development & Deployment Work Plan
This document outlines the comprehensive work plan for developing and deploying the Ethiopian Navigator MVP. It includes step-by-step procedures, tools, and guidance across all phases of the project lifecycle.
1. Planning & Requirements
• Review product design and specification documents.
• Define user personas, workflows, and service catalog.
• Select base template: azure-search-openai-demo.
• Establish GitHub repository and branching strategy.
2. Development Environment Setup
• Install Visual Studio Code and required extensions (REST Client, ESLint, Prettier).
• Install Node.js, Python 3, and PostgreSQL client tools.
• Fork and clone the azure-search-openai-demo repository.
• Create project structure: frontend/, backend/, ai-chatbot/, infrastructure/, docs/, onboarding/.
3. Azure Resource Provisioning
• Create resource group: ethiopian-navigator-rg.
• Provision PostgreSQL Flexible Server, Cosmos DB, Blob Storage, Azure AI Search, Key Vault, App Service.
• Configure firewall rules and SSL settings for database access.
• Store secrets in Azure Key Vault and link to backend.
4. Backend Development
• Initialize Node.js project in backend/ and install dependencies.
• Create Express server and configure environment variables.
• Implement authentication (JWT, bcrypt) and RBAC.
• Build APIs for service catalog, feedback, chatbot, and document uploads.
• Connect to PostgreSQL and Cosmos DB.
5. Frontend Development
• Initialize React project in frontend/.
• Build citizen portal: homepage, service catalog, application form, dashboard.
• Build admin portal: service management, analytics, feedback routing.
• Build government and partner portals.
• Integrate multilingual support (Amharic, Oromo, English).
6. AI Chatbot Integration
• Set up Python environment in ai-chatbot/.
• Integrate GPT-4 and Amharic-BERT for multilingual NLP.
• Implement RAG using Azure AI Search and service metadata.
• Enable personalized checklists and feedback loop.
• Log interactions in Cosmos DB.
7. Testing & QA
• Write unit and integration tests for backend and frontend.
• Test API endpoints using REST Client or Postman.
• Conduct user acceptance testing (UAT).
• Validate chatbot accuracy and multilingual responses.
8. Deployment & Monitoring
• Configure GitHub Actions for CI/CD pipelines.
• Deploy backend and frontend to Azure App Service.
• Set up Application Insights and Log Analytics.
• Enable cost alerts and auto-scaling policies.
9. Documentation & Onboarding
• Maintain README.md with setup and contribution guidelines.
• Create developer onboarding guide and checklist.
• Document API endpoints using Swagger.
• Track progress using GitHub project board and changelog.
---

## Development Deployment Plan

Ethiopian Navigator MVP – Full Development & Deployment Plan
Phase 1: Planning & Setup
Define product scope, user roles, workflows, and success metrics. Select the base template (azure-search-openai-demo) and set up GitHub repository and VS Code development environment.
Phase 2: Azure Infrastructure Provisioning
Provision required Azure services using PowerShell or Azure CLI scripts:
- Resource Group: ethiopian-navigator-rg
- PostgreSQL Flexible Server
- Cosmos DB (MongoDB API)
- Blob Storage
- Azure AI Search
- Azure OpenAI
- Azure Key Vault
- App Service & Application Insights
Configure firewall rules, SSL, and store secrets securely in Key Vault.
Phase 3: Backend Development
Build REST APIs using Node.js and Express.js:
- Authentication & RBAC
- Service catalog
- Service requests
- Feedback
- Chatbot queries
Integrate PostgreSQL and Cosmos DB. Secure APIs using JWT and Key Vault.
Phase 4: Frontend Development
Develop React.js frontend for:
- Citizens
- Admins
- Government Employees
- Partners
Implement multilingual support (Amharic, Oromo, English), accessibility (WCAG 2.1 AA), and Ethiopian branding.
Phase 5: AI Chatbot Integration
Customize chatbot using GPT-4 and Amharic-BERT. Enable Retrieval-Augmented Generation (RAG) with Azure AI Search. Store logs and training data in Cosmos DB. Provide personalized checklists and escalation to human support.
Phase 6: Testing & QA
Validate functionality, performance, and security using:
- Unit and integration tests
- User Acceptance Testing (UAT)
- Performance testing
- Chatbot accuracy validation
Tools: Jest, Mocha, Chai, Postman, REST Client, Azure Load Testing.
Phase 7: CI/CD & Deployment
Automate build, test, and deployment using GitHub Actions. Configure workflows to deploy to Azure App Service. Integrate Key Vault for secrets management. Include rollback strategy and multi-environment support.
Phase 8: Monitoring & Go-Live
Monitor system health and usage using Azure Application Insights, Log Analytics, and Traffic Manager. Execute go-live checklist and ensure stakeholder communication and support readiness.
Phase 9: Documentation & Handover
Prepare and maintain:
- README.md
- Developer onboarding guide
- Technical blueprint
- Low-Level Design (LLD)
- Secure secrets guide
- CI/CD guide
- Deployment checklist
- Project proposal and Terms of Reference (ToR)
---

## Deployment Checklist

Ethiopian Navigator MVP - Development & Deployment Checklist
1. Planning & Requirements
☑ Define product vision and success metrics
☑ Finalize user personas and workflows
☑ Select Azure OpenAI template for customization
☑ Prepare product design specification document
2. Environment Setup
☑ Set up GitHub repository and folder structure
☑ Configure Visual Studio Code with required extensions
☑ Install Node.js, Python, PostgreSQL client
☑ Configure .env files and secrets
3. Azure Resource Provisioning
☑ Create Azure Resource Group
☑ Provision PostgreSQL Flexible Server
☑ Set up Cosmos DB, Blob Storage, Key Vault
☑ Configure Azure AI Search and OpenAI resources
4. Backend Development
☑ Initialize Express.js server
☑ Implement authentication and RBAC
☐ Build service catalog APIs
☐ Integrate PostgreSQL and Cosmos DB
☐ Set up feedback and chatbot endpoints
5. Frontend Development
☐ Build React components for citizen portal
☐ Build admin and government portals
☐ Integrate multilingual support
☐ Apply Ethiopian branding and accessibility features
6. AI Chatbot Integration
☐ Extend GPT-4 with Amharic-BERT
☐ Configure RAG with Azure AI Search
☐ Train chatbot with service metadata and FAQs
☐ Implement feedback loop and escalation
7. Testing & QA
☐ Write unit and integration tests
☐ Conduct UAT and performance testing
☐ Validate chatbot accuracy and service flow
8. Deployment & Monitoring
☐ Set up CI/CD with GitHub Actions
☐ Configure Application Insights and Log Analytics
☐ Enable cost alerts and auto-scaling policies
9. Documentation & Onboarding
☑ Prepare README and onboarding guide
☑ Create technical blueprint and LLD document
☐ Maintain changelog and versioning
☐ Document API endpoints with Swagger
---

## Deployment Checklist Enhanced

Ethiopian Navigator MVP - Development & Deployment Checklist
1. Planning & Requirements
☑ Define product vision and success metrics
☑ Finalize user personas and workflows
☑ Select Azure OpenAI template for customization
☑ Prepare product design specification document
2. Environment Setup
☑ Set up GitHub repository and folder structure
☑ Configure Visual Studio Code with required extensions
☑ Install Node.js, Python, PostgreSQL client
☑ Configure .env files and secrets
3. Azure Resource Provisioning
☑ Create Azure Resource Group
☑ Provision PostgreSQL Flexible Server
☑ Set up Cosmos DB, Blob Storage, Key Vault
☑ Configure Azure AI Search and OpenAI resources
4. Backend Development
☑ Initialize Express.js server
☑ Implement authentication and RBAC
☐ Build service catalog APIs
☐ Integrate PostgreSQL and Cosmos DB
☐ Set up feedback and chatbot endpoints
5. Frontend Development
☐ Build React components for citizen portal
☐ Build admin and government portals
☐ Integrate multilingual support
☐ Apply Ethiopian branding and accessibility features
6. AI Chatbot Integration
☐ Extend GPT-4 with Amharic-BERT
☐ Configure RAG with Azure AI Search
☐ Train chatbot with service metadata and FAQs
☐ Implement feedback loop and escalation
7. Testing & QA
☐ Write unit and integration tests
☐ Conduct UAT and performance testing
☐ Validate chatbot accuracy and service flow
8. Deployment & Monitoring
☐ Set up CI/CD with GitHub Actions
☐ Configure Application Insights and Log Analytics
☐ Enable cost alerts and auto-scaling policies
9. Documentation & Onboarding
☑ Prepare README and onboarding guide
☑ Create technical blueprint and LLD document
☐ Maintain changelog and versioning
☐ Document API endpoints with Swagger
---

## Technical Log Documentation

Ethiopian Navigator MVP - Technical Log Documentation
1. Completed Work Logs
2024-04-25: Forked azure-search-openai-demo into GitHub repository.
2024-04-25: Created initial project folder structure in VS Code.
2024-04-25: Initialized backend with Express and installed dependencies.
2024-04-25: Created server.js and verified API endpoint locally.
2024-04-25: Created .env, db.js, and auth.js files for backend.
2024-04-25: Connected to Azure PostgreSQL Flexible Server via VS Code.
2024-04-25: Created users table and tested registration/login endpoints.
2. Code Snippets Used
server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Ethiopian Navigator API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

db.js

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;

auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (email, password, role) VALUES ($1, $2, $3)',
      [email, hashedPassword, role]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

3. Configuration Details

.env file:
PORT=5000
DATABASE_URL=postgresql://Enavadmin@ethionav-postgres-server.postgres.database.azure.com/postgres?sslmode=require
JWT_SECRET=your_jwt_secret_key

Azure Resources:
- Resource Group: ethiopian-navigator-rg
- PostgreSQL Server: ethionav-postgres-server
- Database: postgres
- Web App: ethionav-backend
- Storage Account, Key Vault, Application Insights: provisioned

4. Passwords and Secrets
Passwords and secrets are stored securely in Azure Key Vault and are not exposed in this document.
5. Remaining Work Items
☐ Build service catalog APIs and connect to PostgreSQL
☐ Develop React frontend for citizen and admin portals
☐ Integrate AI chatbot with GPT-4 and Amharic-BERT
☐ Configure CI/CD pipelines using GitHub Actions
☐ Set up Application Insights and Log Analytics
☐ Conduct testing and QA
☐ Prepare deployment scripts and go-live checklist
---

## Azure Resource Blueprint

Azure Resource Setup Blueprint for Ethiopian Navigator MVP
This blueprint provides a step-by-step guide for provisioning and configuring Azure resources required for the Ethiopian Navigator MVP. It includes PowerShell scripts, configuration instructions, and best practices for deploying core services such as PostgreSQL, Cosmos DB, Blob Storage, Azure AI Search, Key Vault, App Service, and Application Insights.
1. Prerequisites
- Azure subscription with sufficient quota
- Azure PowerShell module installed
- Admin access to create and manage resources
- Visual Studio Code with Azure extensions (optional)
2. Provision Resource Group
Use the following PowerShell script to create a resource group:
$location = 'Central US'
$resourceGroupName = 'ethiopian-navigator-rg'
New-AzResourceGroup -Name $resourceGroupName -Location $location
3. Provision PostgreSQL Flexible Server
PowerShell script to create a PostgreSQL server:
$serverName = 'ethionav-postgres-server'
$adminUser = 'Enavadmin'
$adminPassword = 'YourSecurePassword123!'
New-AzPostgreSqlFlexibleServer -ResourceGroupName $resourceGroupName -Name $serverName -Location $location -AdministratorLogin $adminUser -AdministratorLoginPassword (ConvertTo-SecureString $adminPassword -AsPlainText -Force) -SkuName 'Standard_B1ms' -StorageSizeInGB 32 -Version '13'
4. Provision Cosmos DB (MongoDB API)
PowerShell script to create a Cosmos DB account:
$cosmosName = 'ethionav-cosmosdb'
New-AzCosmosDBAccount -ResourceGroupName $resourceGroupName -Name $cosmosName -Location $location -Kind MongoDB -DefaultConsistencyLevel 'Session' -EnableAutomaticFailover $true
5. Provision Azure Blob Storage
PowerShell script to create a storage account:
$storageName = 'ethionavstorage'
New-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageName -Location $location -SkuName 'Standard_LRS' -Kind 'StorageV2'
6. Provision Azure AI Search
PowerShell script to create a search service:
$searchName = 'ethionav-search'
New-AzSearchService -ResourceGroupName $resourceGroupName -Name $searchName -Location $location -Sku 'Basic'
7. Provision Azure Key Vault
PowerShell script to create a Key Vault:
$keyVaultName = 'ethionav-keyvault'
New-AzKeyVault -Name $keyVaultName -ResourceGroupName $resourceGroupName -Location $location
8. Provision App Service and App Plan
PowerShell script to create an App Service Plan and Web App:
$appPlanName = 'ethionav-appplan'
$webAppName = 'ethionav-backend'
New-AzAppServicePlan -Name $appPlanName -Location $location -ResourceGroupName $resourceGroupName -Tier 'Basic' -NumberofWorkers 1
New-AzWebApp -Name $webAppName -Location $location -AppServicePlan $appPlanName -ResourceGroupName $resourceGroupName
9. Provision Application Insights
PowerShell script to create Application Insights:
$appInsightsName = 'ethionav-insights'
New-AzApplicationInsights -ResourceGroupName $resourceGroupName -Name $appInsightsName -Location $location -Kind 'web'
10. Best Practices
- Use secure passwords and store them in Azure Key Vault
- Enable diagnostic logging for all services
- Use tags for resource management and cost tracking
- Set up role-based access control (RBAC)
- Monitor usage and set up alerts for cost and performance
---

## Azure Resource Blueprint Updated

Azure Resource Setup Blueprint for Ethiopian Navigator MVP
This blueprint provides a step-by-step guide for provisioning and configuring Azure resources required for the Ethiopian Navigator MVP. It includes PowerShell scripts, configuration instructions, and best practices for deploying core services such as PostgreSQL, Cosmos DB, Blob Storage, Azure AI Search, Key Vault, App Service, and Application Insights.
1. Prerequisites
- Azure subscription with sufficient quota
- Azure PowerShell module installed
- Admin access to create and manage resources
- Visual Studio Code with Azure extensions (optional)
2. Provision Resource Group
Use the following PowerShell script to create a resource group:
$location = 'Central US'
$resourceGroupName = 'ethiopian-navigator-rg'
New-AzResourceGroup -Name $resourceGroupName -Location $location
3. Provision PostgreSQL Flexible Server
PowerShell script to create a PostgreSQL server:
$serverName = 'ethionav-postgres-server'
$adminUser = 'Enavadmin'
$adminPassword = 'YourSecurePassword123!'
New-AzPostgreSqlFlexibleServer -ResourceGroupName $resourceGroupName -Name $serverName -Location $location -AdministratorLogin $adminUser -AdministratorLoginPassword (ConvertTo-SecureString $adminPassword -AsPlainText -Force) -SkuName 'Standard_B1ms' -StorageSizeInGB 32 -Version '13'
4. Provision Cosmos DB (MongoDB API)
PowerShell script to create a Cosmos DB account:
$cosmosName = 'ethionav-cosmosdb'
New-AzCosmosDBAccount -ResourceGroupName $resourceGroupName -Name $cosmosName -Location $location -Kind MongoDB -DefaultConsistencyLevel 'Session' -EnableAutomaticFailover $true
5. Provision Azure Blob Storage
PowerShell script to create a storage account:
$storageName = 'ethionavstorage'
New-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageName -Location $location -SkuName 'Standard_LRS' -Kind 'StorageV2'
6. Provision Azure AI Search
PowerShell script to create a search service:
$searchName = 'ethionav-search'
New-AzSearchService -ResourceGroupName $resourceGroupName -Name $searchName -Location $location -Sku 'Basic'
7. Provision Azure Key Vault
PowerShell script to create a Key Vault:
$keyVaultName = 'ethionav-keyvault'
New-AzKeyVault -Name $keyVaultName -ResourceGroupName $resourceGroupName -Location $location
8. Provision App Service and App Plan
PowerShell script to create an App Service Plan and Web App:
$appPlanName = 'ethionav-appplan'
$webAppName = 'ethionav-backend'
New-AzAppServicePlan -Name $appPlanName -Location $location -ResourceGroupName $resourceGroupName -Tier 'Basic' -NumberofWorkers 1
New-AzWebApp -Name $webAppName -Location $location -AppServicePlan $appPlanName -ResourceGroupName $resourceGroupName
9. Provision Application Insights
PowerShell script to create Application Insights:
$appInsightsName = 'ethionav-insights'
New-AzApplicationInsights -ResourceGroupName $resourceGroupName -Name $appInsightsName -Location $location -Kind 'web'
10. Best Practices
- Use secure passwords and store them in Azure Key Vault
- Enable diagnostic logging for all services
- Use tags for resource management and cost tracking
- Set up role-based access control (RBAC)
- Monitor usage and set up alerts for cost and performance
Sample PowerShell Scripts for Azure Resource Provisioning

# Create Resource Group
New-AzResourceGroup -Name "ethiopian-navigator-rg" -Location "Central US"

# Create PostgreSQL Flexible Server
New-AzPostgreSqlFlexibleServer -ResourceGroupName "ethiopian-navigator-rg" `
  -Name "ethionav-postgres-server" `
  -Location "Central US" `
  -SkuName "Standard_B1ms" `
  -StorageSizeInGB 32 `
  -AdministratorLogin "Enavadmin" `
  -AdministratorLoginPassword (ConvertTo-SecureString "YourSecurePassword123!" -AsPlainText -Force)

# Create Cosmos DB Account
New-AzCosmosDBAccount -ResourceGroupName "ethiopian-navigator-rg" `
  -Name "ethionav-cosmosdb" `
  -Location "Central US" `
  -Kind MongoDB `
  -DefaultConsistencyLevel "Session"

# Create Storage Account
New-AzStorageAccount -ResourceGroupName "ethiopian-navigator-rg" `
  -Name "ethionavstorage" `
  -Location "Central US" `
  -SkuName "Standard_LRS" `
  -Kind "StorageV2"

# Create Azure AI Search
New-AzSearchService -ResourceGroupName "ethiopian-navigator-rg" `
  -Name "ethionav-search" `
  -Location "Central US" `
  -Sku "standard"

# Create Key Vault
New-AzKeyVault -ResourceGroupName "ethiopian-navigator-rg" `
  -VaultName "ethionav-keyvault" `
  -Location "Central US"

# Create App Service Plan and Web App
New-AzAppServicePlan -Name "ethionav-plan" -Location "Central US" `
  -ResourceGroupName "ethiopian-navigator-rg" -Tier "Basic" -NumberofWorkers 1

New-AzWebApp -Name "ethionav-backend" -Location "Central US" `
  -AppServicePlan "ethionav-plan" -ResourceGroupName "ethiopian-navigator-rg"

Troubleshooting Guide for Azure Resource Setup
Permission Errors
Ensure you are logged in with an account that has Contributor or Owner role on the subscription. Use `Connect-AzAccount` to authenticate.
Resource Quota Limits
Check your subscription limits for resources like cores, storage, and IP addresses. Use `Get-AzSubscription` and `Get-AzVMUsage` to inspect quotas.
Connectivity Problems
Verify your local IP is added to the firewall rules for services like PostgreSQL and Cosmos DB. Use `New-AzPostgreSqlFlexibleServerFirewallRule` to add access.
SSL Connection Issues
Ensure SSL is enabled when connecting to Azure PostgreSQL. Use `sslmode=require` in connection strings.
Name Conflicts
Resource names must be globally unique. Append a random suffix or use a naming convention to avoid conflicts.
Region Availability
Ensure the selected region supports the desired resource type. Use `Get-AzLocation` to list available regions and services.
---

## Secrets Management Guide

Secure Secrets Management Guide for Ethiopian Navigator MVP
1. Overview of Secrets and Sensitive Data
Secrets and sensitive data include API keys, database credentials, encryption keys, access tokens, and configuration values. Proper management of these secrets is critical to ensure the security and integrity of the Ethiopian Navigator MVP system.
2. Azure Key Vault Setup and Usage
Azure Key Vault is used to securely store and manage secrets, keys, and certificates. To set up Azure Key Vault:
1. Create a Key Vault resource in the Azure portal.
2. Assign access policies to allow applications and users to retrieve secrets.
3. Use the Azure CLI or portal to add secrets (e.g., database connection strings, API keys).
4. Integrate Key Vault with your applications using SDKs or environment variables.
3. Best Practices for Storing and Accessing Secrets
• Never hard-code secrets in source code.
• Use environment variables or secure configuration files.
• Limit access to secrets using RBAC and access policies.
• Use managed identities to access Key Vault from Azure services.
• Encrypt secrets at rest and in transit.
4. Integration with Backend and CI/CD Pipelines
• Use Azure Managed Identity to allow backend services to access Key Vault without storing credentials.
• In CI/CD pipelines (e.g., GitHub Actions), use secure secrets storage and inject secrets at runtime.
• Avoid logging secrets in build or deployment logs.
• Use Key Vault references in App Service configuration settings.
5. Rotation and Auditing Strategies
• Rotate secrets periodically to reduce risk.
• Use automation scripts to rotate secrets and update dependent services.
• Enable Key Vault logging and diagnostics to monitor access and changes.
• Review access policies regularly and remove unused secrets.
6. Common Mistakes to Avoid
• Storing secrets in source code or public repositories.
• Using weak or default credentials.
• Granting excessive permissions to applications or users.
• Failing to rotate secrets or monitor access.
• Ignoring audit logs and alerts.
---

## Secrets Management Guide Updated

Secure Secrets Management Guide for Ethiopian Navigator MVP
1. Overview of Secrets and Sensitive Data
Secrets and sensitive data include API keys, database credentials, encryption keys, access tokens, and configuration values. Proper management of these secrets is critical to ensure the security and integrity of the Ethiopian Navigator MVP system.
2. Azure Key Vault Setup and Usage
Azure Key Vault is used to securely store and manage secrets, keys, and certificates. To set up Azure Key Vault:
1. Create a Key Vault resource in the Azure portal.
2. Assign access policies to allow applications and users to retrieve secrets.
3. Use the Azure CLI or portal to add secrets (e.g., database connection strings, API keys).
4. Integrate Key Vault with your applications using SDKs or environment variables.
3. Best Practices for Storing and Accessing Secrets
• Never hard-code secrets in source code.
• Use environment variables or secure configuration files.
• Limit access to secrets using RBAC and access policies.
• Use managed identities to access Key Vault from Azure services.
• Encrypt secrets at rest and in transit.
4. Integration with Backend and CI/CD Pipelines
• Use Azure Managed Identity to allow backend services to access Key Vault without storing credentials.
• In CI/CD pipelines (e.g., GitHub Actions), use secure secrets storage and inject secrets at runtime.
• Avoid logging secrets in build or deployment logs.
• Use Key Vault references in App Service configuration settings.
5. Rotation and Auditing Strategies
• Rotate secrets periodically to reduce risk.
• Use automation scripts to rotate secrets and update dependent services.
• Enable Key Vault logging and diagnostics to monitor access and changes.
• Review access policies regularly and remove unused secrets.
6. Common Mistakes to Avoid
• Storing secrets in source code or public repositories.
• Using weak or default credentials.
• Granting excessive permissions to applications or users.
• Failing to rotate secrets or monitor access.
• Ignoring audit logs and alerts.
Step-by-Step Azure Key Vault Setup
This section provides detailed instructions for setting up Azure Key Vault using both Azure CLI and PowerShell.
1. Create a Resource Group (if not already created):
   - Azure CLI:
     az group create --name ethiopian-navigator-rg --location "Central US"
   - PowerShell:
     New-AzResourceGroup -Name "ethiopian-navigator-rg" -Location "Central US"
2. Create a Key Vault:
   - Azure CLI:
     az keyvault create --name "ethionav-keyvault" --resource-group "ethiopian-navigator-rg" --location "Central US"
   - PowerShell:
     New-AzKeyVault -Name "ethionav-keyvault" -ResourceGroupName "ethiopian-navigator-rg" -Location "Central US"
3. Add a secret to the Key Vault:
   - Azure CLI:
     az keyvault secret set --vault-name "ethionav-keyvault" --name "DbPassword" --value "YourSecurePassword123!"
   - PowerShell:
     Set-AzKeyVaultSecret -VaultName "ethionav-keyvault" -Name "DbPassword" -SecretValue (ConvertTo-SecureString "YourSecurePassword123!" -AsPlainText -Force)
4. Retrieve a secret from the Key Vault:
   - Azure CLI:
     az keyvault secret show --vault-name "ethionav-keyvault" --name "DbPassword"
   - PowerShell:
     Get-AzKeyVaultSecret -VaultName "ethionav-keyvault" -Name "DbPassword"
5. Integrate Key Vault with your application using environment variables or SDKs to securely access secrets during runtime.
Ensure that your application has appropriate access policies configured in Azure Key Vault to retrieve secrets securely.
---

## Ci Cd Guide

Ethiopian Navigator MVP - CI/CD Pipeline Configuration Guide
This guide outlines the CI/CD pipeline configuration for the Ethiopian Navigator MVP project. It includes setup instructions for GitHub Actions, environment variable management, deployment to Azure App Service, integration with Azure Key Vault, and best practices for secure and automated deployment.
1. Prerequisites
- GitHub repository for the project
- Azure App Service and Resource Group provisioned
- Azure Key Vault with secrets configured
- Azure credentials stored securely (Service Principal or OIDC)
- Node.js and Python environments configured for backend and chatbot
2. GitHub Actions Setup
Create a `.github/workflows/deploy.yml` file in your repository with the following content:
name: Deploy to Azure

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.10'

    - name: Install backend dependencies
      run: |
        cd backend
        npm install

    - name: Install chatbot dependencies
      run: |
        cd ai-chatbot
        pip install -r requirements.txt

    - name: Azure Login
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}

    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'ethionav-backend'
        slot-name: 'production'
        package: backend/

3. Environment Variable Management
Use Azure Key Vault to store sensitive environment variables such as database connection strings, API keys, and JWT secrets. Access these secrets in your application using Azure SDKs or environment injection during deployment.
4. Azure Key Vault Integration
Ensure your App Service has access to Key Vault by assigning a managed identity. Use the following Python snippet to retrieve secrets:
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

key_vault_url = "https://<your-keyvault-name>.vault.azure.net/"
credential = DefaultAzureCredential()
client = SecretClient(vault_url=key_vault_url, credential=credential)

secret = client.get_secret("DATABASE_URL")
print(secret.value)

5. Best Practices
- Use separate environments for development, staging, and production
- Rotate secrets regularly and audit access logs
- Use GitHub environments and secrets for secure configuration
- Monitor deployments using Azure Application Insights
- Automate rollback on failure using deployment slots
---

## Developer Onboarding Guide

Ethiopian Navigator MVP - Developer Onboarding Guide
1. Project Introduction
The Ethiopian Navigator MVP is a multilingual, citizen-centric government service portal built on Azure. It leverages Azure OpenAI, AI Search, and a microservices architecture to deliver transparent and efficient G2C services. This guide helps new developers onboard quickly and contribute effectively to the project.
2. Prerequisites and Tools
- Git and GitHub account
- Visual Studio Code (VS Code)
- Node.js and npm
- Python 3.10+
- PostgreSQL client (e.g., DBeaver)
- Azure CLI
- REST Client extension for VS Code (optional)
3. Repository Structure
The repository is organized as follows:
- frontend/: React.js frontend for citizen, admin, and government portals
- backend/: Node.js backend APIs for authentication, service catalog, feedback, and chatbot
- ai-chatbot/: Python-based AI chatbot using GPT-4 and Amharic-BERT
- infrastructure/: Azure provisioning scripts and IaC templates
- docs/: Product design, workflows, and architecture documentation
- onboarding/: Developer onboarding guides and checklists
4. Environment Setup Instructions
1. Clone the repository:
   git clone https://github.com/Amireducation/ethiopian-navigator-mvpv1.git
2. Navigate to the backend folder and initialize:
   cd backend
   npm install
3. Create a .env file with required environment variables:
   PORT=5000
   DATABASE_URL=<your_postgres_connection_string>
   JWT_SECRET=<your_jwt_secret>
4. Repeat similar setup for frontend and ai-chatbot folders.
5. Running the Backend and Frontend
To run the backend:
   cd backend
   node server.js

To run the frontend:
   cd frontend
   npm install
   npm start
6. API Testing
Use Postman or the REST Client extension in VS Code to test API endpoints.
Example endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/services
7. Azure Integration Overview
The project uses the following Azure resources:
- Azure PostgreSQL Flexible Server
- Azure Cosmos DB (MongoDB API)
- Azure App Service
- Azure Blob Storage
- Azure OpenAI and AI Search
- Azure Key Vault
- Azure Application Insights
Ensure your IP is whitelisted in the PostgreSQL firewall settings and secrets are stored securely in Key Vault.
8. Contribution Guidelines
- Use feature branches for new work
- Submit pull requests with clear descriptions
- Follow coding standards and naming conventions
- Document changes in the changelog
- Update README and onboarding guides as needed
9. Support and Contacts
For technical support, contact the lead developer or project owner.
Use GitHub Issues to report bugs or request features.
Refer to the docs/ folder for architecture diagrams and product specifications.
---

## Developer Onboarding Guide Updated

Ethiopian Navigator MVP - Developer Onboarding Guide
1. Project Introduction
The Ethiopian Navigator MVP is a multilingual, citizen-centric government service portal built on Azure. It leverages Azure OpenAI, AI Search, and a microservices architecture to deliver transparent and efficient G2C services. This guide helps new developers onboard quickly and contribute effectively to the project.
2. Prerequisites and Tools
- Git and GitHub account
- Visual Studio Code (VS Code)
- Node.js and npm
- Python 3.10+
- PostgreSQL client (e.g., DBeaver)
- Azure CLI
- REST Client extension for VS Code (optional)
3. Repository Structure
The repository is organized as follows:
- frontend/: React.js frontend for citizen, admin, and government portals
- backend/: Node.js backend APIs for authentication, service catalog, feedback, and chatbot
- ai-chatbot/: Python-based AI chatbot using GPT-4 and Amharic-BERT
- infrastructure/: Azure provisioning scripts and IaC templates
- docs/: Product design, workflows, and architecture documentation
- onboarding/: Developer onboarding guides and checklists
4. Environment Setup Instructions
1. Clone the repository:
   git clone https://github.com/Amireducation/ethiopian-navigator-mvpv1.git
2. Navigate to the backend folder and initialize:
   cd backend
   npm install
3. Create a .env file with required environment variables:
   PORT=5000
   DATABASE_URL=<your_postgres_connection_string>
   JWT_SECRET=<your_jwt_secret>
4. Repeat similar setup for frontend and ai-chatbot folders.
5. Running the Backend and Frontend
To run the backend:
   cd backend
   node server.js

To run the frontend:
   cd frontend
   npm install
   npm start
6. API Testing
Use Postman or the REST Client extension in VS Code to test API endpoints.
Example endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/services
7. Azure Integration Overview
The project uses the following Azure resources:
- Azure PostgreSQL Flexible Server
- Azure Cosmos DB (MongoDB API)
- Azure App Service
- Azure Blob Storage
- Azure OpenAI and AI Search
- Azure Key Vault
- Azure Application Insights
Ensure your IP is whitelisted in the PostgreSQL firewall settings and secrets are stored securely in Key Vault.
8. Contribution Guidelines
- Use feature branches for new work
- Submit pull requests with clear descriptions
- Follow coding standards and naming conventions
- Document changes in the changelog
- Update README and onboarding guides as needed
9. Support and Contacts
For technical support, contact the lead developer or project owner.
Use GitHub Issues to report bugs or request features.
Refer to the docs/ folder for architecture diagrams and product specifications.
Step-by-Step Setup Instructions
1. Clone the GitHub repository:
   git clone https://github.com/Amireducation/ethiopian-navigator-mvpv1.git
2. Open the project in Visual Studio Code.
3. Create the project folder structure:
   mkdir frontend backend ai-chatbot infrastructure docs onboarding
4. Navigate to the backend folder:
   cd backend
5. Initialize the Node.js project:
   npm init -y
6. Install backend dependencies:
   npm install express cors dotenv jsonwebtoken bcryptjs pg
7. Create a .env file in the backend folder with the following content:
   PORT=5000
   DATABASE_URL=your_postgres_connection_string
   JWT_SECRET=your_jwt_secret_key
8. Create server.js and define the Express server.
9. Create db.js to connect to PostgreSQL.
10. Create routes/auth.js for authentication endpoints.
11. Create the users table in PostgreSQL:
   CREATE TABLE users (id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password TEXT NOT NULL, role VARCHAR(50) NOT NULL);
12. Run the server:
   node server.js
13. Test the API endpoints using REST Client or Postman.
Troubleshooting Tips
❌ Error: 'npm.ps1 cannot be loaded because running scripts is disabled on this system'
✅ Fix: Open PowerShell as Administrator and run:
   Set-ExecutionPolicy RemoteSigned
❌ Error: 'connect ETIMEDOUT <IP>:5432'
✅ Fix: Ensure your Azure PostgreSQL server firewall allows your local IP address.
❌ Error: 'FATAL: no pg_hba.conf entry for host ... no encryption'
✅ Fix: Enable SSL in your database client (e.g., DBeaver) and set sslmode=require.
❌ Error: 'FATAL: password authentication failed for user'
✅ Fix: Double-check your username format and password. Use the format: username@server-name.
❌ Error: 'Cannot find module ./routes/auth'
✅ Fix: Ensure the auth.js file is inside a folder named 'routes' and the path is correct in server.js.
❌ API not responding
✅ Fix: Ensure the server is running on the correct port and that the endpoint URL is correct.
---

## Ethiopian Navigator Copilot Workflow

# Ethiopian Navigator MVP – Copilot-Driven Development Workflow

This document outlines a step-by-step development workflow for the Ethiopian Navigator MVP using GitHub Copilot, Azure Copilot, and Microsoft 365 Copilot.

---

## 🧭 Overview

| Phase | Description | Copilot Role |
|-------|-------------|--------------|
| Planning | Define scope, architecture, and user journeys | Microsoft 365 Copilot |
| Infrastructure | Provision Azure resources | Azure Copilot |
| Backend | Build APIs and database integration | GitHub Copilot |
| Frontend | Develop React UI components | GitHub Copilot |
| AI Chatbot | Integrate GPT-4 and Amharic-BERT | GitHub + Azure Copilot |
| CI/CD | Automate deployment pipelines | GitHub Copilot |
| Monitoring | Configure logging and alerts | Azure Copilot |
| Documentation | Maintain guides and specs | Microsoft 365 + GitHub Copilot |

---

## 🧱 1. Infrastructure Setup (Azure Copilot)

### Tasks:
- Provision Resource Group
- Create PostgreSQL Flexible Server
- Create Cosmos DB (MongoDB API)
- Create Blob Storage
- Create Azure AI Search
- Create Azure OpenAI resource
- Create Azure Key Vault
- Create App Service Plan and Web App
- Enable Application Insights

### Copilot Assistance:
- Azure Copilot generates Bicep/ARM templates
- Troubleshoots provisioning errors
- Suggests naming conventions and cost estimates

---

## 🔧 2. Backend Development (GitHub Copilot)

### Tasks:
- Initialize Node.js project
- Create `server.js` with Express setup
- Configure `.env` and connect to PostgreSQL
- Build authentication routes (`/api/auth`)
- Build service catalog routes (`/api/services`)
- Build feedback and request routes
- Integrate Cosmos DB for chatbot logs

### Copilot Assistance:
- Autocompletes route handlers and middleware
- Suggests secure JWT-based auth
- Generates SQL queries and error handling logic

---

## 🌐 3. Frontend Development (GitHub Copilot)

### Tasks:
- Initialize React project
- Create layout and routing structure
- Build Citizen Portal: homepage, service catalog, dashboard
- Build Admin Portal: service management, analytics
- Build Government & Partner Portals
- Add multilingual support (Amharic, Oromo, English)
- Integrate chatbot widget

### Copilot Assistance:
- Generates React components and hooks
- Suggests i18n setup and accessibility improvements
- Autocompletes form validation and API integration

---

## 🤖 4. AI Chatbot Integration (GitHub + Azure Copilot)

### Tasks:
- Set up Python chatbot service
- Integrate GPT-4 via Azure OpenAI
- Add Amharic-BERT for local language support
- Implement RAG using Azure AI Search
- Store logs in Cosmos DB
- Enable feedback loop for training

### Copilot Assistance:
- Generates Python scripts for NLP pipeline
- Suggests prompt engineering strategies
- Helps configure AI Search indexing

---

## 🚀 5. CI/CD Pipeline (GitHub Copilot)

### Tasks:
- Create GitHub Actions workflow (`deploy.yml`)
- Automate build, test, and deploy
- Integrate Azure Key Vault for secrets
- Set up staging and production environments

### Copilot Assistance:
- Generates CI/CD scripts
- Suggests environment variable management
- Troubleshoots deployment errors

---

## 📊 6. Monitoring & Logging (Azure Copilot)

### Tasks:
- Enable Application Insights
- Configure Log Analytics
- Set up alerts and dashboards

### Copilot Assistance:
- Suggests metrics to monitor
- Helps configure alerts and retention policies

---

## 📚 7. Documentation & Onboarding (Microsoft 365 + GitHub Copilot)

### Tasks:
- Create README.md and onboarding guide
- Maintain API documentation (Swagger)
- Track changes in changelog
- Prepare user manuals and training materials

### Copilot Assistance:
- Drafts documentation templates
- Summarizes code changes
- Generates onboarding checklists

---

## ✅ Final Notes

This workflow ensures rapid, secure, and scalable development of the Ethiopian Navigator MVP using Copilot tools across GitHub, Azure, and Microsoft 365.


---

## Ethiopian Navigator Copilot Integration Plan

# Ethiopian Navigator MVP – Microsoft Copilot Integration Plan

This document outlines a comprehensive plan to integrate Microsoft Copilot into the development, documentation, automation, deployment, and monitoring of the Ethiopian Navigator MVP.

---

## 🧠 Overview

Microsoft Copilot (GitHub Copilot, Azure Copilot, and Microsoft 365 Copilot) will assist in:

- Code generation and refactoring
- Infrastructure provisioning
- CI/CD pipeline automation
- Documentation and onboarding
- Monitoring and troubleshooting

---

## 🧱 1. Infrastructure Automation with Azure Copilot

### 🔹 Tasks:
- Provision Azure resources via Azure CLI or Bicep templates
- Configure networking, firewall rules, and SSL
- Store secrets in Azure Key Vault

### 🛠️ Copilot Usage:
- Ask Azure Copilot to generate Bicep templates for:
  - Resource Group
  - PostgreSQL Flexible Server
  - Cosmos DB
  - Blob Storage
  - Azure AI Search
  - Azure OpenAI
  - App Service Plan & Web App
  - Application Insights

### ✅ Example Prompt:
> "Generate a Bicep template to deploy a PostgreSQL Flexible Server with SSL enabled in Central US."

---

## 🧑‍💻 2. Backend Development with GitHub Copilot

### 🔹 Tasks:
- Build REST APIs for auth, service catalog, feedback, chatbot
- Connect to PostgreSQL and Cosmos DB
- Implement JWT-based authentication and RBAC

### 🛠️ Copilot Usage:
- Auto-generate Express.js routes and middleware
- Suggest SQL queries and schema definitions
- Refactor and optimize API logic

### ✅ Example Prompt:
> "Create an Express.js route for user registration with password hashing and PostgreSQL insert."

---

## 🌐 3. Frontend Development with GitHub Copilot

### 🔹 Tasks:
- Build React components for citizen, admin, government, and partner portals
- Integrate APIs and multilingual support
- Apply Ethiopian branding and accessibility standards

### 🛠️ Copilot Usage:
- Generate React components and hooks
- Suggest i18n integration and responsive layouts
- Refactor JSX and CSS for performance

### ✅ Example Prompt:
> "Create a React component for a multilingual service catalog with search and filter options."

---

## 🤖 4. AI Chatbot Development with GitHub Copilot

### 🔹 Tasks:
- Build Python-based chatbot using GPT-4 and Amharic-BERT
- Integrate Azure AI Search for RAG
- Log queries and feedback in Cosmos DB

### 🛠️ Copilot Usage:
- Generate Python scripts for NLP pipelines
- Suggest prompt engineering strategies
- Refactor chatbot logic and error handling

### ✅ Example Prompt:
> "Create a Python function that uses Azure OpenAI to answer questions based on indexed documents."

---

## 📄 5. Documentation with Microsoft 365 Copilot

### 🔹 Tasks:
- Draft README files, onboarding guides, API docs
- Maintain changelogs and versioning
- Generate proposals, ToRs, and reports

### 🛠️ Copilot Usage:
- Use Word Copilot to summarize meetings and generate specs
- Use Excel Copilot to track progress and budgets
- Use Teams Copilot to manage tasks and updates

### ✅ Example Prompt:
> "Summarize the development progress and generate a changelog for the last sprint."

---

## 🚀 6. CI/CD Pipeline Setup with GitHub Copilot

### 🔹 Tasks:
- Configure GitHub Actions workflows
- Automate build, test, and deployment
- Integrate secrets from Azure Key Vault

### 🛠️ Copilot Usage:
- Generate `deploy.yml` files
- Suggest environment variable management
- Refactor pipeline steps for efficiency

### ✅ Example Prompt:
> "Create a GitHub Actions workflow to deploy a Node.js app to Azure App Service using secrets from Key Vault."

---

## 📊 7. Monitoring & Logging with Azure Copilot

### 🔹 Tasks:
- Set up Application Insights and Log Analytics
- Configure alerts and dashboards
- Monitor performance and errors

### 🛠️ Copilot Usage:
- Generate KQL queries for log analysis
- Suggest alert rules and metrics
- Automate dashboard creation

### ✅ Example Prompt:
> "Create a KQL query to monitor failed login attempts in the Ethiopian Navigator backend."

---

## 📚 8. Developer Onboarding & Handover

### 🔹 Tasks:
- Create onboarding guides and checklists
- Document architecture and workflows
- Maintain technical logs and secrets management

### 🛠️ Copilot Usage:
- Auto-generate Markdown files for onboarding
- Suggest folder structures and naming conventions
- Draft secure secrets management guides

---

## ✅ Summary

| Phase | Copilot Role |
|-------|--------------|
| Infrastructure | Azure Copilot for provisioning and security |
| Backend | GitHub Copilot for API generation and DB integration |
| Frontend | GitHub Copilot for React components and UI logic |
| AI Chatbot | GitHub Copilot for NLP and RAG integration |
| CI/CD | GitHub Copilot for workflow automation |
| Monitoring | Azure Copilot for insights and alerts |
| Documentation | Microsoft 365 Copilot for specs and reports |

---

## 📌 Next Steps

- Enable GitHub Copilot in VS Code
- Use Azure Copilot in Azure Portal
- Use Microsoft 365 Copilot in Word, Excel, and Teams
- Follow this workflow for consistent development and deployment


---

## Ethiopian Navigator Copilot Development Guide

# Ethiopian Navigator MVP – Microsoft Copilot Development Guide

## 📘 Overview

This guide provides a step-by-step walkthrough for using **Microsoft Copilot tools** to develop, deploy, and maintain the Ethiopian Navigator MVP. It covers GitHub Copilot, Azure Copilot, and Microsoft 365 Copilot across all phases of the project.

---

## 🧠 Copilot Tools Overview

| Tool | Purpose |
|------|--------|
| **GitHub Copilot** | Code generation, refactoring, documentation |
| **Azure Copilot** | Infrastructure provisioning, deployment, monitoring |
| **Microsoft 365 Copilot** | Planning, documentation, reporting, collaboration |

---

## 🧭 Step-by-Step Development Workflow

### 1. 📋 Planning & Documentation (Microsoft 365 Copilot)

- **Use Word Copilot** to draft:
  - Product Requirements Document (PRD)
  - Terms of Reference (ToR)
  - Product Design Specification (PDS)
- **Use Excel Copilot** to estimate:
  - Budget breakdown
  - Timeline and WBS
- **Use Teams Copilot** to:
  - Summarize meetings
  - Track decisions and action items

**Example Prompt**:
> “Draft a PRD for a multilingual government service portal with citizen, admin, and partner roles.”

---

### 2. 🏗️ Infrastructure Setup (Azure Copilot)

- Provision resources:
  - Resource Group
  - PostgreSQL Flexible Server
  - Cosmos DB (MongoDB API)
  - Blob Storage
  - Azure AI Search
  - Azure OpenAI
  - Azure Key Vault
  - App Service & Application Insights

**Use Azure Copilot to**:
- Generate Bicep or PowerShell scripts
- Configure firewall rules and SSL
- Set up monitoring and alerts

**Example Prompt**:
> “Create a Bicep template for a PostgreSQL Flexible Server with SSL enabled and firewall rules.”

---

### 3. 🔧 Backend Development (GitHub Copilot)

- Scaffold Express.js server
- Create REST APIs:
  - `/api/auth` – JWT-based authentication
  - `/api/services` – Service catalog
  - `/api/requests` – Application tracking
  - `/api/feedback` – Citizen feedback
  - `/api/chatbot` – AI chatbot queries

**Use GitHub Copilot to**:
- Generate routes and controllers
- Suggest SQL queries and error handling
- Integrate PostgreSQL and Cosmos DB

**Example Prompt**:
> “Create an Express route for user registration with password hashing and JWT token generation.”

---

### 4. 🌐 Frontend Development (GitHub Copilot)

- Build React.js portals for:
  - Citizens
  - Admins
  - Government Employees
  - Partners

**Use GitHub Copilot to**:
- Generate React components
- Add multilingual support (Amharic, Oromo, English)
- Connect frontend to backend APIs

**Example Prompt**:
> “Create a React component for a multilingual service catalog with search and filter options.”

---

### 5. 🤖 AI Chatbot Integration (GitHub + Azure Copilot)

- Build Python chatbot using:
  - GPT-4 (Azure OpenAI)
  - Amharic-BERT (Hugging Face)
- Enable RAG with Azure AI Search
- Store logs in Cosmos DB

**Use GitHub Copilot to**:
- Generate Python functions for NLP
- Integrate chatbot with backend

**Use Azure Copilot to**:
- Configure OpenAI and AI Search resources

**Example Prompt**:
> “Create a Python function that uses Azure OpenAI to answer questions from indexed documents.”

---

### 6. 🚀 CI/CD Automation (GitHub Copilot)

- Configure GitHub Actions workflows:
  - Build and test backend
  - Deploy to Azure App Service
  - Integrate secrets from Azure Key Vault

**Use GitHub Copilot to**:
- Generate `.github/workflows/deploy.yml`
- Automate deployment and rollback

**Example Prompt**:
> “Create a GitHub Actions workflow to deploy a Node.js app to Azure App Service with Key Vault secrets.”

---

### 7. 📊 Monitoring & Logging (Azure Copilot)

- Set up:
  - Application Insights
  - Log Analytics
  - Traffic Manager

**Use Azure Copilot to**:
- Create dashboards
- Configure alerts and KQL queries

**Example Prompt**:
> “Create a KQL query to monitor failed login attempts and alert if threshold exceeds.”

---

### 8. 📚 Documentation & Onboarding (GitHub + Microsoft 365 Copilot)

- Maintain:
  - README.md
  - Developer onboarding guide
  - API documentation (Swagger)
  - Changelog and versioning

**Use GitHub Copilot to**:
- Auto-generate documentation from code

**Use Word Copilot to**:
- Draft onboarding guides and manuals

**Example Prompt**:
> “Generate a README file for a Node.js backend with PostgreSQL and JWT authentication.”

---

## ✅ Best Practices

- Use descriptive prompts for Copilot
- Review and refactor generated code
- Store secrets securely in Azure Key Vault
- Maintain documentation in Markdown and Word
- Use version control and CI/CD for all environments

---

## 📌 Summary

Microsoft Copilot tools can accelerate every phase of Ethiopian Navigator development. By combining GitHub, Azure, and Microsoft 365 Copilot, you can streamline planning, coding, automation, and deployment with AI-powered assistance.


---

## Ethiopian Navigator Copilot Playbook

# Ethiopian Navigator MVP – Microsoft Copilot Playbook & Prompt Library

This playbook provides a comprehensive guide for using Microsoft Copilot tools to develop, deploy, and maintain the Ethiopian Navigator MVP. It includes categorized prompt examples, best practices, and workflow guidance for GitHub Copilot, Azure Copilot, and Microsoft 365 Copilot.

---

## 🧠 Overview of Copilot Tools

| Tool | Purpose |
|------|---------|
| **GitHub Copilot** | Code generation, refactoring, documentation |
| **Azure Copilot** | Infrastructure provisioning, deployment, monitoring |
| **Microsoft 365 Copilot** | Planning, documentation, reporting, collaboration |

---

## 🧪 GitHub Copilot

### ✅ Use Cases
- Backend API scaffolding (Node.js/Express)
- Frontend component generation (React.js)
- AI chatbot integration (Python)
- Writing tests and documentation

### 💬 Prompt Examples
- "Create an Express route for user registration with password hashing"
- "Generate a React component for multilingual service catalog"
- "Write a Python function to query Azure OpenAI with RAG"
- "Create unit tests for the login API using Jest"

### 🛠️ Best Practices
- Use descriptive comments to guide Copilot
- Break tasks into small functions
- Review and refactor Copilot suggestions
- Use Copilot Labs for code explanation and translation

---

## ☁️ Azure Copilot

### ✅ Use Cases
- Provision Azure resources (PostgreSQL, Cosmos DB, Blob Storage)
- Generate Bicep or ARM templates
- Configure monitoring and alerts
- Troubleshoot deployment issues

### 💬 Prompt Examples
- "Create a Bicep template for PostgreSQL Flexible Server with SSL"
- "Provision Azure AI Search and connect it to Blob Storage"
- "List all resources in resource group 'ethiopian-navigator-rg'"
- "Generate a cleanup script for unused resources"

### 🛠️ Best Practices
- Use consistent naming conventions
- Store secrets in Azure Key Vault
- Enable diagnostic settings and alerts
- Use deployment scripts for reproducibility

---

## 📄 Microsoft 365 Copilot

### ✅ Use Cases
- Draft PRD, ToR, PDS documents
- Summarize meetings and decisions
- Generate budget estimates and timelines
- Create onboarding and training materials

### 💬 Prompt Examples
- "Draft a Terms of Reference for Ethiopian Navigator MVP"
- "Summarize this Teams meeting and extract action items"
- "Create a Gantt chart for a 12-week development plan"
- "Generate a user manual for the citizen portal"

### 🛠️ Best Practices
- Use structured templates for consistency
- Collaborate via OneDrive and Teams
- Link documents to GitHub Wiki
- Use version history for tracking changes

---

## 🧭 Copilot-Driven Development Workflow

1. **Planning** – Use 365 Copilot to draft specs and proposals
2. **Infrastructure** – Use Azure Copilot to provision resources
3. **Backend** – Use GitHub Copilot to scaffold APIs and DB models
4. **Frontend** – Use GitHub Copilot to build React components
5. **AI Chatbot** – Use GitHub Copilot to integrate GPT-4 and RAG
6. **CI/CD** – Use GitHub Copilot to configure workflows
7. **Monitoring** – Use Azure Copilot to set up Application Insights
8. **Documentation** – Use 365 Copilot to generate guides and manuals

---

## 📌 Summary

Microsoft Copilot tools empower rapid, secure, and collaborative development of the Ethiopian Navigator MVP. By leveraging GitHub, Azure, and 365 Copilot together, teams can streamline coding, infrastructure, documentation, and deployment.


---

## Ethiopian Navigator Azure Architecture

# Ethiopian Navigator MVP – Azure Resource Architecture Plan

## 📘 Overview

This document outlines the recommended Azure resource architecture for the Ethiopian Navigator MVP. It includes service selection, configuration details, naming conventions, regions, security practices, and integration points.

---

## 📦 Recommended Azure Services

| Service | Purpose |
|--------|---------|
| **Resource Group** | Logical container for all resources |
| **PostgreSQL Flexible Server** | Structured data storage (users, services, requests) |
| **Cosmos DB (MongoDB API)** | Chatbot logs, unstructured data |
| **Azure Blob Storage** | Document uploads and file storage |
| **Azure AI Search** | Indexing and retrieval for service metadata and documents |
| **Azure OpenAI** | GPT-4-based chatbot and NLP |
| **Azure Key Vault** | Secure secrets and credentials |
| **App Service + App Service Plan** | Hosting backend and frontend apps |
| **Application Insights** | Monitoring and diagnostics |

---

## 🌍 Region

- **Primary Region**: `East US` or `Central US` (based on OpenAI availability and latency)
- **Resource Group Name**: `ethiopian-navigator-rg`

---

## 🛠️ Resource Configuration Details

### 1. **PostgreSQL Flexible Server**
- **Name**: `ethionav-postgres-server`
- **SKU**: `Standard_D2s_v3`
- **Version**: PostgreSQL 14
- **Storage**: 100 GB
- **Backup Retention**: 7 days
- **High Availability**: Zone-redundant (optional)
- **Firewall Rules**: Allow Dev IPs + App Service outbound IPs
- **SSL Enforcement**: Enabled

### 2. **Cosmos DB (MongoDB API)**
- **Name**: `ethionav-cosmosdb`
- **API**: MongoDB v4.2
- **Throughput**: Autoscale (400–4000 RU/s)
- **Database**: `chatbotdb`
- **Collections**: `chatlogs`, `feedback`, `trainingdata`

### 3. **Azure Blob Storage**
- **Name**: `ethionavstorage`
- **Containers**:
  - `uploads` – citizen documents
  - `service-assets` – icons, PDFs
- **Access Tier**: Hot
- **Public Access**: Disabled
- **CORS**: Enabled for frontend domain

### 4. **Azure AI Search**
- **Name**: `ethionav-search`
- **Pricing Tier**: Basic or Standard S1
- **Indexes**:
  - `services-index`
  - `documents-index`
- **Data Source**: Blob Storage + PostgreSQL

### 5. **Azure OpenAI**
- **Name**: `ethionav-openai`
- **Model Deployment**:
  - `gpt-35-turbo`
  - `text-embedding-ada-002`
- **Quota**: Request via Azure OpenAI application

### 6. **Azure Key Vault**
- **Name**: `ethionav-keyvault`
- **Secrets**:
  - `POSTGRES_CONN_STRING`
  - `COSMOSDB_CONN_STRING`
  - `OPENAI_API_KEY`
  - `JWT_SECRET`
- **Access Policies**: App Service, DevOps, Admins

### 7. **App Service + Plan**
- **Plan Name**: `ethionav-app-plan`
- **SKU**: `B1` or `P1v3` (for staging/production)
- **Web Apps**:
  - `ethionav-backend`
  - `ethionav-frontend`
- **Runtime**:
  - Backend: Node.js 18 LTS
  - Frontend: Static Web App or React build

### 8. **Application Insights**
- **Name**: `ethionav-insights`
- **Connected To**: App Service
- **Log Analytics Workspace**: `ethionav-logs`

---

## 🔐 Security Best Practices

- Use **Azure Key Vault** for all secrets
- Enable **SSL enforcement** on PostgreSQL and Cosmos DB
- Restrict **public access** to storage accounts
- Enable **Managed Identity** for App Services
- Use **RBAC** for resource access control
- Enable **Diagnostic Logs** and **Activity Logs**

---

## 🔗 Integration Points

| Component | Integrates With |
|-----------|-----------------|
| Backend (Node.js) | PostgreSQL, Cosmos DB, Key Vault, Blob Storage |
| Frontend (React) | Backend APIs, Blob Storage (via SAS tokens) |
| Chatbot (Python) | Azure OpenAI, AI Search, Cosmos DB |
| AI Search | Blob Storage (documents), PostgreSQL (metadata) |
| CI/CD | GitHub Actions → Azure App Service |
| Monitoring | Application Insights, Log Analytics |

---

## 📄 Naming Conventions

| Resource Type | Naming Pattern |
|---------------|----------------|
| Resource Group | `ethiopian-navigator-rg` |
| PostgreSQL Server | `ethionav-postgres-server` |
| Cosmos DB | `ethionav-cosmosdb` |
| Blob Storage | `ethionavstorage` |
| AI Search | `ethionav-search` |
| OpenAI | `ethionav-openai` |
| Key Vault | `ethionav-keyvault` |
| App Service Plan | `ethionav-app-plan` |
| Web App (Backend) | `ethionav-backend` |
| Web App (Frontend) | `ethionav-frontend` |
| App Insights | `ethionav-insights` |

---

## 📌 Next Steps

1. Review and approve architecture
2. Generate Bicep or PowerShell provisioning scripts
3. Audit existing resources
4. Clean up and rollback unused resources
5. Provision fresh setup using IaC
6. Integrate secrets and deploy backend/frontend

---

_Last updated: 2025-10-05 15:48 UTC_


---

## PDS_Technical_Design.md

_This referenced document is missing from the workspace._


---

# Ethiopian Navigator Azure Architecture

# Ethiopian Navigator MVP – Azure Resource Architecture Plan

## 📘 Overview

This document outlines the recommended Azure resource architecture for the Ethiopian Navigator MVP. It includes service selection, configuration details, naming conventions, regions, security practices, and integration points.

---

## 📦 Recommended Azure Services

| Service | Purpose |
|--------|---------|
| **Resource Group** | Logical container for all resources |
| **PostgreSQL Flexible Server** | Structured data storage (users, services, requests) |
| **Cosmos DB (MongoDB API)** | Chatbot logs, unstructured data |
| **Azure Blob Storage** | Document uploads and file storage |
| **Azure AI Search** | Indexing and retrieval for service metadata and documents |
| **Azure OpenAI** | GPT-4-based chatbot and NLP |
| **Azure Key Vault** | Secure secrets and credentials |
| **App Service + App Service Plan** | Hosting backend and frontend apps |
| **Application Insights** | Monitoring and diagnostics |

---

## 🌍 Region

- **Primary Region**: `East US` or `Central US` (based on OpenAI availability and latency)
- **Resource Group Name**: `ethiopian-navigator-rg`

---

## 🛠️ Resource Configuration Details

### 1. **PostgreSQL Flexible Server**
- **Name**: `ethionav-postgres-server`
- **SKU**: `Standard_D2s_v3`
- **Version**: PostgreSQL 14
- **Storage**: 100 GB
- **Backup Retention**: 7 days
- **High Availability**: Zone-redundant (optional)
- **Firewall Rules**: Allow Dev IPs + App Service outbound IPs
- **SSL Enforcement**: Enabled

### 2. **Cosmos DB (MongoDB API)**
- **Name**: `ethionav-cosmosdb`
- **API**: MongoDB v4.2
- **Throughput**: Autoscale (400–4000 RU/s)
- **Database**: `chatbotdb`
- **Collections**: `chatlogs`, `feedback`, `trainingdata`

### 3. **Azure Blob Storage**
- **Name**: `ethionavstorage`
- **Containers**:
  - `uploads` – citizen documents
  - `service-assets` – icons, PDFs
- **Access Tier**: Hot
- **Public Access**: Disabled
- **CORS**: Enabled for frontend domain

### 4. **Azure AI Search**
- **Name**: `ethionav-search`
- **Pricing Tier**: Basic or Standard S1
- **Indexes**:
  - `services-index`
  - `documents-index`
- **Data Source**: Blob Storage + PostgreSQL

### 5. **Azure OpenAI**
- **Name**: `ethionav-openai`
- **Model Deployment**:
  - `gpt-35-turbo`
  - `text-embedding-ada-002`
- **Quota**: Request via Azure OpenAI application

### 6. **Azure Key Vault**
- **Name**: `ethionav-keyvault`
- **Secrets**:
  - `POSTGRES_CONN_STRING`
  - `COSMOSDB_CONN_STRING`
  - `OPENAI_API_KEY`
  - `JWT_SECRET`
- **Access Policies**: App Service, DevOps, Admins

### 7. **App Service + Plan**
- **Plan Name**: `ethionav-app-plan`
- **SKU**: `B1` or `P1v3` (for staging/production)
- **Web Apps**:
  - `ethionav-backend`
  - `ethionav-frontend`
- **Runtime**:
  - Backend: Node.js 18 LTS
  - Frontend: Static Web App or React build

### 8. **Application Insights**
- **Name**: `ethionav-insights`
- **Connected To**: App Service
- **Log Analytics Workspace**: `ethionav-logs`

---

## 🔐 Security Best Practices

- Use **Azure Key Vault** for all secrets
- Enable **SSL enforcement** on PostgreSQL and Cosmos DB
- Restrict **public access** to storage accounts
- Enable **Managed Identity** for App Services
- Use **RBAC** for resource access control
- Enable **Diagnostic Logs** and **Activity Logs**

---

## 🔗 Integration Points

| Component | Integrates With |
|-----------|-----------------|
| Backend (Node.js) | PostgreSQL, Cosmos DB, Key Vault, Blob Storage |
| Frontend (React) | Backend APIs, Blob Storage (via SAS tokens) |
| Chatbot (Python) | Azure OpenAI, AI Search, Cosmos DB |
| AI Search | Blob Storage (documents), PostgreSQL (metadata) |
| CI/CD | GitHub Actions → Azure App Service |
| Monitoring | Application Insights, Log Analytics |

---

## 📄 Naming Conventions

| Resource Type | Naming Pattern |
|---------------|----------------|
| Resource Group | `ethiopian-navigator-rg` |
| PostgreSQL Server | `ethionav-postgres-server` |
| Cosmos DB | `ethionav-cosmosdb` |
| Blob Storage | `ethionavstorage` |
| AI Search | `ethionav-search` |
| OpenAI | `ethionav-openai` |
| Key Vault | `ethionav-keyvault` |
| App Service Plan | `ethionav-app-plan` |
| Web App (Backend) | `ethionav-backend` |
| Web App (Frontend) | `ethionav-frontend` |
| App Insights | `ethionav-insights` |

---

## 📌 Next Steps

1. Review and approve architecture
2. Generate Bicep or PowerShell provisioning scripts
3. Audit existing resources
4. Clean up and rollback unused resources
5. Provision fresh setup using IaC
6. Integrate secrets and deploy backend/frontend

---

_Last updated: 2025-10-05 15:48 UTC_



---
