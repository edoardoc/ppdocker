# se vai con 7.2 devi metterlo come prima ma togliere gd ed exif
# invece per 7.3 togli mcrypt e zip
FROM php:7.2.23-fpm
ARG TIMEZONE

RUN apt-get update && apt-get install -y \
    telnet \
    openssl \
    git \
    unzip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer --version

# Set timezone
RUN ln -snf /usr/share/zoneinfo/${TIMEZONE} /etc/localtime && echo ${TIMEZONE} > /etc/timezone
RUN printf '[PHP]\ndate.timezone = "%s"\n', ${TIMEZONE} > /usr/local/etc/php/conf.d/tzone.ini
RUN "date"

# RUN apt-get update && apt-get install -y libmcrypt-dev \
  #   && docker-php-ext-install mcrypt pgsql pdo_pgsql json

RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libicu-dev \
        libpq-dev \
        libvpx-dev \
#    && pecl install xdebug \
#    && docker-php-ext-enable xdebug \
    && docker-php-ext-install -j$(nproc) intl \
    && docker-php-ext-install -j$(nproc) zip \
    && docker-php-ext-install -j$(nproc) pgsql \
    && docker-php-ext-install -j$(nproc) pdo_pgsql \
    && docker-php-ext-install -j$(nproc) json \
    && docker-php-ext-install -j$(nproc) exif

# la parte in basso e' presa da https://stackoverflow.com/a/56205201/436085 riguardo gd
RUN docker-php-ext-install mysqli pdo pdo_mysql
RUN apt-get update -y && apt-get install -y libwebp-dev libjpeg62-turbo-dev libpng-dev libxpm-dev \
    libfreetype6-dev
RUN apt-get update && \
    apt-get install -y \
        zlib1g-dev 
RUN docker-php-ext-install mbstring
RUN apt-get install -y libzip-dev
RUN docker-php-ext-install zip
RUN docker-php-ext-configure gd --with-gd --with-webp-dir --with-jpeg-dir \
    --with-png-dir --with-zlib-dir --with-xpm-dir --with-freetype-dir \
    --enable-gd-native-ttf
RUN docker-php-ext-install gd

# opcache
RUN docker-php-ext-configure opcache --enable-opcache \
    && docker-php-ext-install opcache
    

RUN apt-get update && apt-get install -y procps
RUN usermod -u 1000 www-data
USER www-data
WORKDIR /var/www

#CMD ["php", "app/bin/console", "doctrine:schema:update", "--force"]
