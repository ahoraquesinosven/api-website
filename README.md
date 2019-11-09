# Observatorio Site

Web site for Observatorio de las Violencias de Género “Ahora Que Sí Nos Ven” 

This is a [strapi](https://strapi.io/) site with postgres database.

## Configuration

### Environment

Most of the application settings are configured through environment variables.  In your local development environment, you can setup those environment variables in the docker-compose.yml

## Development

### Prerequisites

We use a dockerized development environment, so you will need [docker](https://www.docker.com/) on your machine and also [docker-compose](https://docs.docker.com/compose/install/). We also need the [google cloud sdk](https://cloud.google.com/sdk/) installed locally to generate the authorization files that will be mounted on the docker container to authorize access to google cloud services. No other dependencies are required in your machine.(FOR FUTURE)

### Quick start

* Run `docker-compose up`. If you keep original variables you'll find Strapi Admin at http://localhost:1337/admin/  

### Common tasks

This is a standard docker-compose project, so you can start all the necessary connected containers using `docker-compose up`. This will build images.

## License

Copyright 2019 Ahora Que Si Nos Ven

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
