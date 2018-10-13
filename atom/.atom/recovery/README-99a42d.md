# Provision AWS infrastructure

PLAYING WITH THIS STUFF CREATES INFRASTRUCTURE WHICH COSTS MONEY!

Take care to clean up after any experiments.

1. You probably want to provide your own `terraform.tfvars` rather than using
   mine.

2. Install the terraform-provider-ansible plugin for Terraform. Do this by
   running:

     $ go get github.com/nbering/terraform-provider-ansible
     $ cd $GOPATH/src/github.com/nbering/terraform-provider-ansible
     $ make
     $ cp /Users/rjs/dev/go/bin/terraform-provider-ansible ~/.terraform.d/plugins/darwin_amd64/terraform-provider-ansible

3. Install the terraform-inventory dynamic inventory for Ansible. To do this,
   clone the repository somewhere else, then symlink the Python file into this
   directory with a more sensible name:

     $ pushd <somewhere-else>
     $ git clone https://github.com/nbering/terraform-inventory.git
     $ popd
     $ ln -s <somewhere-else>/terraform-inventory/terraform.py ./terraform-inventory

4. Initialize the backend:

    $ terraform init -backend-config=terraform.tfvars

5. Ask terraform what it needs to do to deploy the infrastructure:

    $ terraform plan

6. Tell terraform to do it:

    $ terraform apply

   This will create a couple of EC2 instances and a Kinesis stream.

7. Report information about the provisioned resources:

    $ terraform show

   This enables you to get IP addresses and whatnot.

8. Run terraform-inventory to extract information about what has been
   provisioned, in a format suitable for consumption by Ansible:

     $ ./terraform-inventory

9. You can log into one of the machines, like this, as the ec2-user,
   assuming your using the Amazon Linux 2 AMI.

    $ ssh -i ~/.ssh/rob-key-pair-ireland.pem ec2-user@ec2-34-240-69-169.eu-west-1.compute.amazonaws.com

10. Or you can use ansible to query the uptime of all the celery worker hosts:

    $ ansible celery-worker-hosts --private-key ~/.ssh/rob-key-pair-ireland.pem -i terraform-inventory -a uptime

   although the arguments are defaulted in ansible.cfg so you can just do if the
   default values suit:

    $ ansible celery-worker-hosts -a uptime

11. Ask Terraform what it will need to do to tear down the infrastructure.

    $ terraform plan -destroy

12. Destroy the infrastructure

    $ terraform destroy
