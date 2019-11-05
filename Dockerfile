FROM strapi/strapi

COPY . /srv/app

RUN npm install
