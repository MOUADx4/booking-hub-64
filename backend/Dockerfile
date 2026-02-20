FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libzip-dev libonig-dev libxml2-dev \
    && docker-php-ext-install intl pdo pdo_mysql zip opcache

# Enable Apache Rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy ONLY backend folder
COPY backend/ /var/www/html/

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Symfony environment MUST be set BEFORE composer install
ENV APP_ENV=prod
ENV APP_DEBUG=0

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Fix permissions
RUN chown -R www-data:www-data var

# Warmup cache
RUN php bin/console cache:clear --env=prod
RUN php bin/console cache:warmup --env=prod

EXPOSE 80

CMD ["apache2-foreground"]
