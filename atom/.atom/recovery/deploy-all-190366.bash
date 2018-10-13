#!/usr/bin/env bash
set -e

terraform plan
terraform apply -auto-approve
ansible-playbook configure-message-brokers.yml
ansible-playbook configure-cosmic-ray-workers.yml
ansible-playbook deploy-package-under-test.yml
