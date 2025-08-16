terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
  required_version = ">= 1.0"
}

provider "azurerm" {
  features {}
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "rg-espn-ff"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "East US"
}

variable "app_name" {
  description = "Name of the app service"
  type        = string
  default     = "espn-ff-app"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "espn_s2" {
  description = "ESPN S2 cookie for authentication"
  type        = string
  sensitive   = true
  default     = ""
}

variable "swid" {
  description = "ESPN SWID cookie for authentication"
  type        = string
  sensitive   = true
  default     = ""
}

resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    Environment = var.environment
    Project     = "ESPN-FF"
  }
}

resource "azurerm_service_plan" "main" {
  name                = "sp-${var.app_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  os_type            = "Linux"
  sku_name           = "B1"

  tags = {
    Environment = var.environment
    Project     = "ESPN-FF"
  }
}

resource "azurerm_linux_web_app" "main" {
  name                = "${var.app_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_service_plan.main.location
  service_plan_id    = azurerm_service_plan.main.id

  site_config {
    always_on = false
    
    application_stack {
      docker_image_name   = "espn-ff:latest"
      docker_registry_url = "https://index.docker.io"
    }
  }

  app_settings = {
    "DOCKER_REGISTRY_SERVER_URL" = "https://index.docker.io"
    "ESPN_S2"                    = var.espn_s2
    "SWID"                       = var.swid
    "NEXT_PUBLIC_APP_NAME"       = "ESPN Fantasy Football"
    "NEXT_PUBLIC_API_BASE_URL"   = "https://${var.app_name}-${var.environment}.azurewebsites.net"
  }

  tags = {
    Environment = var.environment
    Project     = "ESPN-FF"
  }
}

output "app_service_url" {
  value = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "app_service_name" {
  value = azurerm_linux_web_app.main.name
}