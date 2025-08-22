CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refreshToken" text,
	"accessToken" text,
	"expiresAt" text,
	"tokenType" text,
	"scope" text,
	"idToken" text,
	"sessionState" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sessionToken" text NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"bio" text,
	"timezone" text DEFAULT 'America/New_York' NOT NULL,
	"avatarUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "portfolio_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"settings" jsonb DEFAULT '{"defaultCurrency":"USD","displayMode":"detailed","sortBy":"value","sortOrder":"desc","benchmarkIndex":"SPY","performancePeriod":"1Y","showUnrealizedGains":true,"showDividends":true,"positionSizeLimit":20,"maxDrawdownAlert":15,"rebalanceThreshold":5,"enableRiskAlerts":true,"targetAllocations":{"stocks":60,"bonds":20,"crypto":10,"cash":5,"commodities":3,"realEstate":2},"chartSettings":{"defaultTimeframe":"1M","chartType":"line","showVolume":true,"showMovingAverages":false},"portfolioNotifications":{"dailyPerformance":false,"weeklyReport":true,"rebalanceAlerts":true,"significantMoves":true,"allocationDrift":true}}'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_settings_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "trading_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"preferences" jsonb DEFAULT '{"defaultView":"dashboard","theme":"dark","metricsRefreshInterval":30,"showRealTimeAlerts":true,"alertThresholds":{"lcp":2500,"fid":100,"cls":0.1,"ttfb":800,"inp":200},"riskTolerance":"moderate","tradingHours":{"start":"09:30","end":"16:00","timezone":"America/New_York"},"emailNotifications":{"performanceAlerts":true,"dailySummary":true,"weeklyReport":true,"systemUpdates":true},"dashboardLayout":{"pinnedMetrics":["lcp","fid","cls"],"widgetPositions":{},"hiddenWidgets":[]}}'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "trading_preferences_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_settings" ADD CONSTRAINT "portfolio_settings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trading_preferences" ADD CONSTRAINT "trading_preferences_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;