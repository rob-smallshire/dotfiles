set -e

terraform plan
terraform apply -auto
ansible-playbook configure-message-brokers.yml
ansible-playbook configure-cosmic-ray-workers.yml
ansible-playbook deploy-package-under-test.yml
