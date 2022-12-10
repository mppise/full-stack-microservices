#!/bin/bash

echo Setting up KUBECONFIG for Kyma on SAP BTP
export KUBECONFIG=~/Code/FullstackMicroservices/4.kyma/kubeconfig.yaml

# clear
kubectl delete -f 3.k8s/ping/
kubectl delete -f 3.k8s/web/
kubectl delete -f 3.k8s/order/
kubectl delete -f 3.k8s/product/

kubectl delete -f 3.k8s/db/mongo-express.yml
kubectl delete -f 3.k8s/db/mongo.yml
kubectl delete -f 3.k8s/db/mongo-volumes.yml

# for c in {0..5}
#    do
#       clear
#       kubectl get pods
#       echo
#       echo
#       echo "Wait for $((30 - $c*5)) more seconds"
#       for (( i=5; i>0; i--)); do
#       sleep 1 &
#       printf "  .. Refreshing in $i ..\r"
#       wait
#    done
# done

kubectl delete -f 3.k8s/common/config.yml
kubectl get configmaps
echo 
echo
kubectl delete -f 3.k8s/common/secret.yml
kubectl get secret
echo
echo
# kubectl delete -f 3.k8s/common/ingress.yml
# kubectl get ingress
# echo
# echo

# for (( i=5; i>0; i--)); do
#     sleep 1 &
#     printf "Dashboard will shutdown in $i seconds ...\r"
#     wait
# done

# pkill -f 'kubectl proxy'

echo ................................................................................
echo Done.