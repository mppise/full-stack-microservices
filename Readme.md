# OnlineStore

OnlineStore is a docker based application that runs on Kubernetes. This is an example to demonstrate microservices based application development and deployment methodology. All tiers in this application are containerized (i.e. database, middleware business logic and web application). Business logic tier is further split into multiple business microservices (i.e. product and order) to demonstrate how each microservice can be scaled independently of another.

**High-Level Assumptions**

- There is no user authentication in place.
- All users can see all products and all orders.
- Order does not contain user details (e.g. Name, Shipping details, Payment information, etc.)
- There is just one single database. Database level high availavility is out of scope here (since it would highly depend on type of the database used).
- Data is not persisted on host volume. Hence data is lost every time the DB container is restarted. However, master data reload service is created to prepolulate master data records.
- Application is available on localhost (for now, to avoid changes to /etc/hosts file). Domain name can added to the ingress definition.

---

The application architecture consists of 4 tiers:

#### DB
The DB layer is a mongodb database that contains collections for storing products and orders.


#### APP
The APP layer is nodejs based application that provides APIs. The APIs are consumed in the UI layer and interact with the DB layer to retrieve products and create orders.
Each business component (i.e. product and order) is separated into individual microservice to demonstrate independent scalability.


#### UI
The UI layer is a lean Ionic based ([progressive](https://ionicframework.com/docs/angular/pwa)) web application that provides an interface to list products and orders and place new orders. 
Once the Ionic app is built, a docker container is built that is based on [apache httpd](https://hub.docker.com/_/httpd) so web frontend can also be scaled independently.


#### INGRESS
[Nginx Ingress Controller](https://www.nginx.com/products/nginx/kubernetes-ingress-controller/) is the first layer that the user hits to access the Online Store as well as the APIs used by the web application. Both, the web app and the apis are deployed on 2 separate ingress resources.

#### Kyma
[Kyma on SAP BTP](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/606ec610ee4746c09d5d2bef5a85a124.html) is a runtime supported on SAP Business Technology Platform (SAP BTP) that allows SAP BTP developers to deploy Kubernetes workload on it. More information is available on [Kyma Project](https://kyma-project.io). 

Once `kubectl` is pointing to your Kyma cluster via the `$KUBECONFIG` environment variable, deploying any existing kubernetes assets is just the same. The only difference to point here is that because Kyma comes in-built with Istio, your App or APIs must be exposed externally via a Custom Resouce Definition called **APIRule**.

