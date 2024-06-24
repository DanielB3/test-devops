**Test DevOps Project**

Este proyecto tiene como objetivo implementar un microservicio Python utilizando contenedores Docker y desplegarlo en un clúster de Kubernetes gestionado por Azure Kubernetes Service (AKS). Además, configuramos monitoreo y visualización de métricas utilizando Prometheus y Grafana, y gestionamos el CI/CD con Azure Pipelines.

**Requisitos Previos**

Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas en tu máquina local:

-Docker: Para construir y gestionar contenedores.
-Kubectl: Herramienta de línea de comandos para interactuar con Kubernetes.
-Helm: Gestor de paquetes para Kubernetes.
-Azure CLI: Herramienta de línea de comandos para interactuar con Azure.
-Cuenta de Azure DevOps: Para configurar y ejecutar pipelines de CI/CD.
-Wrangler: Herramienta de línea de comandos para gestionar Cloudflare Workers.

**Archivos**

-Dockerfile: Dockerfile para el microservicio en Python.
-requirements.txt: Dependencias del microservicio en Python.
-app.py: Código fuente del microservicio.
-deployment.yaml: Archivo YAML para desplegar el pod en Kubernetes.
-azure-pipelines.yml: Archivo YAML para el pipeline en Azure DevOps.
-cloudflare-worker.js: Código del CloudFlare Worker para redimensionar y almacenar en caché imágenes.
-grafana.yaml: Archivo YAML para desplegar Grafana.
-prometheus.yaml: Archivo YAML para desplegar Prometheus.
-worker.js: Código fuente del Cloudflare Worker.
-wrangler.toml: Configuración del Cloudflare Worker.

**Configuración**

**Docker Repository**

Asegúrate de configurar tu registro de Docker en el pipeline de Azure DevOps.

**CloudFlare Worker**

Configura tu CloudFlare Worker con el código proporcionado.

**Kubernetes**

Despliega el pod utilizando el archivo deployment.yaml.

**Variables**

DOCKER_REGISTRY: El registro de Docker donde se subirá la imagen del microservicio. Este valor se configura en el archivo azure-pipelines.yml.
CLOUDFLARE_API_KEY: La clave API para CloudFlare.



**Instrucciones de Implementación**

**Paso 1: Clonar el Repositorio**
Clona este repositorio en tu máquina local:

git clone https://github.com/tu-usuario/test-devops.git
cd test-devops


**Paso 2: Construir la Imagen Docker**
Construye la imagen Docker del microservicio Python:


docker build -t eldanius/python-microservice .


**Paso 3: Publicar la Imagen en Docker Hub**
Asegúrate de tener una cuenta en Docker Hub y haber iniciado sesión:


docker login
docker tag eldanius/python-microservice tu-usuario/python-microservice
docker push tu-usuario/python-microservice


**Paso 4: Crear y Configurar el Clúster AKS**

Crea un clúster AKS en Azure:
az aks create --resource-group test-cluster_group --name test-cluster --node-count 1 --enable-addons monitoring --generate-ssh-keys
Obtén las credenciales para interactuar con el clúster:

az aks get-credentials --resource-group test-cluster_group --name test-cluster


**Paso 5: Desplegar el Microservicio en Kubernetes**
Crea un namespace y despliega el microservicio:

kubectl apply -f deployment.yaml


**Paso 6: Configurar Prometheus y Grafana**
Añade el repositorio de Helm de Prometheus y despliega Prometheus:

helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/prometheus --namespace tech-prod --create-namespace
Despliega Grafana:

kubectl apply -f grafana.yaml
Accede a Grafana:

kubectl port-forward --namespace tech-prod svc/grafana 3000:80
Abre tu navegador web y navega a http://localhost:3000. Usa las credenciales predeterminadas (admin / admin) para iniciar sesión. Cambia la contraseña cuando se te solicite.



**Paso 7: Configurar CI/CD con Azure Pipelines**

Ve a tu proyecto en Azure DevOps y navega a la sección de Pipelines.
Crea un nuevo pipeline y selecciona el repositorio de GitHub que contiene tu proyecto.
Azure Pipelines detectará automáticamente el archivo azure-pipelines.yml en tu repositorio y configurará el pipeline en consecuencia.
Ejecuta el pipeline para ver el proceso de CI/CD en acción.


**Paso 8: Configurar Cloudflare Worker**
Instala Wrangler, la herramienta CLI para gestionar Cloudflare Workers:

npm install -g @cloudflare/wrangler
Inicia sesión en tu cuenta de Cloudflare:

wrangler login
Configura y despliega el Worker desde el archivo wrangler.toml y worker.js:

wrangler deploy
wrangler init --site
wrangler publish
Azure Security Rules and Load Balancer
Para actualizar las reglas de seguridad de red en Azure y verificar el balanceador de carga, sigue estos pasos detallados:


**Actualización de Reglas de Seguridad de Red**

-En el portal de Azure, ve a tu grupo de recursos asociado con el clúster (MC_test-cluster_group_test-cluster_eastus).
-Busca y selecciona el "Grupo de seguridad de red" (aks-agentpool-28249642-nsg).
-En la sección "Configuración", selecciona "Reglas de seguridad de entrada".
-Asegúrate de que exista una regla que permita el tráfico entrante en el puerto 5000 desde cualquier origen (o desde la IP de tu equipo, si prefieres restringirlo).

-Nombre: Permitir-HTTP-5000
-Prioridad: 100
-Origen: *
-Puerto origen: *
-Destino: *
-Puerto destino: 5000
-Protocolo: TCP
-Acción: Allow

**Verificación del Balanceador de Carga**

-En el portal de Azure, ve a tu grupo de recursos asociado con el clúster (MC_test-cluster_group_test-cluster_eastus).
-Selecciona el "Equilibrador de carga".
-En la sección "Configuración", selecciona "Configuración de IP de front-end" para verificar las IPs públicas asignadas.
-Asegúrate de que la IP pública esté correctamente asociada y que las reglas del balanceador de carga estén configuradas para permitir el tráfico en el puerto 5000.
