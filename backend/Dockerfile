FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libzip-dev libonig-dev libxml2-dev \
    && docker-php-ext-install intl pdo pdo_mysql zip opcache

# Enable Apache Rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy ONLY backend folder (Render context = repo root)
COPY backend/ /var/www/html/

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Prevent Symfony from loading .env during build
ENV APP_ENV=prod
ENV APP_DEBUG=0
ENV SYMFONY_SKIP_ENV_CHECK=1
ENV SYMFONY_DOTENV_VARS=1

# Install PHP dependencies WITHOUT running Symfony scripts
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Fix permissions
RUN chown -R www-data:www-data var

# Warmup cache at runtime, not build time
# (Render injecte les variables d'env APRÈS le build)
CMD ["apache2-foreground"]
