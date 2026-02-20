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

# Fix permissions (create var/ before chown)
RUN mkdir -p var && chown -R www-data:www-data var

# Configure Apache to serve the Symfony public/ directory
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Restore correct Directory permissions for Symfony
RUN echo "<Directory /var/www/html/> \
    AllowOverride All \
</Directory>" > /etc/apache2/conf-available/symfony.conf \
    && a2enconf symfony

# Start Apache
CMD ["apache2-foreground"]
