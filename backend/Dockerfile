FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git unzip libicu-dev libzip-dev libonig-dev libxml2-dev \
    && docker-php-ext-install intl pdo pdo_mysql zip opcache

RUN a2enmod rewrite

WORKDIR /var/www/html

# Copy backend (context = backend)
COPY . /var/www/html/

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

ENV APP_ENV=prod
ENV APP_DEBUG=0

# Temporary env file so Symfony can build
RUN echo "APP_ENV=prod" > .env.local

RUN composer install --no-dev --optimize-autoloader

RUN rm .env.local

RUN chown -R www-data:www-data var

RUN php bin/console cache:clear --env=prod
RUN php bin/console cache:warmup --env=prod

EXPOSE 80

CMD ["apache2-foreground"]
