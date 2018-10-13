#!/usr/bin/env bash
set -e

pushd /Users/rjs/dev/cosmic-ray
python setup.py sdist
pushd plugins/execution-engines/celery3
python setup.py sdist
popd
popd

terraform plan
terraform apply -auto-approve
ansible-playbook configure-message-brokers.yml
ansible-playbook configure-cosmic-ray-workers.yml
ansible-playbook deploy-package-under-test.yml
