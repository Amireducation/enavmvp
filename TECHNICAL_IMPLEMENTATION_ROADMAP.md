# Ethiopian Navigator - Detailed Technical Implementation Roadmap
## Phase-by-Phase Development Plan with Code Architecture

**Version:** 1.0  
**Date:** March 10, 2026  
**Prepared for:** Development Team

---

## Table of Contents

1. [Repository Structure](#repository-structure)
2. [Phase 1 Implementation (Months 1-2)](#phase-1-implementation)
3. [Phase 2 Implementation (Months 2-4)](#phase-2-implementation)
4. [Technology & Library Stack](#technology--library-stack)
5. [Development Workflow](#development-workflow)
6. [Testing Strategy](#testing-strategy)
7. [API Specifications](#api-specifications)

---

## Repository Structure

### Recommended Monorepo Layout

```
enav-platform/
├── .github/
│   ├── workflows/
│   │   ├── ci-backend.yml
│   │   ├── ci-frontend.yml
│   │   ├── deploy-staging.yml
│   │   └── deploy-production.yml
│   └── pull_request_template.md
│
├── apps/
│   ├── user-portal/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── error.tsx
│   │   │   ├── services/
│   │   │   ├── applications/
│   │   │   ├── profile/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── service-card.tsx
│   │   │   ├── application-form.tsx
│   │   │   └── filters.tsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── package.json
│   │
│   ├── admin-portal/
│   ├── partner-portal/
│   ├── g2g-workspace/
│   │
│   └── shared-components/
│       ├── components/
│       │   ├── ui/           # shadcn/ui components
│       │   ├── layout/       # Header, Sidebar, Footer
│       │   ├── forms/        # Reusable forms
│       │   └── charts/       # Analytics charts
│       ├── hooks/
│       ├── lib/
│       ├── types/
│       └── package.json
│
├── services/
│   ├── user-service/
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── strategies/
│   │   │   │   │   │   ├── jwt.strategy.ts
│   │   │   │   │   │   └── local.strategy.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── login.dto.ts
│   │   │   │   │       └── register.dto.ts
│   │   │   │   ├── users/
│   │   │   │   │   ├── users.controller.ts
│   │   │   │   │   ├── users.service.ts
│   │   │   │   │   ├── users.module.ts
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   └── user.entity.ts
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── create-user.dto.ts
│   │   │   │   │       └── update-user.dto.ts
│   │   │   │   └── profiles/
│   │   │   ├── common/
│   │   │   │   ├── decorators/
│   │   │   │   ├── filters/
│   │   │   │   ├── interceptors/
│   │   │   │   ├── middleware/
│   │   │   │   └── guards/
│   │   │   ├── database/
│   │   │   │   ├── migrations/
│   │   │   │   ├── typeorm.config.ts
│   │   │   │   └── seeds/
│   │   │   ├── config/
│   │   │   │   ├── app.config.ts
│   │   │   │   ├── database.config.ts
│   │   │   │   └── jwt.config.ts
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   └── health-check.ts
│   │   ├── test/
│   │   │   ├── auth.spec.ts
│   │   │   └── users.spec.ts
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── service-management-service/
│   ├── content-service/
│   ├── payment-service/
│   ├── notification-service/
│   ├── analytics-service/
│   ├── ai-orchestration-service/
│   ├── partnership-service/
│   ├── g2g-service/
│   ├── b2b-service/
│   │
│   └── api-gateway/
│       ├── kong/
│       │   ├── config/
│       │   │   ├── kong.yml
│       │   │   └── services.yml
│       │   └── plugins/
│       │       ├── rate-limit.yml
│       │       ├── jwt-auth.yml
│       │       └── request-transformer.yml
│       └── docker-compose.yml
│
├── data-platform/
│   ├── cdc/
│   │   └── debezium/
│   │       ├── docker-compose.yml
│   │       └── connectors/
│   │           ├── business-registry.json
│   │           └── tax-system.json
│   ├── etl/
│   │   ├── spark/
│   │   │   ├── bronze-to-silver.py
│   │   │   ├── silver-to-gold.py
│   │   │   └── requirements.txt
│   │   └── airflow/
│   │       ├── dags/
│   │       │   ├── data_ingestion_dag.py
│   │       │   └── transformation_dag.py
│   │       └── docker-compose.yml
│   ├── knowledge-graph/
│   │   ├── neo4j/
│   │   │   ├── seed-data.cypher
│   │   │   └── docker-compose.yml
│   │   └── graph-builder/
│   │       ├── builder.py
│   │       └── requirements.txt
│   └── search/
│       ├── elasticsearch/
│       │   ├── mappings/
│       │   │   ├── services.json
│       │   │   └── policies.json
│       │   └── docker-compose.yml
│       └── indexer/
│           ├── indexer.py
│           └── requirements.txt
│
├── infrastructure/
│   ├── terraform/
│   │   ├── modules/
│   │   │   ├── eks/
│   │   │   │   ├── main.tf
│   │   │   │   ├── variables.tf
│   │   │   │   └── outputs.tf
│   │   │   ├── rds/
│   │   │   ├── s3/
│   │   │   ├── networking/
│   │   │   └── security/
│   │   ├── environments/
│   │   │   ├── dev.tfvars
│   │   │   ├── staging.tfvars
│   │   │   └── prod.tfvars
│   │   └── main.tf
│   │
│   ├── kubernetes/
│   │   ├── namespaces/
│   │   ├── deployments/
│   │   │   ├── user-service.yaml
│   │   │   ├── service-management.yaml
│   │   │   └── ...
│   │   ├── services/
│   │   ├── configmaps/
│   │   ├── secrets/
│   │   ├── ingress.yaml
│   │   └── network-policies.yaml
│   │
│   ├── docker/
│   │   ├── Dockerfile.node
│   │   ├── Dockerfile.python
│   │   └── .dockerignore
│   │
│   └── monitoring/
│       ├── prometheus/
│       │   └── prometheus.yml
│       ├── grafana/
│       │   └── dashboards/
│       └── elasticsearch-stack/
│           └── docker-compose.yml
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   ├── SECURITY.md
│   └── RUNBOOKS/
│       ├── incident-response.md
│       └── disaster-recovery.md
│
├── scripts/
│   ├── setup-dev-env.sh
│   ├── run-tests.sh
│   ├── build-services.sh
│   ├── deploy-staging.sh
│   └── migrate-database.sh
│
├── docker-compose.yml          # Full local development
├── .env.example
├── .gitignore
├── package.json                 # Monorepo root
├── tsconfig.base.json
├── prettier.config.js
├── eslint.config.js
└── README.md
```

---

## Phase 1 Implementation (Months 1-2)

### Sprint 1-2: Infrastructure & Foundation

**Deliverables:**
1. EKS cluster provisioned
2. RDS PostgreSQL configured
3. CloudFront CDN set up
4. Kong API Gateway deployed
5. CI/CD pipelines configured
6. Development environment ready

**Infrastructure Code (Terraform Example):**

```hcl
# infrastructure/terraform/main.tf

module "eks" {
  source = "./modules/eks"
  
  cluster_name    = "enav-${var.environment}"
  cluster_version = "1.27"
  region          = var.aws_region
  
  node_groups = {
    general = {
      desired_size    = 3
      min_size        = 3
      max_size        = 10
      instance_types  = ["t3.xlarge"]
      capacity_type   = "ON_DEMAND"
    }
    spot = {
      desired_size    = 2
      min_size        = 0
      max_size        = 10
      instance_types  = ["t3.large"]
      capacity_type   = "SPOT"
    }
  }
  
  enable_cluster_autoscaler = true
  enable_metrics_server     = true
  enable_karpenter          = true
  
  vpc_config = {
    cidr_block           = "10.0.0.0/16"
    private_subnets     = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
    public_subnets      = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
    enable_nat_gateway  = true
    enable_vpn_gateway  = true
  }
  
  tags = {
    Environment = var.environment
    Project     = "enav"
  }
}

module "rds" {
  source = "./modules/rds"
  
  identifier     = "enav-db-${var.environment}"
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.medium"
  allocated_storage = 100
  
  multi_az            = var.environment == "prod" ? true : false
  backup_retention    = 30
  skip_final_snapshot = var.environment != "prod"
  
  parameter_group_name = "default.postgres15"
  db_subnet_group_name = aws_db_subnet_group.main.name
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  
  performance_insights_enabled = true
  storage_encrypted            = true
  
  tags = {
    Environment = var.environment
    Project     = "enav"
  }
}

module "s3_data_lake" {
  source = "./modules/s3"
  
  buckets = {
    bronze = {
      name    = "enav-bronze-${var.environment}"
      tier    = "STANDARD"
    }
    silver = {
      name    = "enav-silver-${var.environment}"
      tier    = "STANDARD"
    }
    gold = {
      name    = "enav-gold-${var.environment}"
      tier    = "STANDARD"
    }
  }
  
  lifecycle_rules = {
    bronze = {
      expiration_days = 30
    }
  }
  
  enable_versioning = true
  enable_encryption = true
}
```

### Sprint 2: User Service Extraction

**NestJS Project Setup:**

```typescript
// services/user-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('Ethiopian Navigator - User Management Service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
  });
  
  await app.listen(3001);
  console.log(`User Service running on port 3001`);
}

bootstrap();
```

**Database Schema (PostgreSQL):**

```sql
-- services/user-service/src/database/migrations/001_initial_schema.sql

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'citizen',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_secret VARCHAR(255),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_role (role),
  INDEX idx_created_at (created_at)
);

CREATE TABLE user_profiles (
  profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(10),
  company_name VARCHAR(255),
  company_tin VARCHAR(20),  -- Tax Identification Number
  address TEXT,
  city VARCHAR(100),
  region VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Ethiopia',
  profile_picture_url TEXT,
  bio TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);

CREATE TABLE audit_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  changes JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  status VARCHAR(20),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_user_id_created (user_id, created_at),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);
```

**Auth Service Implementation:**

```typescript
// services/user-service/src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;
    
    // Check if user exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await this.usersService.create({
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
    });
    
    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user);
    
    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Update last login
    await this.usersService.updateLastLogin(user.userId);
    
    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(user);
    
    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      
      const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(user);
      
      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(user: any) {
    const payload = {
      sub: user.userId,
      email: user.email,
      role: user.role,
    };
    
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '30m',
    });
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    });
    
    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { passwordHash, mfaSecret, ...sanitized } = user;
    return sanitized;
  }
}
```

### Sprint 3-4: API Gateway & CI/CD

**Kong Configuration:**

```yaml
# infrastructure/kong/config/services.yml
services:
  - name: user-service
    url: http://user-service:3001
    routes:
      - name: auth
        paths:
          - /api/v1/auth
      - name: users
        paths:
          - /api/v1/users
    plugins:
      - name: jwt
        config:
          secret: ${JWT_SECRET}
          key_claim_name: sub
      - name: rate-limiting
        config:
          minute: 100
          hour: 1000
      - name: cors
        config:
          origins:
            - "*"
          credentials: true

  - name: service-management
    url: http://service-management:3002
    routes:
      - name: services
        paths:
          - /api/v1/services
      - name: requests
        paths:
          - /api/v1/requests
    plugins:
      - name: jwt
      - name: rate-limiting
        config:
          minute: 100
```

**GitHub Actions CI/CD Pipeline:**

```yaml
# .github/workflows/ci-backend.yml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'services/**'
      - 'infrastructure/**'
  pull_request:
    branches: [develop]
    paths:
      - 'services/**'

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [user-service, service-management]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: cd services/${{ matrix.service }} && npm ci
      
      - name: Lint
        run: cd services/${{ matrix.service }} && npm run lint
      
      - name: Build
        run: cd services/${{ matrix.service }} && npm run build
      
      - name: Run tests
        run: cd services/${{ matrix.service }} && npm run test
      
      - name: Build Docker image
        run: |
          docker build -t ${{ matrix.service }}:latest \
            -f infrastructure/docker/Dockerfile.node \
            services/${{ matrix.service }}
      
      - name: Push to ECR
        if: github.event_name == 'push'
        run: |
          aws ecr get-login-password --region us-east-1 | \
          docker login --username AWS --password-stdin ${{ secrets.ECR_REGISTRY }}
          docker tag ${{ matrix.service }}:latest \
            ${{ secrets.ECR_REGISTRY }}/${{ matrix.service }}:${{ github.sha }}
          docker push ${{ secrets.ECR_REGISTRY }}/${{ matrix.service }}:${{ github.sha }}

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

---

## Phase 2 Implementation (Months 2-4)

### Microservice Development Templates

**Service Management Service (NestJS):**

```typescript
// services/service-management-service/src/modules/services/services.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createService(createServiceDto: CreateServiceDto) {
    const service = this.serviceRepository.create(createServiceDto);
    const savedService = await this.serviceRepository.save(service);
    
    // Emit event for other services
    this.eventEmitter.emit('service.created', {
      serviceId: savedService.serviceId,
      name: savedService.name,
      ministry: savedService.ministry,
      timestamp: new Date(),
    });
    
    return savedService;
  }

  async submitRequest(serviceId: string, userId: string, requestData: any) {
    const request = await this.createServiceRequest({
      serviceId,
      userId,
      data: requestData,
      status: 'submitted',
    });
    
    // Emit event
    this.eventEmitter.emit('request.submitted', {
      requestId: request.requestId,
      serviceId,
      userId,
      timestamp: new Date(),
    });
    
    return request;
  }

  private async createServiceRequest(data: any) {
    // Database insert logic
    return { requestId: 'req-123', ...data };
  }
}
```

**Event-Driven Communication:**

```typescript
// services/notification-service/src/listeners/event.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class EventListener {
  constructor(private notificationService: NotificationService) {}

  @OnEvent('request.submitted')
  async handleRequestSubmitted(payload: any) {
    await this.notificationService.sendEmail({
      to: payload.userEmail,
      subject: 'Your service request has been received',
      template: 'request-submitted',
      data: {
        requestId: payload.requestId,
        serviceName: payload.serviceName,
      },
    });
  }

  @OnEvent('request.approved')
  async handleRequestApproved(payload: any) {
    await this.notificationService.sendEmail({
      to: payload.userEmail,
      subject: 'Your service request has been approved',
      template: 'request-approved',
    });
  }
}
```

### Frontend Portal Architecture

**User Portal - Landing Page:**

```typescript
// apps/user-portal/app/page.tsx
import { Metadata } from 'next';
import { HeroSection } from '@/components/sections/hero';
import { FeaturesSection } from '@/components/sections/features';
import { ServicesPreview } from '@/components/sections/services-preview';
import { CTASection } from '@/components/sections/cta';

export const metadata: Metadata = {
  title: 'Ethiopian Navigator - Digital Government Services',
  description: 'Access government services, business information, and collaboration tools',
  openGraph: {
    title: 'Ethiopian Navigator',
    description: 'Ethiopia\'s Premier Digital Ecosystem',
  },
};

export default async function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ServicesPreview />
      <CTASection />
    </main>
  );
}
```

**Service Request Form Component:**

```typescript
// apps/user-portal/components/forms/service-request-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/file-upload';
import { toast } from 'sonner';
import { submitServiceRequest } from '@/lib/api/services';

const formSchema = z.object({
  serviceId: z.string().min(1, 'Service is required'),
  documents: z.array(z.instanceof(File)).min(1, 'At least one document is required'),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ServiceRequestForm({ serviceId }: { serviceId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceId,
      documents: [],
      additionalInfo: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      const response = await submitServiceRequest({
        serviceId: values.serviceId,
        documents: values.documents,
        additionalInfo: values.additionalInfo,
      });
      
      toast.success('Service request submitted successfully');
      form.reset();
      
      // Redirect to application details
      window.location.href = `/applications/${response.requestId}`;
    } catch (error) {
      toast.error('Failed to submit request');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="documents"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Supporting Documents</FormLabel>
              <FormControl>
                <FileUpload
                  onFilesSelected={(files) => field.onChange(files)}
                  maxFiles={5}
                  acceptedFormats={['pdf', 'doc', 'docx', 'jpg', 'png']}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Information (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional details you want to provide..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </Form>
  );
}
```

---

## Technology & Library Stack

### Backend Stack

**Framework & Runtime:**
- **NestJS** 10.x - Microservice framework
- **Node.js** 20.x - Runtime
- **TypeScript** 5.x - Type safety

**Databases:**
- **PostgreSQL** 15.x - Primary relational DB
- **MongoDB** 7.x - Document store
- **Neo4j** 5.x - Knowledge graph
- **Redis** 7.x - Cache & sessions
- **Elasticsearch** 8.x - Search

**Message Queue & Events:**
- **Apache Kafka** 3.5.x - Distributed event streaming
- **Bull** - Job queue for Node.js

**ORM & Query:**
- **TypeORM** - ORM for PostgreSQL
- **Mongoose** - MongoDB ODM
- **Neo4j.js** - Neo4j driver

**Validation & Serialization:**
- **Zod** - Schema validation
- **class-validator** - DTO validation
- **class-transformer** - Object transformation

**Authentication & Security:**
- **@nestjs/jwt** - JWT tokens
- **bcryptjs** - Password hashing
- **@nestjs/passport** - Authentication strategies
- **helmet** - HTTP security headers

**Testing:**
- **Jest** - Unit testing
- **Supertest** - HTTP assertion
- **Testcontainers** - Integration testing with containers

**Monitoring & Logging:**
- **Winston** - Structured logging
- **Pino** - Fast logging
- **@nestjs/caching** - Caching layer
- **Prometheus** - Metrics

### Frontend Stack

**Framework & Library:**
- **Next.js** 16.x - React framework
- **React** 19.x - UI library
- **TypeScript** 5.x - Type safety

**UI & Styling:**
- **Tailwind CSS** 4.x - Utility CSS
- **shadcn/ui** - Component library
- **Radix UI** - Headless components
- **Lucide React** - Icons

**Form & Validation:**
- **react-hook-form** - Form state management
- **Zod** - Schema validation

**State Management & Data Fetching:**
- **SWR** - Data fetching & caching
- **TanStack Query** (optional) - Advanced data management
- **Context API** - Global state

**Internationalization:**
- **i18next** - Multilingual support
- **react-i18next** - React integration

**Testing:**
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Cypress** - E2E testing
- **Playwright** - Browser automation

---

## Development Workflow

### Git Workflow

**Branch Strategy:**
```
main              - Production releases only
├── staging       - Staging environment
└── develop       - Development branch
    └── feature/* - Feature branches (feature/user-auth, feature/payment-integration)
    └── bugfix/*  - Bug fixes (bugfix/login-issue)
    └── release/* - Release branches (release/v1.0.0)
```

**Commit Convention:**
```
feat(auth): add multi-factor authentication
fix(payment): resolve webhook timeout issue
docs(api): update auth endpoint documentation
test(services): add integration tests for service creation
chore(deps): update dependency versions
refactor(db): optimize query performance
```

### Code Review Process

1. Create feature branch
2. Implement feature with tests
3. Create Pull Request
4. Code review (2 approvals required)
5. Merge to develop
6. Deploy to staging
7. QA testing
8. Merge to main (release)
9. Deploy to production

---

## Testing Strategy

### Test Coverage Targets

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user journeys
- **Performance Tests**: Load testing

### Example Test Structure

```typescript
// services/user-service/src/modules/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should create a new user and return tokens', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const mockUser = {
        userId: '123',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(registerDto.email);
    });
  });
});
```

---

## API Specifications

### REST API Standards

**Base URL:** `https://api.enav.et/api/v1`

**Authentication:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response Format:**
```json
{
  "success": true,
  "data": { /* resource data */ },
  "meta": {
    "timestamp": "2026-03-10T10:30:00Z",
    "requestId": "req-uuid"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid input",
    "details": {
      "email": "Invalid email format"
    }
  },
  "meta": {
    "timestamp": "2026-03-10T10:30:00Z",
    "requestId": "req-uuid"
  }
}
```

### Key API Endpoints (Phase 1-2)

**Auth Service:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - User logout
- `POST /auth/mfa/setup` - Setup MFA

**Users Service:**
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update profile
- `GET /users/{id}` - Get user (admin)
- `PUT /users/{id}/role` - Update user role (admin)

**Services:**
- `GET /services` - List services
- `GET /services/{id}` - Get service details
- `POST /services/{id}/request` - Submit service request
- `GET /requests` - List user requests
- `GET /requests/{id}` - Get request details
- `PUT /requests/{id}/status` - Update request status (admin)

---

**END OF TECHNICAL ROADMAP**

*This document will be updated after each phase with actual implementation learnings and adjustments. Refer to this document for development consistency and architectural decisions.*
