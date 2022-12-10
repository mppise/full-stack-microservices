#!/bin/bash

echo Setting up KUBECONFIG for Kyma on SAP BTP
export KUBECONFIG=~/Code/FullstackMicroservices/4.kyma/kubeconfig.yaml

# clear
# ../startDashboard.sh

kubectl apply -f 3.k8s/common/config.yml
kubectl get configmaps
kubectl apply -f 3.k8s/common/secret.yml
kubectl get secrets
# kubectl apply -f 3.k8s/common/ingress.yml
# kubectl get ingress

kubectl apply -f 3.k8s/db/mongo-volumes.yml
kubectl get pv
kubectl get pvc 
kubectl apply -f 3.k8s/db/mongo.yml

for c in {0..0}
   do
      clear
      kubectl get pods
      echo
      echo
      echo "Wait for $((10 - $c*5)) more seconds"
      for (( i=10; i>0; i--)); do
      sleep 1 &
      printf "  .. Resuming in $i ..\r"
      wait
   done
done

kubectl apply -f 3.k8s/db/mongo-express.yml
kubectl apply -f 3.k8s/product/
kubectl apply -f 3.k8s/order/
kubectl apply -f 3.k8s/web/
kubectl apply -f 3.k8s/ping/
kubectl get pods 

# for c in {0..12}
#    do
#       clear
#       kubectl get pods
#       echo
#       echo
#       kubectl get ingress
#       echo
#       echo
#       echo "Wait for $((60 - $c*5)) more seconds"
#       for (( i=5; i>0; i--)); do
#       sleep 1 &
#       printf "  .. Refreshing in $i ..\r"
#       wait
#    done
# done

echo ................................................................................
echo Done.