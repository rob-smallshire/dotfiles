# Provision AWS infrastructure

PLAYING WITH THIS STUFF CREATES INFRASTRUCTURE WHICH COSTS MONEY!

Take care to clean up after any experiments.

## Initial setup (once only)

0. You need an AWS key pair. You can generate these through AWS.

1. You need to provide your own `terraform.tfvars`. It will need to contain
   your equivalent of this, for AWS:

       access_key = "ABCDEFGHIJKLMNOPQRST"
       secret_key = "ABCDEFGHIJKLMNOPQRST123456789ABCDEFGGHIJ"
       key_name = "<aws-key-name>"
       public_key_filepath = "~/.ssh/<public-key-file>.pub"

2. Install the terraform-provider-ansible plugin for Terraform. Do this by
   running:

       $ go get github.com/nbering/terraform-provider-ansible
       $ cd $GOPATH/src/github.com/nbering/terraform-provider-ansible
       $ make
       $ cp $GOPATH/bin/terraform-provider-ansible ~/.terraform.d/plugins/darwin_amd64/terraform-provider-ansible

3. Change into the `infra` directory of your clone of this repo.

       $ cd infra

4. Install the terraform-inventory dynamic inventory for Ansible. To do this,
   clone the repository somewhere else, then symlink the Python file into this
   directory with a more sensible name:

       $ pushd <somewhere-else>
       $ git clone https://github.com/nbering/terraform-inventory.git
       $ popd
       $ ln -s <somewhere-else>/terraform-inventory/terraform.py ./terraform-inventory

5. Initialize the Terraform backend:

       $ terraform init -backend-config=terraform.tfvars

6. If you key already exists in AWS (for example, because you created it there)
   import it into Terraform:

       $ terraform import aws_key_pair.personal <aws-key-name>

   If you don't do this, Terraform will later give you an error about
   duplicate keys when it tries to upload the keys again.

6. Copy `ansible.cfg.template` to `ansible.cfg` and provide the path to your
   SSH private key, which Ansible will use to connect to the hosts on AWS.

       $ cp ansible.cfg.template ansible.cfg
       $ vi ansible.cfg


## Provision infrastructure

1. Ask terraform what it needs to do to deploy the infrastructure:

       $ terraform plan

2. Tell terraform to do it:

       $ terraform apply

   This will create a host for RabbitMQ and several hosts for Celery workers.

3. (Optional) Report information about the provisioned resources:

       $ terraform show

   This enables you to get IP addresses and whatnot.

## (Optional) Ansible sanity check

1. We use an Ansible dynamic inventory which queries the Terraform state. You
   can run it directly to see which hosts have been provisioned by Terraform,
   in a format that Ansible can consume:

       $ ./terraform-inventory

2. You can log into one of the machines as the `ubuntu` user:
   as we're using the Ubuntu 16.04 AMI. Get the hostname from the invocation of
   `terraform-inventory`, above.

       $ ssh -i ~/.ssh/<your-private-key>.pem ubuntu@ec2-34-240-69-169.eu-west-1.compute.amazonaws.com

3. You can also use Ansible to run ad-hoc command on the host groups defined in
   this inventory. For example, to query the uptime of all the celery worker
   hosts:

       $ ansible celery-worker-hosts --private-key ~/.ssh/<your-private-key>.pem -i terraform-inventory -a uptime

   although the arguments are defaulted in ansible.cfg so you can just do if the
   default values suit:

       $ ansible celery-worker-hosts -a uptime


## Configure the message broker host

1. Use the `configure-message-brokers.yml` playbook to configure the message
   broker host. This host will be configured with RabbitMQ to work with Celery:

       $ ansible-playbook configure-message-brokers.yml


## Configure the Celery worker hosts

1. Use the `configure-celery-workers.yml` playbook to configure the Celery
   worker hosts. This host will be configured with a Celery works which
   subscribe to the message broker:

       $ ansible-playbook configure-celery-workers.yml


## Tear down the infrastructure

1. Ask Terraform what it will need to do to tear down the infrastructure.

       $ terraform plan -destroy

2. Destroy the infrastructure

       $ terraform destroy
